import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xFd8C8E14b03AD7Df3375E78495855DAf1da2586b"; // test net
} else if (networkType === "mainnet") {
  // add = "0x822cA4e4F2FFA541155fbdEe962185d2c9E8922A"; // main net for test
  add = "0xBe80Cf297e201a151aF1bF98144A5432a5f2886b"; // main net for prod
}

export default add;
