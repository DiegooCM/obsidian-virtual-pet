import { App } from "obsidian";
import { createContext, ReactNode, useEffect } from "react";
import { AssetCategories, Assets, AssetsContextI } from "src/types";

interface AssetsProviderI {
  app: App;
  children: ReactNode;
}

const assetsDefault: Assets = {
  Backgrounds: {},
  Accessories: {},
  Spritesheets: {},
  Others: {},
};

export const AssetsContext = createContext<AssetsContextI | null>(null);

export const AssetsProvider = ({ app, children }: AssetsProviderI) => {
  const assets = assetsDefault;

  const loadImage = async (name: string, path: string) => {
    try {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      return blobUrl;
    } catch (error) {
      console.error(`Error loading image ${name}: ${error}`);
      throw new Error(error);
    }
  };

  const getAsset = async (assetCategory: AssetCategories, name: string) => {
    // Checks if the asset has already been fetched
    const assetToAdd = assets[assetCategory][name];
    if (assetToAdd) return assetToAdd;

    // If is not already added
    const path = app.vault.adapter.getResourcePath(
      "./.obsidian/plugins/obsidian-virtual-pet/assets/" +
        assetCategory +
        "/" +
        name +
        ".png",
    );

    const blobUrl = await loadImage(name, path);

    assets[assetCategory][name] = blobUrl;

    return blobUrl;
  };

  useEffect(() => {
    return () => {
      for (const [, assetCategory] of Object.entries(assets)) {
        for (const [, blob] of Object.entries(assetCategory)) {
          URL.revokeObjectURL(blob);
        }
      }
    };
  }, []);

  return <AssetsContext value={{ getAsset }}>{children}</AssetsContext>;
};
