import { readFile } from "fs/promises";
import path from "path";

enum Ports {
  APP = "app",
  MEDIC = "medic",
  ADMIN = "admin",
  TEMPLATE = "template",
  API = "api",
}

type Constants = {
  ports: { [key in Ports]: number };
};

export type Config = { constants: Constants; isLocal: boolean };

const defaultDevIsLocal = true;

let config: Config | null = null;
export async function getConfig(): Promise<Config> {
  const env_path = "../../.env";
  const const_path = "../../constants.json";
  if (!config) {
    let isLocal: boolean | null = null;
    if (process.env.NODE_ENV === "production") {
      const dotenv = await import("dotenv");
      const envFileContent = await readFile(
        path.join(import.meta.url, env_path),
        "utf-8"
      ).catch((error) => {
        if (error.code === "ENOENT") {
          return null;
        }

        throw error;
      });

      const parsed = envFileContent ? dotenv.parse(envFileContent) : null;
      isLocal = Boolean(
        parsed?.["IS_LOCAL"] ?? process.env["IS_LOCAL"] ?? defaultDevIsLocal
      );
    } else {
      isLocal = false;
    }

    const constantsRaw = await readFile(const_path, "utf-8").catch((error) => {
      if (error.code === "ENOENT") {
        return null;
      }

      throw error;
    });
    const constants = JSON.parse(constantsRaw as string);

    if (!constantsRaw) {
      throw Error(
        `MISSING: constants.json file at ${const_path}, please include one`
      );
    }

    return { constants, isLocal };
  }

  return config;
}
