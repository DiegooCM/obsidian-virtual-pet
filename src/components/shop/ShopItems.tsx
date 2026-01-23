import { memo, useEffect, useRef, useState } from "react";
import StatsHandler from "src/utils/statsHandler";
import {
  GetAssetT,
  ItemCategory,
  ItemJson,
  ItemsCategory,
  ItemsJson,
  UserItems,
  UserStats,
} from "src/types";

interface ShopItemsI {
  userItems: UserItems;
  userStats: UserStats;
  statsHandler: StatsHandler;
  getAsset: GetAssetT;
  items: ItemsJson;
}

export const ShopItems = memo(function ShopItems({
  userItems,
  userStats,
  statsHandler,
  getAsset,
  items,
}: ShopItemsI) {
  const [shopUserItems, setShopUserItems] = useState(userItems);

  const ShopItem = ({
    item,
    itemsCategory,
  }: {
    item: ItemJson;
    itemsCategory: ItemsCategory;
  }) => {
    const itemImageRef = useRef<HTMLImageElement | null>(null);

    const ItemButton = ({ itemState }: { itemState: string }) => {
      if (itemState === "equiped") {
        return (
          <button
            className="item-equiped"
            onClick={() => {
              setShopUserItems(
                statsHandler.unequipItem(itemsCategory.category),
              );
            }}
          >
            Unequip
          </button>
        );
      } else if (itemState === "obtained") {
        return (
          <button
            className="item-obtained"
            onClick={() => {
              setShopUserItems(
                statsHandler.equipItem(item.name, itemsCategory.category),
              );
            }}
          >
            Equip
          </button>
        );
      } else {
        return (
          <button
            className="item-price"
            onClick={() => {
              buyItem(item.name, itemsCategory.category);
            }}
          >
            Price: {item.price}
          </button>
        );
      }
    };

    const itemState = checkItem(item.name, itemsCategory.category);

    useEffect(() => {
      getAsset(itemsCategory.category, item.name).then((asset) => {
        if (itemImageRef.current) itemImageRef.current.src = asset;
      });
    }, []);

    return (
      <div className="shop-item">
        <img ref={itemImageRef} />

        <div className="item-info">
          <p className="item-name">{item.name}</p>
          <ItemButton itemState={itemState} />
        </div>
      </div>
    );
  };

  // Checks what is the state of the item ("equiped", "obtained", ""(not buyed))
  const checkItem = (itemName: string, itemCategory: ItemCategory) => {
    if (shopUserItems.equiped[itemCategory] === itemName) return "equiped";
    else if (shopUserItems.obtained[itemCategory].includes(itemName))
      return "obtained";
    else return "";
  };

  const buyItem = (itemName: string, itemCategory: ItemCategory) => {
    const itemPrice = items
      .find((itemsCategory) => itemsCategory.category === itemCategory)
      ?.items.find((item) => item.name === itemName)?.price;

    if (itemPrice && userStats.coins > itemPrice) {
      const [, newItems] = statsHandler.addNewItem(
        itemName,
        itemCategory,
        itemPrice,
      );
      setShopUserItems(newItems);
    }
  };

  return (
    <div className="items-container">
      {
        // Map to items.json, is returned the categories of the items.json
        items.map((itemsCategory: ItemsCategory) => {
          return (
            <div key={itemsCategory.category}>
              <h2>{itemsCategory.category}</h2>
              <div className="items">
                {
                  // Map to the items of the category, is returned each item
                  itemsCategory.items.map((item) => {
                    return (
                      <ShopItem
                        item={item}
                        itemsCategory={itemsCategory}
                        key={item.name}
                      />
                    );
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>
  );
});
