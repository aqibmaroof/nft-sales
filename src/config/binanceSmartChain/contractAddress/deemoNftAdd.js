import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xc8bFc75ca0FB85798447E19Be6fEDa17625eB6ff"; // test net
} else if (networkType === "mainnet") {
  add = "0x932F97A8Fd6536d868f209B14E66d0d984fE1606"; // main net
}

export default add;
