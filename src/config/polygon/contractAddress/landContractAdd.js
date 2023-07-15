import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x85252e8fc841331E1cb977c0c15baF52a8db7B40"; // test net
} else if (networkType === "mainnet") {
  add = "0x85252e8fc841331E1cb977c0c15baF52a8db7B40"; // main net
}

export default add;
