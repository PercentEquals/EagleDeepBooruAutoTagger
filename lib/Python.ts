import { Options, PythonShell } from 'python-shell';
import { DDModel, DDProject } from '../constants/Paths';

let options = {
  mode: 'text',
  pythonPath: `${DDProject}\\Scripts\\python.exe`,
  pythonOptions: ['-u', '-X', 'utf8'],
  scriptPath: `${DDProject}`
} as Options;

export default async function GetTags(filename: string) {
    options.args = [
        "evaluate",
        filename,
        "--project-path",
        `${DDModel}`,
        '--allow-gpu'
    ];

    let results: string[] = await PythonShell.run(`${DDProject}\\__main__.py`, options);

    results = results.slice(3);
    results = results.map(result =>
        result.substring(result.indexOf(") "))
    );
}