import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x9f1b99127955ff31ed000412c9b9Cba48FE08A2c"; // test net
} else if (networkType === "mainnet") {
  add = "0x9f1b99127955ff31ed000412c9b9Cba48FE08A2c"; // main net
}

export default add;
