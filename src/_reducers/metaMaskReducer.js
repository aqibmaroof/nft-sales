import {
  SET_META_MASK_ADDRESS,
  SET_CONTRACT,
  DELETE_CONTRACT,
  DELETE_META_MASK_ADDRESS,
 
  SET_VALUES_FOR_ALIA_PRICE,
  SET_TRANSACTION_IN_PROGRESS,
  SET_LANGUAGE,
  SET_CIR_SUPP_FOR_LP,
  SET_TOTAL_STAKES,
  SET_TOTAL_FARMS,
  SET_APY_LP,
  SET_APY_ALIA,
  SET_PROVIDER,SET_AWARDS_TRANSLATION
} from "../_actions/types";

let initialState = {
  provider: "",
  metaMaskAddress: "",
  contract: "",

  bnbPriceDollar: "",
  aliaBNBPriceDollar: "",

  transactionInProgress: false,
  language: localStorage.getItem("lang") || "en",
  awardTranslationJson : '',
  noOfAlia: 0,
  noOfBNB: 0,

  circulatingSuppLp: 0,

  totalFarms: 0,
  totalStakes: 0,

  APY_ALIA: 0,
  APY_LP: 0,

  APR_ALIA: 0,
  APR_LP: 0,

  emissionRate: 0,
};

 function metaMaskReducer (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_PROVIDER:
      return {
        ...state,
        provider: {...payload},
      };

    case SET_META_MASK_ADDRESS:
      localStorage.setItem("userConnected", true);
      return {
        ...state,
        metaMaskAddress: payload,
      };
    case SET_CONTRACT:
      return {
        ...state,
        contract: payload,
      };
    case DELETE_META_MASK_ADDRESS:
      return {
        ...state,
        metaMaskAddress: "",
      };
    case DELETE_CONTRACT:
      return {
        ...state,
        contract: "",
      };

    case SET_VALUES_FOR_ALIA_PRICE:
      return {
        ...state,
        aliaBNBPriceDollar: payload.aliaBNBPriceDollar,
        bnbPriceDollar: payload.bnbPriceDollar,
        noOfAlia: payload.noOfAlia,
        noOfBNB: payload.noOfBNB,
      };

    case SET_CIR_SUPP_FOR_LP:
      return {
        ...state,
        circulatingSuppLp: action.payload,
      };

    case SET_TOTAL_FARMS:
      return {
        ...state,
        totalFarms: action.payload,
      };
    case SET_TOTAL_STAKES:
      return {
        ...state,
        totalStakes: action.payload,
      };

    case SET_TRANSACTION_IN_PROGRESS:
      return {
        ...state,
        transactionInProgress: payload,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        language: payload,
      };
    case SET_AWARDS_TRANSLATION : 
      return {
        ...state,
        awardTranslationJson: payload,
      };
    case SET_APY_LP:
      return {
        ...state,
        APY_LP: payload.APY_LP,
        APR_LP: payload.APR_LP,
        emissionRate: payload.emissionRate,
      };
    case SET_APY_ALIA:
      return {
        ...state,
        APY_ALIA: payload.APY_ALIA,
        APR_ALIA: payload.APR_ALIA,
        emissionRate: payload.emissionRate,
      };

    default:
      return state;
  }
}


export default metaMaskReducer