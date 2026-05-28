import { memo, useEffect, useRef, useState } from "react";
import StatsHandler from "src/utils/statsHandler";
import {
  GetAssetT,
  ItemCategory,
  ItemJson,
  ItemsCategory,
  ItemsJson,
  ItemState,
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

  return (
    <div className="vpet-items">
      {
        // Map to items.json, is returned the categories of the items.json
        items.map((itemsCategory: ItemsCategory) => {
          return (
            <div key={itemsCategory.category}>
              <h2>{itemsCategory.category}</h2>
              <div className="vpet-category-items">
                {
                  // Map to the items of the category, is returned each item
                  itemsCategory.items.map((item) => {
                    return (
                      <ShopItem
                        shopUserItems={shopUserItems}
                        setShopUserItems={setShopUserItems}
                        userStats={userStats}
                        statsHandler={statsHandler}
                        getAsset={getAsset}
                        items={items}
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

const ShopItem = ({
  shopUserItems,
  setShopUserItems,
  userStats,
  statsHandler,
  getAsset,
  item,
  items,
  itemsCategory,
}: {
  shopUserItems: UserItems;
  setShopUserItems: React.Dispatch<React.SetStateAction<UserItems>>;
  userStats: UserStats;
  statsHandler: StatsHandler;
  getAsset: GetAssetT;
  item: ItemJson;
  items: ItemsJson;
  itemsCategory: ItemsCategory;
}) => {
  const itemImageRef = useRef<HTMLImageElement | null>(null);

  // Checks what is the state of the item ("equiped", "obtained", ""(not buyed))
  const checkItem = (
    itemName: string,
    itemCategory: ItemCategory,
  ): ItemState => {
    if (shopUserItems.equiped[itemCategory] === itemName) return "equiped";
    else if (shopUserItems.obtained[itemCategory].includes(itemName))
      return "obtained";
    else return "";
  };

  console.log("shopitem");

  const itemState = checkItem(item.name, itemsCategory.category);

  useEffect(() => {
    getAsset(itemsCategory.category, item.name)
      .then((asset) => {
        if (itemImageRef.current) itemImageRef.current.src = asset;
      })
      .catch(() =>
        console.error("Virtual Pet: An error ocurred while loading assets"),
      );
  }, []);

  return (
    <div className="vpet-category-item">
      <img
        ref={itemImageRef}
        alt={`${item.name} ${itemsCategory.category} image Item`}
      />

      <div className="vpet-category-item__info">
        <p className="vpet-category-item__name">{item.name}</p>
        <ItemButton
          itemState={itemState}
          userStats={userStats}
          statsHandler={statsHandler}
          setShopUserItems={setShopUserItems}
          item={item}
          items={items}
          itemsCategory={itemsCategory}
        />
      </div>
    </div>
  );
};

const ItemButton = ({
  userStats,
  statsHandler,
  setShopUserItems,
  item,
  itemState,
  items,
  itemsCategory,
}: {
  userStats: UserStats;
  statsHandler: StatsHandler;
  setShopUserItems: React.Dispatch<React.SetStateAction<UserItems>>;
  item: ItemJson;
  itemState: ItemState;
  items: ItemsJson;
  itemsCategory: ItemsCategory;
}) => {
  const buyItem = (itemName: string, itemCategory: ItemCategory) => {
    const itemPrice = items
      .find((itemsCategory) => itemsCategory.category === itemCategory)
      ?.items.find((item) => item.name === itemName)?.price;

    if (itemPrice && userStats.coins >= itemPrice) {
      const [, newItems] = statsHandler.addNewItem(
        itemName,
        itemCategory,
        itemPrice,
      );
      setShopUserItems(newItems);
    }
  };
  if (itemState === "equiped") {
    return (
      <button
        id="vpet-category-item__button-equiped"
        onClick={() => {
          setShopUserItems(statsHandler.unequipItem(itemsCategory.category));
        }}
      >
        Unequip
      </button>
    );
  } else if (itemState === "obtained") {
    return (
      <button
        id="vpet-category-item__button-obtained"
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
        id="vpet-category-item__button-price"
        onClick={() => {
          buyItem(item.name, itemsCategory.category);
        }}
      >
        Price: {item.price}
      </button>
    );
  }
};
