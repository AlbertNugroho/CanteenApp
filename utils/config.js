// utils/config.js
import Constants from "expo-constants";

let ip = "localhost"; // fallback if nothing is found

try {
  // Try to get IP from expo config (newer Expo)
  const debuggerHost =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    ip = debuggerHost.split(":")[0]; // extract IP
  }
} catch (e) {
  console.warn("Could not determine host IP, using localhost", e);
}

const BASE_URL = `http://${ip}:3001`;
console.log("BASE_URL is:", BASE_URL); // For debugging

export default BASE_URL;
