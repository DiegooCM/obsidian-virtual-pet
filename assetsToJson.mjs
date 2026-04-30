import fs from "fs";
import path from "path";

function imageToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
}

function processDirectory(directoryPath, json) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    let categoryJsonItems = {};
    const fullPath = path.join(directoryPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      categoryJsonItems = {};
      processDirectory(fullPath, categoryJsonItems);
      outputJson[file] = categoryJsonItems;
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === ".png") {
        const base64Image = imageToBase64(fullPath);
        const fileWithoutExt = file.replace(/\.[^/.]+$/, "");
        json[fileWithoutExt] = base64Image;
      }
    }
  });
}

const outputJson = {};

processDirectory("./assets/plugin", outputJson);

fs.writeFileSync("src/jsons/assets.json", JSON.stringify(outputJson, null, 2));

console.log("Assets converted to JSON successfully");
