import commandLineArgs from "command-line-args";
import chalk from "chalk";

import { CheckForEagle, CheckForPython, PrepareEnvironment, ValidateOptions } from "./lib/Setup";
import TagImages from "./lib/Eagle";

const optionDefinitions = [
    { name: 'path', type: String, defaultOption: true },
]

const options = commandLineArgs(optionDefinitions)

async function main() {
    try {
        ValidateOptions(options);

        await CheckForEagle();
        await CheckForPython();  
        await PrepareEnvironment();

        await TagImages(options.path);
    } catch (e) {
        console.error(`[${chalk.red("ERROR")}] ${chalk.red(e)}`);
    }
} 

main();