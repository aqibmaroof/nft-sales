
import { blockChainConfig } from "../config/blockChainConfig";

function checkWalletConnection(contract, metaMaskAddress) {
  const connectedWith = localStorage.getItem("connectedWith");
  if (metaMaskAddress !== "") {
    if (
      connectedWith === "metamask" &&
      window.ethereum !== undefined
    ) {
      return true;
    } else if (
      connectedWith === "binanceSmartChain" &&
      window.BinanceChain !== undefined &&
      (parseInt(window.BinanceChain.chainId).toString() === blockChainConfig[0].networkIdTestNet ||
        parseInt(window.BinanceChain.chainId).toString() === blockChainConfig[0].networkIdMainNet)
    ) {
      return true;
    } else if (connectedWith === "walletConnect") {
      return true;
    }

   
    return false;
  } else {
  
    return false;
  }
}

export default checkWalletConnection;
