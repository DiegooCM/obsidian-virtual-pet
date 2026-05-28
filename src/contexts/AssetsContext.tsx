import { createContext, ReactNode, use, useEffect } from "react";
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

const AssetsContext = createContext<AssetsContextI | undefined>(undefined);

export const AssetsProvider = ({ children }: AssetsProviderI) => {
  const assetsStored = assetsDefault;
  const assets: AssetsT = AssetsJson;

  // Turns the Base 64 to a blob url
  const loadImage = (name: string, path: string) => {
    try {
      const contentType = "";
      const sliceSize = 512;
      const byteCharacters = atob(path);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      return blobUrl;
    } catch (error) {
      throw new Error(`Error loading image ${name}: ${error}`);
    }
  };

  const getAsset = async (assetCategory: AssetCategoriesT, name: string) => {
    // Checks if the asset has already been fetched
    const assetToAdd = assetsStored[assetCategory][name];
    if (assetToAdd) return assetToAdd;

    // If is not already added
    //data:image/png;base64,
    const path = `${assets[assetCategory][name]}`;

    const blobUrl = loadImage(name, path);

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
  }, [assetsStored]);

  return <AssetsContext value={{ getAsset }}>{children}</AssetsContext>;
};

export const useAssets = () => {
  const context = use(AssetsContext);
  if (context === undefined) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
};
