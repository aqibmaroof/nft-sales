import {
  SET_BLOCK_CHAIN,
  DELETE_BLOCK_CHAIN,
  SET_IS_CHAINMODAL_HIDEABLE,
  SET_CHAIN_ERR_MSG,
} from "../_actions/types";

export const setBlockChain = (content) => {
  return { type: SET_BLOCK_CHAIN, payload: content };
};

export const deleteBlockChain = (content) => ({
  type: DELETE_BLOCK_CHAIN,
  payload: content,
});

export const setIsChainModalHideable = (content) => ({
  type: SET_IS_CHAINMODAL_HIDEABLE,
  payload: content,
});

export const setChainErrorMsg = (content) => ({
  type: SET_CHAIN_ERR_MSG,
  payload: content,
});
