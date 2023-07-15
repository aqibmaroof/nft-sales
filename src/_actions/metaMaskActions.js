import {
  SET_META_MASK_ADDRESS,
  SET_CONTRACT,
  DELETE_CONTRACT,
  DELETE_META_MASK_ADDRESS,
  SET_APPROVAL_FOR_ALIA,
  SET_APPROVAL_FOR_LP,
  SET_DECIMALS_FOR_ALIA,
  SET_DECIMALS_FOR_LP,
  DELETE_APPROVAL_FOR_ALIA,
  DELETE_APPROVAL_FOR_LP,
  DELETE_DECIMALS_FOR_LP,
  DELETE_DECIMALS_FOR_ALIA,
  SET_VALUES_FOR_ALIA_PRICE,
  SET_TRANSACTION_IN_PROGRESS,
  SET_LANGUAGE,
  SET_CIR_SUPP_FOR_LP,
  SET_TOTAL_FARMS,
  SET_TOTAL_STAKES,
  SET_APY_ALIA,
  SET_APY_LP,
  SET_PROVIDER,
  LOGOUT,
  SET_AWARDS_TRANSLATION
} from "../_actions/types";

export const setProvider = (content) => ({
  type: SET_PROVIDER,
  payload: content,
});

export const setMetaMask = (content) => ({
  type: SET_META_MASK_ADDRESS,
  payload: content,
});

export const deleteMetaMask = () => ({ type: DELETE_META_MASK_ADDRESS });

export const setContract = (content) => ({
  type: SET_CONTRACT,
  payload: content,
});

export const deleteContract = () => ({
  type: DELETE_CONTRACT,
});

export const setTransactionInProgress = (content) => ({
  type: SET_TRANSACTION_IN_PROGRESS,
  payload: content,
});

export const setValuesForAliaPrice = (content) => ({
  type: SET_VALUES_FOR_ALIA_PRICE,
  payload: content,
});

export const setLPCirSupp = (content) => ({
  type: SET_CIR_SUPP_FOR_LP,
  payload: content,
});

export const setTotalStakes = (content) => ({
  type: SET_TOTAL_STAKES,
  payload: content,
});
export const setTotalFarms = (content) => ({
  type: SET_TOTAL_FARMS,
  payload: content,
});

export const setLanguage = (content) => {
  return { type: SET_LANGUAGE, payload: content };
};

export const setAwardTranslation = (content) => {
  return { type: SET_AWARDS_TRANSLATION, payload: content };
};

export const setAPYAlia = (content) => ({
  type: SET_APY_ALIA,
  payload: content,
});

export const setAPYLp = (content) => ({
  type: SET_APY_LP,
  payload: content,
});

export const setLogout = () => ({
  type: LOGOUT,
  payload : ''
})
