import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
const env = dotenv.config({ path: `../../../.env` });
export default dotenvExpand.expand(env);
//# sourceMappingURL=dotenv.config.js.map