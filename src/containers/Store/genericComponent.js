import React, { useEffect, useState } from "react";
import Web3 from "web3";
import XanaGenesis from "./XanaGenesis";
import BlindBoxOffChainHook from "./BBOffChainHookPublic";
import { blockChainConfig } from "../../config/blockChainConfig";
import { adminAccess } from "../../config/networkType";

let xanaGenesisDexAddress,
  xanaGenesisDexAbi = "";

let xanaGenesisAddress,
  xanaGenesisAbi = "";

let providerUrl = "";
function GenericComponent(props) {
  const [nftChain, setNftChain] = useState(
    adminAccess ? "binance" : "ethereum"
  );
  const [saleStatus, setSaleStatus] = useState("");

  useEffect(() => {
    saleWhiteList();
  }, []);
  const saleWhiteList = async () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        providerUrl = blockChainConfig[i].providerUrl;
        xanaGenesisAbi = blockChainConfig[i].xanaGenesisDexConConfig.abi;
        xanaGenesisAddress = blockChainConfig[i].xanaGenesisDexConConfig.add;
      }
    }
    let web3 = new Web3(providerUrl);
    let xanaGenesisDexContract = new web3.eth.Contract(
      xanaGenesisAbi,
      xanaGenesisAddress
    );
    let collDataPrice = await xanaGenesisDexContract.methods.getStatus().call();
    console.log(collDataPrice);
    if (collDataPrice !== undefined) {
      setSaleStatus(collDataPrice);
    }

    return undefined;
  };

  // return saleStatus === "0" || saleStatus === "1" ? (
  //   <XanaGenesis props={props} />
  // ) : saleStatus === "2" ? (
  //   <BlindBoxOffChainHook props={props} />
  // ) : (
  //   <XanaGenesis props={props} />
  // );

  return     <XanaGenesis props={props} />
}

export default GenericComponent;
