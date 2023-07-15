import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xc06cF0c95dC9aA47beb5Ccd8A546FDC7f3b69797"; // test net
} else if (networkType === "mainnet") {
  add = "0xf776e9A9642DBeb9ee7de20c25224E4A0BFCC03b"; // main net
}

export default add;
