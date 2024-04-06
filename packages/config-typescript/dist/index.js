import { readFile } from "fs/promises";
import path from "path";
var Ports;
(function (Ports) {
    Ports["APP"] = "app";
    Ports["MEDIC"] = "medic";
    Ports["ADMIN"] = "admin";
})(Ports || (Ports = {}));
const defaultDevIsLocal = true;
let config = null;
export async function getConfig() {
    if (!config) {
        let isLocal = null;
        if (process.env.NODE_ENV === "production") {
            const dotenv = await import("dotenv");
            const envFileContent = await readFile(path.join(import.meta.url, "../../.env"), "utf-8").catch((error) => {
                if (error.code === "ENOENT") {
                    return null;
                }
                throw error;
            });
            const parsed = envFileContent ? dotenv.parse(envFileContent) : null;
            isLocal = Boolean(parsed?.["IS_LOCAL"] ?? process.env["IS_LOCAL"] ?? defaultDevIsLocal);
        }
        else {
            isLocal = false;
        }
        let constantsPath = "../constants.json";
        console.log("constantsPath: ", constantsPath);
        const constantsRaw = await readFile(constantsPath, "utf-8").catch((error) => {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        });
        const constants = JSON.parse(constantsRaw);
        console.log("constants: ", constants);
        if (!constantsRaw) {
            throw Error(`Missing constants.json file at ${constantsPath}, please include one`);
        }
        return { constants, isLocal };
    }
    return config;
}
//# sourceMappingURL=index.js.map