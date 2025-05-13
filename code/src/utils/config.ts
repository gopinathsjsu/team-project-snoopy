const PORT = 1339;
const protocol = "http";

const APP_ID = "appId";

let server_url = "http://127.0.0.1:" + PORT + "/parse";
let restApiKey = "restApiKey";
let javascriptKey = "javascriptKey";

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
// if (process.env.NODE_ENV === "production") {
server_url = "https://parseserver.us:" + PORT + "/parse";
restApiKey = "iefqFpoX7dGPeb0O4Jhh";
javascriptKey = "iffqFpoX7dGPeb0O4Jhh";
// }
const config = {
  application: "onlinetutor",
  PORT,
  protocol,
  server_url,
  appId: APP_ID,
  restApiKey,
  javascriptKey,
  SITE_NAME: "Malejole.com",
};

export default config;
