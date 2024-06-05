import { CommandLineOptions } from "command-line-args";
import { downloadFile, isValidPath } from "./File";

import AdmZip from "adm-zip";

import path from "path";
import fs from "fs";
import execute, { isRunning } from "./Process";
import chalk from "chalk";
import { DDModel, DDProject } from "../constants/Paths";

export function ValidateOptions(options: CommandLineOptions) {  
    if (!options.path || !isValidPath(options.path)) {
        throw new Error("Correct path to Eagle library is required!");
    }

    if (!fs.existsSync(path.join(options.path, "tags.json"))) {
        throw new Error("Correct path to Eagle library is required!");
    }

    if (!fs.lstatSync(path.join(options.path, "images")).isDirectory()) {
        throw new Error("Correct path to Eagle library is required!");
    }

    console.log(`[${chalk.blue("INFO")}] Eagle library path: ${chalk.bold(options.path)}`);
}

export async function CheckForEagle() {  
    if (await isRunning("Eagle")) {
        throw new Error("Eagle instance is open! Please close it.");
    }
}

export async function CheckForPython() {
    const output = await execute("python --version");

    if (!output.stdout.startsWith("Python 3")) {
        throw new Error("No python 3 found!");
    }

    console.log(`[${chalk.blue("INFO")}] Installed python version: ${chalk.bold(output.stdout.trimEnd())}`);
}

export async function PrepareEnvironment(forcePrepare: boolean) {
    console.log(`[${chalk.blue("INFO")}] Preparing environment. This might take a while...`);

    if ((fs.existsSync(DDProject) || fs.existsSync(DDModel)) && !forcePrepare) {
        console.log(`[${chalk.blue("INFO")}] Looks like environment is already prepared. Skipping. Use --force-prepare to recreate env.`);
        return;
    } else if ((fs.existsSync(DDProject) || fs.existsSync(DDModel)) && forcePrepare) {
        console.log(`[${chalk.blue("INFO")}] Looks like environment is already prepared. Forcing recreation.`);

        if (fs.existsSync(DDProject)) {
            fs.rmSync(DDProject, { recursive: true });
        }

        if (fs.existsSync(DDModel)) {
            fs.rmSync(DDModel, { recursive: true });
        }

        if (fs.existsSync('DeepDanbooru-model.zip')) {
            fs.unlinkSync('DeepDanbooru-model.zip');
        }
    }

    await execute(`git clone https://github.com/KichangKim/DeepDanbooru.git`);
    await downloadFile('https://github.com/KichangKim/DeepDanbooru/releases/download/v3-20211112-sgd-e28/deepdanbooru-v3-20211112-sgd-e28.zip', 'DeepDanbooru-model.zip');

    new AdmZip('DeepDanbooru-model.zip').extractAllTo(DDModel, true);

    await execute(`python -m venv ${DDProject}`);
    await execute(`${DDProject}\\Scripts\\pip install -r ${DDProject}\\requirements.txt`);

    console.log(`[${chalk.blue("INFO")}] Environment prepared.`);
}