import React, { useEffect } from "react";
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setIsChainModalHideable } from "../_actions/blockchain.actions";
import { setChainErrorMsg } from "../_actions/blockchain.actions";

export function useVerifyNetwork(selectedBlindBox) {
  const dispatch = useDispatch();
  const params = useParams();

  const selectedNetworkChain = useSelector(
    (state) => state.blockChainReducer.selectedNetworkChain
  );
  useEffect(() => {
    if (selectedBlindBox) {
      if (selectedNetworkChain.key !== params?.chain) {
        document.getElementById("selectNetworkButton").click();
        dispatch(setIsChainModalHideable(false));
        dispatch(
          setChainErrorMsg(
            `Selected Chain Network does not support this NFT collection. Please switch your Blockchain Network to ${params?.chain} to proceed`
          )
        );
      } else {
        dispatch(setChainErrorMsg(``));
        dispatch(setIsChainModalHideable(true));
      }
    }
  }, [selectedBlindBox, selectedNetworkChain]);
}
