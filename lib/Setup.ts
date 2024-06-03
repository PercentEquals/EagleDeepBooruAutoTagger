import { CommandLineOptions } from "command-line-args";
import { isValidPath } from "./File";

import path from "path";
import fs from "fs";
import execute, { isRunning } from "./Process";
import chalk from "chalk";
import { DDProject } from "../constants/Paths";

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

    console.log(`[${chalk.blue("INFO")}] Installed python version: ${chalk.bold(output.stdout)}`);
}

export async function PrepareEnvironment() {
    await execute(`python -m venv ${DDProject}`);
    const output = await execute(
        `cd ${DDProject} && .\\Scripts\\activate && pip install -r requirements.txt`);

    console.log(output);
}