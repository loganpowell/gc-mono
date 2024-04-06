import fs from "fs";
import path from "path";
import "./dotenv.config";
export const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), {
    encoding: "utf8",
}));
//# sourceMappingURL=index.js.map