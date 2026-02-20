import { createContext, ReactNode, useEffect } from "react";
import { AssetCategoriesT, AssetsT, AssetsContextI } from "src/types";
import AssetsJson from "src/jsons/assets.json";

interface AssetsProviderI {
  children: ReactNode;
}

const assetsDefault: AssetsT = {
  Backgrounds: {},
  Accessories: {},
  Spritesheets: {},
  Others: {},
};

export const AssetsContext = createContext<AssetsContextI | null>(null);

export const AssetsProvider = ({ children }: AssetsProviderI) => {
  const assetsStored = assetsDefault;
  const assets: AssetsT = AssetsJson;

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

  const getAsset = async (assetCategory: AssetCategoriesT, name: string) => {
    // Checks if the asset has already been fetched
    const assetToAdd = assetsStored[assetCategory][name];
    if (assetToAdd) return assetToAdd;

    // If is not already added
    const path = `data:image/png;base64,${assets[assetCategory][name]}`;

    const blobUrl = await loadImage(name, path);

    assetsStored[assetCategory][name] = blobUrl;

    return blobUrl;
  };

  useEffect(() => {
    return () => {
      for (const [, assetCategory] of Object.entries(assetsStored)) {
        for (const [, blob] of Object.entries(assetCategory)) {
          URL.revokeObjectURL(blob);
        }
      }
    };
  }, []);

  return <AssetsContext value={{ getAsset }}>{children}</AssetsContext>;
};
