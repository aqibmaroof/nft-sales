import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x6891c516408A486fa50593824816b24BE1632570"; // test net
} else if (networkType === "mainnet") {
  // add = "0x299b6C14EFaC32a45a0046831C59808919DF3500"  // mainnet test
 add = "0x577Dd14269a48Ea7e524dE2304e162803763c4F9"; // main net live
}

export default add;
