import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xef45FADA9feD83302df93b24E4335f746BEa451B"; // test net
} else if (networkType === "mainnet") {
//   add = "0x2823cAbf0EFe6500355d9C8D83FD54b856681857"; // main net testing
  add = "0x8cCEF584D69C9532A70690394fB0dd3Afd183F46" //main net live
}

export default add;
