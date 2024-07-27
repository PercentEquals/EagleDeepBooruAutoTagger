import chalk from "chalk";
import { Dirent, existsSync, readdirSync } from "fs";
import path from "path";
import async from 'async';
import GetTags from "./Python";
import { readJson, writeJson } from "./File";
import { CheckForEagle } from "./Setup";
import { performance } from 'perf_hooks';


let validExt = [
    ".png", ".pneg", ".jpg", ".jpeg"
];

async function TryTagImage(imagesPath: string, dir: Dirent) {
    const metadataPath = path.join(imagesPath, dir.name, "metadata.json");
    const json = await readJson(metadataPath) as any;

    try {
        console.log(`[INFO] Processing ${chalk.bold(json.name)}`);

        const imagePath = path.join(imagesPath, dir.name, json.name + "." + json.ext);
        const tags = await GetTags(imagePath)

        // TODO: add tag exclusion list...
        json.tags = [...new Set([...json.tags, ...tags])];

        console.log(`[INFO] Processed ${chalk.bold(json.name)} =`, chalk.gray(JSON.stringify(json.tags)));

        await CheckForEagle();
        writeJson(metadataPath, json);
    } catch (e) {
        console.log(`[${chalk.red("ERROR")}] Skipping ${chalk.bold(json.name)} due to error: ${e}`);
    }
}

export default async function TagImages(libraryPath: string) {
    const imagesPath = path.join(libraryPath, "images");
    const dirs = readdirSync(imagesPath, {
        withFileTypes: true,
        recursive: false
    })
    .filter(object => object.isDirectory());

    const dirsToTag: Dirent[] = [];

    for (const dir of dirs) {
        const metadataPath = path.join(imagesPath, dir.name, "metadata.json");
        const metadataOriginalPath = path.join(imagesPath, dir.name, "metadata.json.o");

        const json = await readJson(metadataPath) as any;

        if (existsSync(metadataOriginalPath)) {
            // TODO: add force command to also process already tagged... (maybe make it time specific? like only force from previous 24hr or smth)
            // possibly make it so instead of doing it this loop it wil just revert those files... maybe
            //console.log(`[INFO] Skipping already tagged ${json.name}`);
            continue;
        }

        if (!validExt.includes("." + json.ext)) {
            //console.log(`[${chalk.yellow("WARN")}] Skipping unsupported image type ${json.name}`);
            continue;
        }

        dirsToTag.push(dir);
    };

    console.log(`[INFO] Images to process: ${dirsToTag.length} out of ${dirs.length}`);

    var startTime = performance.now()

    await async.eachLimit(
        dirsToTag,
        3, // +1 = +2GB of memory
        async (dir) => {
            await TryTagImage(imagesPath, dir);
        }
    )

    var endTime = performance.now()

    console.log(`\nTime taken: ${Math.round(endTime - startTime) / 1000}s\n`);
    console.log(`[${chalk.green("DONE")}] Remember to ${chalk.red("force reload Your Eagle library")}! If not You will probably want to revert...`);

    // TODO: add revert logic (aka restore metadataOriginalPath for non skipped elements)
}