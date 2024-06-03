import { promisify } from "util";
import { exec } from "child_process";

const execute = promisify(exec)

export default execute;

export async function isRunning(query: string) {
    var platform = process.platform;
    var cmd = '';

    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }

    const output = await execute(cmd);
    return output.stdout.toLowerCase().indexOf(query.toLowerCase()) > -1;
}