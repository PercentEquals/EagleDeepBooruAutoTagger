import fs from "fs";

export function isValidPath(path: string) {
    try {
        fs.accessSync(path);
        return true;
    } catch (e) {
        return false;
    }
}
