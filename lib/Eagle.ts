import chalk from "chalk";
import { existsSync, readdirSync } from "fs";
import path from "path";
import GetTags from "./Python";
import { readJson, writeJson } from "./File";
import { performance } from 'perf_hooks';

let validExt = [
    ".png", ".pneg", ".jpg", ".jpeg"
];

export default async function TagImages(libraryPath: string) {
    const imagesPath = path.join(libraryPath, "images");
    const dirs = readdirSync(imagesPath, {
        withFileTypes: true,
        recursive: false
    })
    .filter(object => object.isDirectory());

    var startTime = performance.now()

    for (let i = 0; i < dirs.length; i++) {
        try {
            const metadataPath = path.join(imagesPath, dirs[i].name, "metadata.json");
            const metadataOriginalPath = path.join(imagesPath, dirs[i].name, "metadata.json.o");

            const json = await readJson(metadataPath) as any;

            if (existsSync(metadataOriginalPath)) {
                // TODO: add force command to also process already tagged... (maybe make it time specific? like only force from previous 24hr or smth)
                // possibly make it so instead of doing it this loop it wil just revert those files... maybe
                console.log(`[${i+1}/${dirs.length}] Skipping already tagged ${json.name}`);
                continue;
            }

            console.log(`[${i+1}/${dirs.length}] Processing ${chalk.bold(json.name)}`);

            if (!validExt.includes("." + json.ext)) {
                console.log(`[${chalk.yellow("WARN")}] Skipping unsupported image type ${json.name}`);
                continue;
            }

            const imagePath = path.join(imagesPath, dirs[i].name, json.name + json.ext);
            const tags = await GetTags(imagePath)

            // TODO: add tag exclusion list...
            json.tags = [...new Set([...json.tags, ...tags])];

            console.log(chalk.gray(JSON.stringify(json.tags)));

            // TODO: before save check again if eagle is closed... never be too sure.
            writeJson(metadataPath, json);
        } catch (e) {
            console.log(`[${chalk.red("ERROR")}] Skipping ${chalk.bold(dirs[i].name)} due to error: ${e}`);
        }
    }

    var endTime = performance.now()

    console.log(`\nTime taken: ${Math.round(endTime - startTime) / 1000}s\n`);
    console.log(`[${chalk.green("DONE")}] Remember to ${chalk.red("force reload Your Eagle library")}! If not You will probably want to revert...`);

    // TODO: add revert logic (aka restore metadataOriginalPath for non skipped elements)
}