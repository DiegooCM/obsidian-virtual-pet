import { App } from "obsidian";
import { useMemo } from "react";
import items from "src/items.json";
import StatsHandler from "src/stats/StatsHandler";
import { ItemCategory, ItemJson, ItemsJson, UserItems, UserStats } from "src/types";

interface shopItemsI {
  userItems: UserItems;
  setUserItems: React.Dispatch<React.SetStateAction<UserItems>>;
  userStats: UserStats;
  statsHandler: StatsHandler;
  app: App;
}

export function ShopItems({userItems, setUserItems, userStats, statsHandler, app}: shopItemsI) {
  // Checks what is the state of the item ("equiped", "obtained", ""(not buyed))
  const checkItem = (itemName: string, itemCategory: ItemCategory) => {
    if (userItems.equiped[itemCategory] === itemName) return "equiped";
    else if (userItems.obtained[itemCategory].includes(itemName)) return "obtained";
    else return "";
  };

  const buyItem = (itemName: string, itemCategory: ItemCategory) => {
    const itemPrice = items
      .find((categoryGroup) => categoryGroup.category === itemCategory)
      ?.items.find((item) => item.name === itemName)?.price;

    if (itemPrice && userStats.coins > itemPrice) {
      const [newStats, newItems] = statsHandler.addNewItem(itemName, itemCategory, itemPrice);
      setUserItems(newItems);
    }

  };

  const ShopItem = ({item, itemsCategory}: {item:ItemJson, itemsCategory: ItemsJson}) => {
    const ItemButton = ({itemState}:{itemState: string}) => {
      if (itemState === "equiped") {
        return (
          <button className="item-equiped" onClick={() => {setUserItems(statsHandler.unequipItem(itemsCategory.category))}}>
            Unequip
          </button> 
        )
      } else if (itemState === "obtained") {
        return (
          <button className="item-obtained" onClick={() => {setUserItems(statsHandler.equipItem(item.name, itemsCategory.category))}}>
            Equip
          </button>
        )
      } else {
        return (
          <button className="item-price" onClick={() => {buyItem(item.name, itemsCategory.category)}}>
            Price: {item.price}
          </button>
        )
      } 
    };

    const itemState = checkItem(
      item.name,
      itemsCategory.category
    );

    const itemImage = useMemo(() => app.vault.adapter.getResourcePath(
      "./.obsidian/plugins/obsidian-virtual-pet/" + item.url
    ),[]); // This useMemo is doing nothing

    return (
      <div className="shop-item">
        <div className="item-img">
          <img src={itemImage}/>
        </div>

        <div className="item-info">
          <p className="item-name">{item.name}</p>
          <ItemButton itemState={itemState}/>
        </div>
      </div>

    )
  }


  return (
    <div className="items-container">
      {
        // Map to items.json, is returned the categories of the items.json
        items.map((itemsCategory: ItemsJson) => {
          return (
            <div key={itemsCategory.name}>
              <h2>{itemsCategory.name}</h2>
              <div className="items">
                {// Map to the items category, is returned each item
                  itemsCategory.items.map((item) => {
                    return (
                      <ShopItem item={item} itemsCategory={itemsCategory} key={item.name}/>
                    )
                  })
                }
              </div>
            </div>
          ) 
        })
      }
    </div>
  )

}

