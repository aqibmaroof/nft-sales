/**
 * Combine all reducers in this file and export the combined reducers.
 */

// import { ucers } from "redux";
import { connectRouter } from 'connected-react-router';
// import history from "./utils/history";
/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
// import emailCampaignReducer from './_reducers/emailCampaign.reducer';
import metaMaskReducer from './_reducers/metaMaskReducer';
import blockChainReducer from './_reducers/blockChain.reducer';
import authReducer from './_reducers/auth.reducer';
// import { persistStore, persistCombineReducers } from "redux-persist";
// import storage from "redux-persist/es/storage";

// const config = {
//   key: "root",
//   storage,
//   whitelist: ["auth", "PatientReducer"],
//   // debug: true //to get useful logging
// };

const rootReducer = history => ({
	router: connectRouter(history),
	metaMaskReducer,
	blockChainReducer,
	authReducer,
});

export default rootReducer;