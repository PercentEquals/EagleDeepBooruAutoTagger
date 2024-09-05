import commandLineArgs from "command-line-args";
import chalk from "chalk";

import { CheckForEagle, CheckForPython, PrepareEnvironment, ValidateOptions } from "./lib/Setup";
import TagImages from "./lib/Eagle";
import { argv } from "process";

const optionDefinitions = [
    { name: 'path', type: String, defaultOption: true },
    { name: 'force-prepare', type: Boolean },
    { name: 'threads', type: Number, default: 1 }
]

const options = commandLineArgs(optionDefinitions, {
    argv
})

async function main() {
    try {
        ValidateOptions(options);

        await CheckForEagle();
        await CheckForPython();  

        await PrepareEnvironment(options["force-prepare"]);

        await TagImages(options.path, options.threads ?? 1);
    } catch (e) {
        console.error(`[${chalk.red("ERROR")}] ${chalk.red(e)}`);
    }
} 

main();