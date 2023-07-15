import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x326Cae76A11d85b5c76E9Eb81346eFa5e4ea7593"; // test net
} else if (networkType === "mainnet") {
 //  add = "0x4a41EF863a83392997E5EF58D0a1a6324704f75A"; // main net testing
     add = "0xF4C2A6649c1B454E6b10817e9f73545673b8628A" //main net live
}

export default add;
