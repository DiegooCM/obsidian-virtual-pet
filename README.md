# Obsidian virtual pet

A companion for your Obsidian vault!

Earn coins and level up your virtual pet as you write, unlocking accessories and backgrounds to customize your pet’s appearance.

## Screenshots

| ![Pet in leaf](https://github.com/DiegooCM/obsidian-virtual-pet/tree/main/assets/readMe/petInLeaf01.png) | ![Pet in leaf](https://github.com/DiegooCM/obsidian-virtual-pet/tree/main/assets/readMe/petInLeaf02.png) |
| -------------------- | -------------------- |

## Usage

**Earning Coins**
- **Create `.md` files:** +5 coins per file.
- **Delete `.md` files:** -5 coins per file.
- **Level up:** +50 coins.

**Gaining EXP**
- **Write words:** +1 EXP per word.
- **Delete words:** -1 EXP per deleted word.
- **Copy/paste text:** No EXP gained.

**Shopping**
1. Click the **coin icon** in the top bar to open the shop.
2. Browse, buy, equip, or unequip items for your pet.

## Features

- **Earn Coins:** Gain coins by creating `.md` files (+5 coins) or leveling up (+50 coins). Deleting files deducts 5 coins.
- **Level Up:** Gain experience as you write (+1 exp) per word. Deleting words reduces 1 exp per word, and copying/pasting text doesn’t count ;)
- **Shop:** Access the shop by clicking the coin icon in the top bar.
![Arrow pointing coin on top bar](https://github.com/DiegooCM/obsidian-virtual-pet/tree/main/assets/readMe/coinTap.png)

Spend your coins in the shop to buy accessories and backgrounds. And equip or unequip your items
![Shop](https://github.com/DiegooCM/obsidian-virtual-pet/tree/main/assets/readMe/shop.png)

- **Pet Animations:** Your pet reacts to your activity:
    - **Default animations** (standing/walking) while you write.
    - **Sleeping** when idle.
    - **Celebrating** when you level up.
    - **Typing** after long writing sessions.
![Pet Animations](https://github.com/DiegooCM/obsidian-virtual-pet/tree/main/assets/readMe/petAnimations.png)


## Contributing

Every contribution is greatly appreciated! You can contribute by:

- Report a bug or suggest an idea by creating an issue.
- Contribute with code or pixel art by submitting a pull request.

If you want to help doing pixel art, there is a folder in the project with most of the aseprites I used to create the plugin. They might be useful, despite they are a bit messy and in spanish.
To add the assets is needed to:
- Add the new assets in assets/plugin/[category]/[name].png.
- Add the item into src/jsons/items.json
- Run the assetsToJson.cjs so the assets/plugin folder is converted into a json with the images in base64. Run it with `node assetsToJson.cjs` (remember to be in the project folder).

## License
This plugin is licensed under the [MIT License](https://github.com/DiegooCM/obsidian-virtual-pet/blob/main/LICENSE)

### Font license
This project uses the font Monaco from Jamie Place, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)

## Support

If you like this project you can [star the repo](https://github.com/DiegooCM/obsidian-virtual-pet) to show your support!
