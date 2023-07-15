import {
  SET_BLOCK_CHAIN,
  DELETE_BLOCK_CHAIN,
  SET_IS_CHAINMODAL_HIDEABLE,
  SET_CHAIN_ERR_MSG
} from "../_actions/types";
import { blockChainConfig } from "../config/blockChainConfig";

let selectedChain = localStorage.getItem("selectedBlockChain")
  ? localStorage.getItem("selectedBlockChain")
  : 0;

let initialState = {
  selectedBlockChain: blockChainConfig[parseInt(selectedChain)],
  selectedNetworkChain: blockChainConfig[parseInt(selectedChain)],
  selectedNetworkChainIndex: selectedChain,

  isChainModalHidable: true,
  errorMsg:""
};

function blockChainReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_BLOCK_CHAIN:
      return {
        ...state,
        selectedBlockChain: payload,
        selectedNetworkChain: payload,
      };

    case DELETE_BLOCK_CHAIN:
      return {
        ...state,
        selectedBlockChain: blockChainConfig[0],
        selectedNetworkChain: blockChainConfig[0],
        selectedNetworkChainIndex: 2,
      };

    case SET_IS_CHAINMODAL_HIDEABLE:
      return {
        ...state,
        isChainModalHidable: payload,
      };

    case SET_CHAIN_ERR_MSG:
        return {
          ...state,
          errorMsg: payload,
        };
    

    default:
      return state;
  }
}

export default blockChainReducer;
