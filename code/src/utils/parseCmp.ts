import Parse from "parse";
import Cookies from "js-cookie";
import config from "./config";

const PROD_HOST = config.server_url;
const javascriptKey = config.javascriptKey;

function initializeParse() {
  if (Parse.serverURL && Parse.serverURL === config.server_url) {
    return;
  }
  Parse.serverURL = PROD_HOST;
  Parse.initialize(config.appId, javascriptKey);
}

initializeParse();

function loginCheck() {
  const sessionToken_ = Cookies.get("sessionToken_");
  const user_ = Cookies.get("user_");
  const provider_ = Cookies.get("provider_");
  const user = Parse.User.current();

  if (
    user_ &&
    sessionToken_ &&
    provider_ &&
    (!user || user.id !== user_ || user.get("provider") !== provider_)
  ) {
    // login user
    Parse.User.become(sessionToken_).then(
      function () {
        // The current user is now set to user.
        Cookies.remove("user_");
        Cookies.remove("sessionToken_");
        Cookies.remove("provider_");
      },
      function (error) {
        // The token could not be validated.
        console.log("e is ", error);
      }
    );
  }
}

loginCheck();

export default Parse;
