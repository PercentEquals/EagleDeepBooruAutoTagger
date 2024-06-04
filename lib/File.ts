import fs from "fs";
import request from "request";

export function isValidPath(path: string) {
    try {
        fs.accessSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

export async function readJson(filepath: string) {
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

export async function downloadFile(fileUrl: string, fileName: string) {
    var headers = {
        'Accept': 'application/octet-stream',
        'User-Agent': 'request module',
    };

    var options = {
        url: fileUrl,
        headers: headers,
        encoding: null // we want a buffer and not a string
    };
    
    const file = fs.createWriteStream(fileName);
    const req = request.get(options);
    
    return new Promise((resolve, reject) => {
        req.on('response', (response) => {
            req.pipe(file);
        });

        file.on('finish', () => {
            file.close();
            resolve(true);
        });

        req.on('error', (err) => {
            fs.unlinkSync(fileName);
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlinkSync(fileName);
            reject(err);
        });
    })
}