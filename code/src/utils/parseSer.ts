import Parse from "parse/node";
import config from "./config";

const PROD_HOST = config.server_url;
const javascriptKey = config.javascriptKey;
let masterKey = "masterKey";
// if (process.env.NODE_ENV === "production") {
masterKey = "YuuGabGArydLfV0uXVxX";
// }

function initializeParse() {
  if (Parse.serverURL && Parse.serverURL === config.server_url) {
    return;
  }
  Parse.serverURL = PROD_HOST;
  Parse.initialize(config.appId, javascriptKey, masterKey);
}

initializeParse();

console.log("Parse: server: ", Parse.serverURL);

export default Parse;
