import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xdf92F06C841a5BeF0C9fea8295225E9D006ED912"; // test net
} else if (networkType === "mainnet") {
  add = "0x89F7AdDad19B8F407E5942Ecc7c20BF776ddD67E"; // mainnet test
  //  add = "0xdf92F06C841a5BeF0C9fea8295225E9D006ED912"; // main net live
}

export default add;
