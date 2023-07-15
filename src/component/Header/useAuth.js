import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";

import { networkType } from "config/networkType";
import { useSelector } from "react-redux";

const useAuth = () => {
  const selectedNetworkChain = useSelector(
    (state) => state.blockChainReducer.selectedNetworkChain
  );

  const { activate, deactivate } = useWeb3React();
 

  const login = useCallback(() => {
  
    let rpcObj;
    if (networkType === "testnet") {
      rpcObj = {
        [selectedNetworkChain.networkIdTestNet]: selectedNetworkChain.providerUrlTestnet,
      };
    } else {
      rpcObj = {
        [selectedNetworkChain.networkIdMainNet]: selectedNetworkChain.providerUrlMainnet,
      };
    }
    const connector = new WalletConnectConnector({
      rpc: rpcObj,
      bridge: 'https://pancakeswap.bridge.walletconnect.org/',
      qrcode: true,
      pollingInterval:12000
    });

    if (connector) {
      activate(connector, async (error) => {
        try {
          if (error instanceof UnsupportedChainIdError) {
            window.localStorage.removeItem("walletconnect");
            return false;
          } else {
            return false;
          }
        } catch (err) {}
      });
    } else {
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activate]);

  return { login, logout: deactivate };
};

export default useAuth;
