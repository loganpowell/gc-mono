import { readFile } from "fs/promises";
import path from "path";

enum Ports {
  APP = "app",
  MEDIC = "medic",
  ADMIN = "admin",
}

type Constants = {
  ports: { [key in Ports]: number };
};

export type Config = { constants: Constants; isLocal: boolean };

const defaultDevIsLocal = true;

let config: Config | null = null;
export async function getConfig(): Promise<Config> {
  if (!config) {
    let isLocal: boolean | null = null;
    if (process.env.NODE_ENV === "production") {
      const dotenv = await import("dotenv");
      const envFileContent = await readFile(
        path.join(import.meta.url, "../../.env"),
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

    let constantsPath = "../../constants.json";
    console.log("constantsPath: ", constantsPath);

    const constantsRaw = await readFile(constantsPath, "utf-8").catch(
      (error) => {
        if (error.code === "ENOENT") {
          return null;
        }

        throw error;
      }
    );
    const constants = JSON.parse(constantsRaw as string);
    console.log("constants: ", constants);

    if (!constantsRaw) {
      throw Error(
        `Missing constants.json file at ${constantsPath}, please include one`
      );
    }

    return { constants, isLocal };
  }

  return config;
}
