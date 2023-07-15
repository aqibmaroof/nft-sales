import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import React, { Suspense } from "react";

import { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import PageNotFound from "./component/PageNotFound/pageNotFound";
import axios from "axios";
import { setLanguage, setAwardTranslation } from "./_actions/metaMaskActions";
import isEmpty from "utils/isEmpty";
import Header from "./component/Header/index";
import Dummy from "containers/Dummy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// import deemoNftAdd from "./config/ethereum/contractAddress/deemoNftAdd";
// import landContractAdd from "./config/xanaChain/contractAddress/landContractAdd";
// import astroBoyAdd from "./config/xanaChain/contractAddress/astroBoyAdd";
// import corporateCollectionAdd from "./config/xanaChain/contractAddress/corporateCollectionAdd";
import critpoNinjaCollectionAdd from "./config/ethereum/contractAddress/criptoNinjaAdd";
import breakingdownCollectionAdd from "./config/ethereum/contractAddress/breakDownNftAdd";
import cryptoNinja1155CollectionAdd from "./config/xanaChain/contractAddress/cryptoNinja1155Add";

import "bootstrap/dist/css/bootstrap.min.css";

const LandWhiteListSale = React.lazy(() =>
  import("./containers/Land/LandWhiteListSale")
);
const DeemoWhiteListSale = React.lazy(() =>
  import("./containers/Deemo/DeemoWhiteListSale")
);
const AstroBoyWhiteListSale = React.lazy(() =>
  import("./containers/AstroBoy/AstroBoyWhiteListSale")
);
const CorporateCollectionWhiteListSale = React.lazy(() =>
  import("./containers/CorporateCollection/CorporateCollectionWhiteListSale")
);
const CriptoNinjaCollectionWhiteListSale = React.lazy(() =>
  import(
    "./containers/CriptoNinjaCollection/CriptoNinjaCollectionWhiteListSale"
  )
);

const BreakDownNftCollectionWhiteListSale = React.lazy(() =>
  import(
    "./containers/BreakDownNftCollection/BreakDownNftCollectionWhiteListSale"
  )
);

const CryptoNinja1155CollectionWhiteListSale = React.lazy(() =>
  import("./containers/CryptoNinja1155/cryptoNinja1155WhiteListSale")
);

// For GET requests
axios.interceptors.request.use(
  (req) => {
    // Add configurations here
    let userToken = "";
    if (req.headers && req.headers.Authorization) {
      userToken = req.headers.Authorization;
    } else if (typeof window !== "undefined") {
      let authToken = localStorage.getItem("userToken");
      userToken = `Bearer ${authToken}`;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: userToken,
    };
    if (req.headers["X-API-Key"]) {
      headers["X-API-Key"] = req.headers["X-API-Key"];
    }
    req.headers = headers;

    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

function RouteComponent(props) {
  return (
    <Redirect
      to={`/cryptoninja/minting/xanachain/${cryptoNinja1155CollectionAdd}`}
    />
  );
}

function DynamicRouteComponent(props) {
  let route = "";
  if (props === "penpenz") {
    route = `/penpenz/minting/ethereum/${critpoNinjaCollectionAdd}`;
  } else if (props === "crypto") {
    route = `/cryptoninja/minting/xanachain/${cryptoNinja1155CollectionAdd}`;
  } else {
    route = `/breakingdown/minting/ethereum/${breakingdownCollectionAdd}`;
  }
  return <Redirect to={route} />;
}

function LazyLoad(props) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {props.match.path === "/land/minting/:chain/:collId" ? (
          <LandWhiteListSale />
        ) : props.match.path === "/deemo/minting/:chain/:collId" ? (
          <DeemoWhiteListSale />
        ) : props.match.path === "/astroboy/okayama/minting/:chain/:collId" ? (
          <AstroBoyWhiteListSale />
        ) : props.match.path ===
          "/corporate_collaboration_t-shirts/minting/:chain/:collId" ? (
          <CorporateCollectionWhiteListSale />
        ) : props.match.path === "/penpenz/minting/:chain/:collId" ? (
          <CriptoNinjaCollectionWhiteListSale />
        ) : props.match.path === "/breakingdown/minting/:chain/:collId" ? (
          <BreakDownNftCollectionWhiteListSale />
        ) : props.match.path === "/cryptoninja/minting/:chain/:collId" ? (
          <CryptoNinja1155CollectionWhiteListSale />
        ) : (
          <></>
        )}
      </Suspense>
    </div>
  );
}

if (!localStorage.getItem("loggedout")) {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("loggedout", 1);
}
function App(props) {
  const allwoedLanguages = ["en"];

  const [engLang, setEngLang] = useState({});

  useEffect(() => {
    const langeuage = localStorage.getItem("lang");
    if (isEmpty(langeuage)) {
      localStorage.setItem("lang", "en");
    }

    fetchLanguage();
    const browserLanguage =
      window.navigator.userLanguage || window.navigator.language;
    if (allwoedLanguages.includes(browserLanguage)) {
      localStorage.setItem("lang", browserLanguage);
      props.setLanguage(browserLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language, props.awardTranslationJson]);

  const fetchLanguage = () => {
    if (props.language === "en") {
      fetch("https://demsrmn8x8iiu.cloudfront.net/lang/xanalia/en.json")
        .then((response) => response.json())
        .then((res) => {
          let keys = Object.assign(res.common, props.awardTranslationJson);
          setEngLang(keys);
        })
        .catch((err) => {
          console.error("err", err);
        });
    }
  };

  const messages = {
    en: engLang,
  };

  return (
    <div className={"App"}>
      {" "}
      {/* <ReactNotification /> */}
      <IntlProvider
        onError={() => {}}
        locale={props.language}
        messages={messages[props.language]}
      >
        <Header />
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/land/minting/:chain/:collId"
              component={LazyLoad}
            />
            <Route
              exact
              path="/deemo/minting/:chain/:collId"
              component={LazyLoad}
            />
            <Route
              exact
              path="/astroboy/okayama/minting/:chain/:collId"
              component={LazyLoad}
            />
            <Route
              exact
              path="/corporate_collaboration_t-shirts/minting/:chain/:collId"
              component={LazyLoad}
            />
            <Route
              exact
              path="/penpenz/minting/:chain/:collId"
              component={LazyLoad}
            />
            <Route
              exact
              path="/breakingdown/minting/:chain/:collId"
              component={Dummy}
            />
            <Route
              exact
              path="/cryptoninja/minting/:chain/:collId"
              component={LazyLoad}
            />
            <Route
              exact
              path="/penpenz/minting/xzbdyxoxcr"
              component={() => DynamicRouteComponent("penpenz")}
            />

            <Route
              exact
              path="/breakingdown/minting/xzbdyboboq"
              component={Dummy}
            />

            <Route
              exact
              path="/cryptoninja/minting/xzbdyboboq"
              component={() => DynamicRouteComponent("crypto")}
            />

            <RouteComponent path="*" />
            <Route component={PageNotFound} />
          </Switch>
        </BrowserRouter>
        <ToastContainer />
      </IntlProvider>
    </div>
  );
}

const mapDispatchToProps = {
  setLanguage,
  setAwardTranslation,
};
const mapStateToProps = (state) => {
  return {
    language: state.metaMaskReducer.language,
    awardTranslationJson: state.metaMaskReducer.awardTranslationJson,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
