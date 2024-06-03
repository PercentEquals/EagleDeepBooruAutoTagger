import commandLineArgs from "command-line-args";
import { CheckForEagle, CheckForPython, PrepareEnvironment, ValidateOptions } from "./lib/Setup";
import chalk from "chalk";

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
    } catch (e) {
        console.error(`[${chalk.red("ERROR")}] ${chalk.red(e)}`);
    }
} 

main();