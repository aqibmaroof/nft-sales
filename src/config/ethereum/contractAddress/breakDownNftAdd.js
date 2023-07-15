

import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xD982bB118197007b9c4cD960ed32dc0e0de18FC7"; // test net
} else if (networkType === "mainnet") {
  add = "0x0aE350814f17ac6A6EF0A438db825b665dc6fD1e"; // main net testing
  // add = "0x6c019F2Df0b5A7D80f0429324c8c4BCB28eD6170" // mainnet Live
}

export default add;
