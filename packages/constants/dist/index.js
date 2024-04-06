import { readFile } from "fs/promises";
import path from "path";
var Ports;
(function (Ports) {
    Ports["APP"] = "app";
    Ports["MEDIC"] = "medic";
    Ports["ADMIN"] = "admin";
    Ports["TEMPLATE"] = "template";
    Ports["API"] = "api";
})(Ports || (Ports = {}));
const defaultDevIsLocal = true;
let config = null;
export async function getConfig() {
    const env_path = "../../.env";
    const const_path = "../../constants.json";
    if (!config) {
        let isLocal = null;
        if (process.env.NODE_ENV === "production") {
            const dotenv = await import("dotenv");
            const envFileContent = await readFile(path.join(import.meta.url, env_path), "utf-8").catch((error) => {
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
        const constantsRaw = await readFile(const_path, "utf-8").catch((error) => {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        });
        const constants = JSON.parse(constantsRaw);
        if (!constantsRaw) {
            throw Error(`MISSING: constants.json file at ${const_path}, please include one`);
        }
        return { constants, isLocal };
    }
    return config;
}
//# sourceMappingURL=index.js.map