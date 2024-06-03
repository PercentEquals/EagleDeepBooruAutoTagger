import chalk from "chalk";
import { copyFileSync, existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import GetTags from "./Python";
import { readJson, writeJson } from "./File";

let validExt = [
    ".gif", ".png", ".pneg", ".jpg", ".jpeg"
];

function isValidImage(filename: string) {
    for (let i = 0; i < validExt.length; i++) {
        if (filename.toLocaleLowerCase().endsWith(validExt[i])) {
            return true;
        }
    }

    return false;
}

export default async function TagImages(libraryPath: string) {
    const imagesPath = path.join(libraryPath, "images");
    const dirs = readdirSync(imagesPath, {
        withFileTypes: true,
        recursive: false
    })
    .filter(object => object.isDirectory());

    for (let i = 0; i < dirs.length; i++) {
        const images = readdirSync(path.join(imagesPath, dirs[i].name), {
            withFileTypes: true,
            recursive: false
        })
        .filter(object => object.isFile())
        .filter(object => isValidImage(object.name))

        if (images.length <= 0) {
            console.log(`[${i}/${dirs.length}] Skipping "empty" dir ${dirs[i].name}`);
            continue;
        }

        const imagePath = path.join(imagesPath, dirs[i].name, images[0].name);
        const metadataPath = path.join(imagesPath, dirs[i].name, "metadata.json");
        const metadataOriginalPath = path.join(imagesPath, dirs[i].name, "metadata.json.o");

        if (existsSync(metadataOriginalPath)) {
            console.log(`[${i}/${dirs.length}] Skipping already tagged ${images[0].name}`);
        }

        console.log(`[${i}/${dirs.length}] Processing ${chalk.bold(images[0].name)}`);

        const tags = await GetTags(imagePath)
        const json = await readJson(metadataPath) as any;
        json.tags = json.tags.concat(tags);

        console.log(chalk.gray(JSON.stringify(json.tags)));

        writeJson(metadataPath, json);
    }

    console.log(`[${chalk.green("DONE")}] Remember to force reload Your Eagle library! If not You will probably want to revert...`);

    // TODO: add revert logic (aka restore metadataOriginalPath for non skipped elements)
}