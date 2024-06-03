import fs from "fs";

export function isValidPath(path: string) {
    try {
        fs.accessSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

export function readJson(filepath: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, "utf8", (err, jsonString) => {
            if (err) {
                return reject(err);
            }
            try {
                resolve(JSON.parse(jsonString))
            } catch (err) {
                return reject(err);
            }
          });
    })
}

export function writeJson(filepath: string, json: any) {
    const jsonString = JSON.stringify(json);

    if (fs.existsSync(filepath)) {
        fs.copyFileSync(filepath, filepath + ".o");
    }

    fs.writeFileSync(filepath, jsonString)
}