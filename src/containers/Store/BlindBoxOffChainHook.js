import React, { Component, useState, useEffect, useRef } from "react";
import { networkType } from "../../config/networkType";
import axios from "axios";
import TabFilter from "../../component/Tabs/Tabs";
import { blockChainConfig } from "../../config/blockChainConfig";
import { FormattedMessage, injectIntl } from "react-intl";
import insertComma from "../../utils/insertComma";
import { Button, Card, Tabs, Tab, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import checkWalletConnection from "../../utils/checkWalletConnection";
import { setTransactionInProgress } from "../../_actions/metaMaskActions";
import NewLoader from "../../component/Loader/loader";
import { toast } from "react-toastify";
import { divideNo } from "../../utils/divideByEighteen";
import { trimZeroFromTheEnd } from "../../utils/trimZeroFromValue";
import { showActualValue } from "../../utils/showActualValue";
import { CDN_LINK } from "../../utils/constants";
import NewCard from "../../component/Card/new-card";
import { checkAvailabilityOnChain } from "../../config/setupNetworkInWallet";
import { basePriceTokens } from "../../config/availableTokens";
import CountDown from "../../component/CountDown/countDown";
import { withRouter } from "react-router-dom";

// import Recaptcha from "react-google-recaptcha";
import Big from "big.js";

import "./BlindBoxCollection.scss";

let MarketPlaceAbi,
  MarketContractAddress = "";

let OffChainBlindBoxAbi,
  OffChainBlindBoxAddress = "";

let ApproveAbi = "";
let providerUrl = "";

const Web3 = require("web3");

const imageToChainKey = {
  polygon: {
    active: "_poly-A.svg",
    inactive: "_poly.svg",
  },
  binance: {
    active: "_binance-A.svg",
    inactive: "_binance.svg",
  },
  ethereum: {
    active: "_ETH-A.svg",
    inactive: "_ETH.svg",
  },
};
function BlindBoxOffChain(props) {
  const staticMetaData = {
    name: "Astroboy x Tottori",
    description:
      "UAstroboy x Japan is the GameFi NFT for NFTduel, featuring the most sold Japanese comic character Astroboy with Japans' regional sightseeing spots.",
    image: "https://ik.imagekit.io/xanalia/1651132707501.jpg",
    properties: {
      type: "2D",
    },
    type: "2D",
    totalSupply: "",
    externalLink: "",
    thumbnft: "https://ik.imagekit.io/xanalia/1651132707501.jpg",
    thumbnailUrl: "https://ik.imagekit.io/xanalia/1651132707501.jpg",
  };

  const myRef = useRef(null);

  const [stateObj, setStateObj] = useState({
    selectedPack: "",
    shouldUpdate: false,
    shouldLoad: false,
    noRecord: "",
    blindBoxFound: true,
    collectionFound: true,
    baseCurrency: "",
    availableChains: [],
    selectedCurrencyToTrade: "",

    userIsWhiteListed: false,
    whiteListId: "",

    userBoxCount: 0,

    chainChanged: false,
  });

  const [selectedRound, setSelectedRound] = useState("");

  const [rangeToBuy, setRangeToBuy] = useState("");

  const [loaderFor, setLoaderFor] = useState("");
  const [selectedRangeToBuy, setSelectedRangeToBuy] = useState("");
  const [priceOnDollar, setPriceOnDollar] = useState(0);
  const [nftChain, setNftChain] = useState("");
  const [loader, setLoader] = useState(true);
  const [selectedBlindBox, setSelectedBlindBox] = useState("");

  const [seconds, setSeconds] = useState(0);

  const setContractAddress = () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        MarketPlaceAbi = blockChainConfig[i].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[i].marketConConfig.add;

        OffChainBlindBoxAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
        OffChainBlindBoxAddress =
          blockChainConfig[i].offChainBlindBoxConConfig.add;

        ApproveAbi = blockChainConfig[i].marketApproveConConfig.abi;
        providerUrl = blockChainConfig[i].providerUrl;
      }
    }
  };

  async function calculatePriceData() {
    let w = new Web3(providerUrl);
    let dPrice = divideNo(
      await calculatePrice(
        w.utils.toWei(selectedRound.priceOnChain.toString(), "ether"),
        nftChain === "ethereum" ? 0 : 1,
        "0x0000000000000000000000000000000000000000"
      )
    );
    setPriceOnDollar(dPrice);
    setLoader(false);
  }

  useEffect(() => {
    const whitelistInterval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 5000);

    getBoxes();

    return () => {
      clearInterval(whitelistInterval);
    };
  }, []);

  useEffect(() => {
    if (seconds) getUserWhiteListStatus();
  }, [seconds]);

  useEffect(() => {
    if (selectedRound) calculatePriceData();
  }, [selectedRound]);

  useEffect(() => {
    let userConnected = localStorage && localStorage.getItem("userConnected");
    if (props.metaMaskAddress && userConnected && selectedRound) {
      getUserWhiteListStatus();
      getUserRemainingNFT();
    }
  }, [props.metaMaskAddress, selectedRound]);

  useEffect(() => {
    if (selectedBlindBox !== "") {
      setContractAddress();
      // let baseCurrencyBB =
      //   index !== "" &&
      //   selectedBlindBox.seriesChain[index][nftChain]
      //     .baseCurrency;
      let baseCurrencyBB =
        nftChain === "ethereum"
          ? 1
          : nftChain === "binance"
          ? 2
          : nftChain === "polygon"
          ? 3
          : "";
      let baseCurrency = basePriceTokens.filter(
        (token) => token.chain === nftChain && token.order === baseCurrencyBB
      );
      let chainCurrency = basePriceTokens.filter(
        (token) => token.chain === nftChain && token.chainCurrency
      );

      getCurrentRound();
      setStateObj((prevState) => ({
        ...prevState,
        baseCurrency: baseCurrency[0],
        selectedCurrencyToTrade: chainCurrency[0],
      }));
      getOwnedNFT();
    }
  }, [selectedBlindBox]);

  useEffect(() => {
    if (stateObj.chainChanged) {
      setLoader(true);
      getBoxes();
    }
  }, [stateObj.chainChanged]);

  const getUserWhiteListStatus = async () => {
    if (
      localStorage.getItem("connectedWith") === "paymentCard" ||
      localStorage.getItem("cryptoUserAuth")
    ) {
      try {
        let pUrl, ocBBAbi, ocBBAdd;
        for (let i = 0; i < blockChainConfig.length; i++) {
          if (blockChainConfig[i].key === nftChain) {
            ocBBAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
            ocBBAdd = blockChainConfig[i].offChainBlindBoxConConfig.add;
            pUrl = blockChainConfig[i].providerUrl;
          }
        }
        let web3 = new Web3(pUrl);
        let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
        let userAddress, conId;
        if (PackContract.methods.isUserWhiteListed && selectedRound) {
          if (localStorage.getItem("cryptoUserAuth")) {
            userAddress = props.metaMaskAddress;
            conId =
              "0x6c00000000000000000000000000000000000000000000000000000000000000";
          }

          let res = await PackContract.methods
            .isUserWhiteListed(selectedRound.roundId, userAddress)
            .call();
          console.log("res for white list", res);

          if (res !== undefined && res === true) {
            setStateObj((prevState) => ({
              ...prevState,
              userIsWhiteListed: true,
              whiteListId: conId,
            }));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getUserRemainingNFT = async () => {
    const selectedNFTChain = nftChain;
    let pUrl, ocBBAbi, ocBBAdd;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === selectedNFTChain) {
        ocBBAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
        ocBBAdd = blockChainConfig[i].offChainBlindBoxConConfig.add;
        pUrl = blockChainConfig[i].providerUrl;
      }
    }

    let web3 = new Web3(pUrl);
    let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
    let userAddress;
    if (localStorage.getItem("cryptoUserAuth")) {
      userAddress = localStorage.getItem("accounts");
    }

    if (userAddress && selectedRound?.roundId) {
      let res = await PackContract.methods
        .getUserBoxCount(selectedRound?.roundId, userAddress)
        .call({ from: userAddress });

      if (res !== undefined) {
        let diff = parseInt(selectedRound.perUserLimit) - parseInt(res);
        let arr = [];
        for (let i = 1; i <= diff; i++) arr.push(i);
        // console.log(arr);
        setStateObj((prevState) => ({
          ...prevState,
          userBoxCount: parseInt(res),
        }));
        setRangeToBuy(arr);
      }
    }
  };

  const genericOwnedNFT = async (chain, userAddress) => {
    const selectedNFTChain = chain;
    let pUrl, ocBBAbi, ocBBAdd;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === selectedNFTChain) {
        ocBBAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
        ocBBAdd = blockChainConfig[i].offChainBlindBoxConConfig.add;
        pUrl = blockChainConfig[i].providerUrl;
      }
    }
    let web3 = new Web3(pUrl);
    let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
    try {
      let totalSupply = await PackContract.methods.totalSupply().call();
      // console.log(totalSupply, chain);
      //   let res = await PackContract.methods.tokensOfOwner(userAddress).call();
      let res = await PackContract.methods
        .tokensOfOwnerIn(userAddress, 1, totalSupply + 1)
        .call();

      // console.log(totalSupply, chain);
      // let res = await PackContract.methods.tokensOfOwner(userAddress).call();
      // let startIndex =
      //   networkType === "testnet" || chain === "ethereum" ? 1 : 20001;
      // let res = await PackContract.methods
      //   .tokensOfOwnerIn(userAddress, startIndex, totalSupply + 1)
      //   .call();

      console.log("res from tokensOfOwner", chain, res);
      // res = [1, 2];
      if (res !== undefined) {
        // let afterCall = [];
        let asyncCall = [];
        for (let i = 0; i < res.length; i++) {
          asyncCall.push(PackContract.methods.tokenURI(res[i]).call());
        }
        let afterCall = await Promise.all([...asyncCall]);
        asyncCall = [];
        for (let i = 0; i < afterCall.length; i++) {
          asyncCall.push(axios.get(afterCall[i]));
        }
        afterCall = await Promise.all([...asyncCall]);

        let nftData = [];
        for (let i = 0; i < afterCall?.length; i++) {
          if (afterCall[i].status === 200 && afterCall[i].data.name) {
            let obj = {
              metaData: { ...afterCall[i].data },
            };
            nftData.push({
              name: obj?.metaData?.name,
              image: obj?.metaData?.image
                ? obj?.metaData?.image
                : obj?.imageUrl,
              description: obj?.metaData?.description
                ? obj?.metaData?.description
                : obj?.description,
              type: obj?.metaData?.properties?.type
                ? obj?.metaData?.properties?.type
                : obj?.type,
              properties: {
                type: obj?.metaData?.properties?.type,
              },
              totalSupply: obj?.metaData?.totalSupply,
              externalLink: obj?.metaData?.externalLink,
              thumbnft: obj?.metaData?.thumbnft,
              thumbnailUrl: obj?.metaData?.thumbnft,
              tokenURI: obj?.returnValues?.tokenURI,
              nftChain: chain,
            });
          }
        }
        // let nftData = [];
        // for (let i = 0; i < res?.length; i++) {
        //   nftData.push({ ...staticMetaData, nftChain: chain });
        // }
        return nftData;
      }
    } catch (err) {
      return [];
    }
  };

  const getOwnedNFT = async () => {
    setStateObj((prevState) => ({ ...prevState, shouldLoad: true }));
    let userAddress;
    if (localStorage.getItem("cryptoUserAuth")) {
      userAddress = localStorage.getItem("accounts");
    } else {
      setStateObj((prevState) => ({
        ...prevState,
        noRecord: "noRecord",
        shouldLoad: false,
      }));
      setSelectedPack([]);
    }

    if (userAddress) {
      let collectiveResponse,
        bResponse,
        eResponse,
        pResponse = [];
      bResponse = await genericOwnedNFT("binance", userAddress);
      eResponse = await genericOwnedNFT("ethereum", userAddress);
      pResponse = await genericOwnedNFT("polygon", userAddress);
      console.log("bResponse", bResponse, eResponse, pResponse);
      collectiveResponse = [...bResponse, ...eResponse, ...pResponse];
      console.log(collectiveResponse);
      if (collectiveResponse.length > 0) {
        setSelectedPack(collectiveResponse);
      } else {
        setStateObj((prevState) => ({ ...prevState, noRecord: "noRecord" }));
        setSelectedPack(collectiveResponse);
      }
      setStateObj((prevState) => ({ ...prevState, shouldLoad: false }));
    }
  };

  const setSelectedPack = (nftData) => {
    setStateObj((prevState) => ({
      ...prevState,
      selectedPack: {
        tokenUri: nftData,
      },
    }));
  };

  const getRoundDetails = async (selectedNFTChain) => {
    let pUrl, ocBBAbi, ocBBAdd;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === selectedNFTChain) {
        ocBBAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
        ocBBAdd = blockChainConfig[i].offChainBlindBoxConConfig.add;
        pUrl = blockChainConfig[i].providerUrl;
      }
    }
    let web3 = new Web3(pUrl);
    let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
    let timeStamp = parseInt(new Date().getTime() / 1000);
    let res = await PackContract.methods.getRoundDetails(timeStamp).call();
    return res;
  };

  const getCurrentRound = async () => {
    let res = await getRoundDetails(nftChain);
    if (res !== undefined) {
      let obj = {
        endTime: res.endTime,
        startTime: res.startTime,
        perUserLimit: parseInt(res.userPurchaseLimit),
        maxBoxesChain: parseInt(res.maxSupply),
        buyBoxCount: parseInt(res.supply),
        roundId: parseInt(res._roundId),
        priceOnChain: divideNo(res.price),
        whiteListCheck: res.iswhiteList,
      };
      let diff = parseInt(obj.perUserLimit) - parseInt(stateObj.userBoxCount);
      let arr = [];
      //   console.log(diff);
      for (let i = 1; i <= diff; i++) arr.push(i);
      setSelectedRound(obj);
      setRangeToBuy(arr);
    }
  };

  const getBoxes = async () => {
    let url =
      networkType === "testnet"
        ? `https://testapi.xanalia.com/blindBox/view-blind-series-info?collectionAddress=${props.match.params.collId}&frontend=true`
        : `https://api.xanalia.com/blindBox/view-blind-series-info?collectionAddress=${props.match.params.collId}&frontend=true`;
    let res = await axios.get(url);
    if (res.data.data) {
      // let bb = res.data.data?.filter(
      //   (b) => b._id === props.match.params.blindBoxId
      // );
      let bb = [res.data.data[res.data.data.length - 1]];
      let availableChains = [];
      let bscRound = await getRoundDetails("binance");
      // let ethRound = await getRoundDetails("ethereum");
      console.log(bscRound);
      if (parseInt(bscRound._roundId)) {
        for (let i = 0; i < bb[0]?.seriesChain?.length; i++) {
          // if( parseInt(bscRound._roundId) || parseInt(ethRound._roundId)){
          // for (let i = 0; i < bb[0].seriesChain.length; i++) {
          // if (bb[0].seriesChain[i].hasOwnProperty("polygon")) {
          //   availableChains.push("polygon");
          // }
          //  else if (
          //   bb[0].seriesChain[i]?.hasOwnProperty("ethereum") &&
          //   parseInt(ethRound._roundId)
          // ) {
          //   availableChains.push("ethereum");
          // }
          // else
          if (
            bb[0].seriesChain[i].hasOwnProperty("binance") &&
            parseInt(bscRound._roundId)
          ) {
            availableChains.push("binance");
          }
        }
      } else {
        for (let i = 0; i < bb[0]?.seriesChain?.length; i++) {
          if (bb[0].seriesChain[i].hasOwnProperty("polygon")) {
            availableChains.push("polygon");
          } else if (bb[0].seriesChain[i]?.hasOwnProperty("ethereum")) {
            availableChains.push("ethereum");
          } else if (bb[0].seriesChain[i].hasOwnProperty("binance")) {
            availableChains.push("binance");
          }
        }
      }
      // console.log(availableChains);
      if (nftChain === "") {
        setNftChain(availableChains[0] ? availableChains[0] : "binance");
      }
      setSelectedBlindBox(bb ? bb[0] : []);
      setStateObj((prevState) => ({
        ...prevState,
        shouldLoad: false,
        shouldUpdate: true,
        chainChanged: false,
        availableChains: availableChains.sort(),
      }));
    }
  };

  const showConnectPopUp = () => {
    document.getElementById("connectWallet")?.click();
  };

  const handleApprove = () => {
    if (checkWalletConnection(props.contract, props.metaMaskAddress)) {
      let appprovalValue =
        "115792089237316195423570985008687907853269984665640564039457";
      let web3 = new Web3(props.provider);
      web3.eth
        .getAccounts()
        .then((acc) => {
          let approvalContract = new web3.eth.Contract(
            ApproveAbi,
            stateObj.selectedCurrencyToTrade.approvalAdd
          );
          approvalContract.methods
            .approve(
              OffChainBlindBoxAddress,
              web3.utils.toWei(appprovalValue, "ether")
            )
            .send({ from: acc[0] })
            .then((res) => {
              handleApproveForAll();
            })
            .catch((err) => {
              props.setTransactionInProgress(false);
              setLoaderFor("");
            });
        })
        .catch((err) => {
          props.setTransactionInProgress(false);
          setLoaderFor("");
        });
    }
  };

  const handleApproveForAll = () => {
    if (checkWalletConnection(props.contract, props.metaMaskAddress)) {
      let web3 = new Web3(props.provider);
      let PackContract = new web3.eth.Contract(
        OffChainBlindBoxAbi,
        OffChainBlindBoxAddress
      );
      let approvalContract = new web3.eth.Contract(
        ApproveAbi,
        stateObj.selectedCurrencyToTrade.approvalAdd
      );
      web3.eth.getAccounts().then((acc) => {
        handleBuyCall(PackContract, approvalContract, acc);
      });
    }
  };

  const calculatePrice = async (price, tradeCurr, owner) => {
    let collectionAddress = OffChainBlindBoxAddress;
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );
    let res = await MarketPlaceContract.methods
      .calculatePrice(
        price,
        stateObj.baseCurrency.order,
        tradeCurr,
        selectedRound.roundId,
        owner,
        collectionAddress
      )
      .call();
    if (res) return res;
    else return "";
  };

  const handleBuyCall = async (PackContract, approvalContract, acc) => {
    let decimals = await approvalContract.methods.decimals().call();
    let w = new Web3(providerUrl);
    approvalContract.methods.balanceOf(acc[0]).call(async (err, res) => {
      let ownerAdd = selectedBlindBox.collectionAddr[nftChain];
      let convertedCurrency = await calculatePrice(
        w.utils.toWei(selectedRound.priceOnChain.toString(), "ether"),
        stateObj.selectedCurrencyToTrade.order,
        ownerAdd
      );
      if (!err) {
        if (
          parseInt(res) / Math.pow(10, parseInt(decimals)) === 0 ||
          parseInt(res) / Math.pow(10, parseInt(decimals)) <
            parseInt(divideNo(convertedCurrency))
        ) {
          setLoaderFor("");
          props.setTransactionInProgress(false);
          toast.info(props.intl.formatMessage({ id: "nobaltoproceed" }), {
            position: "bottom-right",
            autoClose: 3000,
            progress: undefined,
            toastId: "nobaltoproceed-1",
          });
        } else {
          PackContract.methods
            .buyBox(
              selectedRound.roundId,
              false,
              stateObj.selectedCurrencyToTrade.order,
              selectedBlindBox.collectionAddr[nftChain],
              "",
              stateObj.whiteListId
            )
            .send({ from: acc[0] })
            .then((res) => {
              console.log("res after success", res);
              toast.success("Transaction got successfull", {
                position: "bottom-right",
                autoClose: 3000,
                progress: undefined,
                toastId: "nobaltoproceed-1",
              });
              props.setTransactionInProgress(false);
              setLoaderFor("");
              setSelectedRangeToBuy("");
              getBoxes();
              document.getElementById("noOfToken").value = "";
            })
            .catch((err) => {
              props.setTransactionInProgress(false);
              setLoaderFor("");
            });
        }
      } else {
        setLoaderFor("");
        props.setTransactionInProgress(false);
      }
    });
  };

  const buyNFTBnb = async (MarketPlaceContract, acc) => {
    let web3 = new Web3(props.provider);
    let ownerAdd = OffChainBlindBoxAddress;
    // let finalPrice = selectedRound.priceOnChain * selectedRangeToBuy;
    let x = new Big(selectedRound.priceOnChain);
    let y = new Big(selectedRangeToBuy);
    let finalPrice = x.times(y).toNumber();
    let res = divideNo(
      await calculatePrice(
        web3.utils.toWei(finalPrice.toString(), "ether"),
        stateObj.selectedCurrencyToTrade.order,
        ownerAdd
      )
    );

    console.log("res after calculate price", res);
    let addedFivePercent = res;
    if (
      !stateObj.baseCurrency.chainCurrency &&
      stateObj.selectedCurrencyToTrade.chainCurrency
    ) {
      let percetile = (parseFloat(res) / 100) * 5;
      addedFivePercent = (parseFloat(res) + parseFloat(percetile)).toFixed(18);
    }

    let balance = await web3.eth.getBalance(acc[0]);
    if (parseFloat(balance) < parseFloat(addedFivePercent)) {
      setLoaderFor("");
      props.setTransactionInProgress(false);
      toast.info(props.intl.formatMessage({ id: "nobaltoproceed" }), {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "nobaltoproceed-1",
      });
      return;
    }

    MarketPlaceContract.methods
      .buyBox(selectedRound.roundId, selectedRangeToBuy)
      .send({
        from: acc[0],
        value: web3.utils.toHex(
          web3.utils.toWei(addedFivePercent.toString(), "ether")
        ),
      })
      .then((res) => {
        console.log("res after success", res);
        toast.success("Transaction got successfull", {
          position: "bottom-right",
          autoClose: 3000,
          progress: undefined,
          toastId: "nobaltoproceed-1",
        });
        props.setTransactionInProgress(false);
        setLoaderFor("");
        setSelectedRangeToBuy("");
        getBoxes();
        document.getElementById("noOfToken").value = "";
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
      });
  };

  const buyNFTItem = async () => {
    const connectedWithTo = localStorage.getItem("connectedWith");

    if (!stateObj.availableChains.toString().includes(nftChain)) {
      toast.info(<FormattedMessage id="SelectNtwkchainmsg" />, {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "SelectNtwkchainmsg-1",
      });
      return;
    }

    // if (
    //   connectedWithTo !== "paymentCard" &&
    //   !selectedBlindBox.cryptoAllowed[nftChain]
    // ) {
    //   toast.info(<FormattedMessage id="notallowtopen" />, {
    //     position: "bottom-right",
    //     autoClose: 3000,
    //     progress: undefined,
    //     toastId: "notallowtopen-1",
    //   });
    //   return;
    // }

    if (connectedWithTo) {
      // if (!stateObj.selectedCurrencyToTrade) {
      //   toast.info(<FormattedMessage id="selectcurrencymsg" />, {
      //     position: "bottom-right",
      //     autoClose: 3000,
      //     progress: undefined,
      //     toastId: "selectcurrencymsg-1",
      //   });
      //   return;
      // }

      if (!selectedRangeToBuy) {
        toast.info("Please add no NFTs you want to buy.", {
          position: "bottom-right",
          autoClose: 3000,
          progress: undefined,
          toastId: "selectcurrencymsg-1",
        });
        return;
      }

      if (
        selectedRangeToBuy >
        parseInt(selectedRound.maxBoxesChain) -
          parseInt(selectedRound.buyBoxCount)
      ) {
        toast.info(
          `Max available nfts to buy is ${
            parseInt(selectedRound.maxBoxesChain) -
            parseInt(selectedRound.buyBoxCount)
          }`,
          {
            position: "bottom-right",
            autoClose: 3000,
            progress: undefined,
            toastId: "selectcurrencymsg-1",
          }
        );
        return;
      }

      let web3 = new Web3(props.provider);
      if (props.transactionInProgress) return;

      if (checkWalletConnection(props.contract, props.metaMaskAddress)) {
        let availability = await checkAvailabilityOnChain(
          nftChain,
          props?.intl?.formatMessage,
          true,
          "blindBox"
        );
        if (!availability) {
          toast.info(<FormattedMessage id="changetobuyBB" />, {
            position: "bottom-right",
            autoClose: 3000,
            progress: undefined,
            toastId: "changetobuyBB-1",
          });
          return;
        }
        web3.eth
          .getAccounts()
          .then(async (acc) => {
            setLoaderFor("Buy");
            let balance = await web3.eth.getBalance(acc[0]);
            if (parseFloat(balance) === 0) {
              setLoaderFor("");
              props.setTransactionInProgress(false);
              toast.info(props.intl.formatMessage({ id: "nobaltoproceed" }), {
                position: "bottom-right",
                autoClose: 3000,
                progress: undefined,
                toastId: "nobaltoproceed-1",
              });
              return;
            }
            props.setTransactionInProgress(true);
            if (stateObj.selectedCurrencyToTrade.approvalRequired) {
              let approvalContract = new web3.eth.Contract(
                ApproveAbi,
                stateObj.selectedCurrencyToTrade.approvalAdd
              );

              approvalContract.methods
                .allowance(acc[0], OffChainBlindBoxAddress)
                .call((err, res) => {
                  props.setTransactionInProgress(true);
                  if (parseInt(res) / Math.pow(10, 18) <= 0) {
                    handleApprove();
                  } else {
                    handleApproveForAll();
                  }
                });
            } else {
              let PackContract = new web3.eth.Contract(
                OffChainBlindBoxAbi,
                OffChainBlindBoxAddress
              );
              buyNFTBnb(PackContract, acc);
            }
          })
          .catch((err) => {
            props.setTransactionInProgress(false);
            setLoaderFor("");
          });
      }
    }
  };

  const handleChainChange = async (type) => {
    if (nftChain !== type) {
      setNftChain(type);
      setStateObj((prevState) => ({
        ...prevState,
        shouldUpdate: true,
        shouldLoad: true,
        selectedCurrencyToTrade: "",
        chainChanged: true,
      }));
    }
  };

  const handleTimeOut = (roundExpiration) => {
    setStateObj((prevState) => ({
      ...prevState,
      shouldUpdate: true,
      shouldLoad: true,
      chainChanged: true,
      userIsWhiteListed: false,
      userBoxCount: 0,
    }));
  };

  const handleVideoMute = () => {
    myRef.current.muted = !myRef.current.muted;
  };

  const handleDepositeAmountChange = (evt) => {
    const re = /^[0-9\b]+$/;
    if (re.test(evt.target.value) || evt.target.value === "")
      setSelectedRangeToBuy(
        evt.target.value === "" ? "" : parseInt(evt.target.value)
      );
  };

  let intl;
  if (props && props.intl) {
    intl = props.intl;
  }

  return (
    <React.Fragment>
      {!loader ? (
        <div className="collectionPageUi" id="home-page">
          {stateObj.blindBoxFound && stateObj.collectionFound ? (
            <>
              <div className="collectionUiBody">
                <div className="collectionBanner">
                  <img
                    alt="bannerimage"
                    src={
                      selectedBlindBox
                        ? selectedBlindBox.bannerImage
                        : "https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206700.png"
                    }
                    className="collectionBannerImg"
                  />
                </div>
                <Card className="collectionProfileCard">
                  <Card.Img
                    variant="top"
                    src={
                      selectedBlindBox
                        ? selectedBlindBox.iconImage
                        : "https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206707.jpg?tr=w-113,tr=h-113"
                    }
                  />
                  <Card.Body>
                    <Card.Title>HIROKO KOSHINO ANOTHER ONE</Card.Title>
                    <div className="networkButtonsGrup">
                      {stateObj.availableChains.map((item, index) => {
                        return (
                          <div key={index}>
                            <button
                              key={item}
                              onClick={() => handleChainChange(item)}
                              className={`networkButtonUI ${
                                nftChain === item ? "active" : ""
                              }`}
                            >
                              <img
                                className="outlineImg"
                                alt={item}
                                src={`https://ik.imagekit.io/xanalia/Images/${imageToChainKey[item].inactive}`}
                              />
                              <img
                                className="fillImage"
                                alt={item}
                                src={`https://ik.imagekit.io/xanalia/Images/${imageToChainKey[item].active}`}
                              />
                              {item.substr(0, 1).toUpperCase() +
                                item.substr(1, item.length)}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Card.Body>
                </Card>

                {selectedBlindBox && (
                  <div className="collectionProductUI">
                    {selectedBlindBox?.packVideo?.match(
                      /\.(jpg|jpeg|png|gif)$/
                    ) ? (
                      <div className="collectionProductImg">
                        <img
                          alt=""
                          src={
                            selectedBlindBox?.packVideo
                              ? selectedBlindBox?.packVideo
                              : `https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206707.jpg`
                          }
                          // src="https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206707.jpg"
                        />
                      </div>
                    ) : (
                      <div
                        className="collectionProductImg"
                        onClick={() => handleVideoMute()}
                      >
                        <video
                          autoPlay={true}
                          muted
                          loop={true}
                          ref={myRef}
                          playsInline
                        >
                          <source
                            // src={
                            //   selectedBlindBox?.packVideo
                            //     ? selectedBlindBox?.packVideo
                            //     : `https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206707.jpg`
                            // }
                            src="https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206707.jpg"
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    )}
                    <div className="collectionProductDetails">
                      <h5>{selectedBlindBox.name}</h5>
                      <h2 className="">
                        {selectedRound?.priceOnChain &&
                          selectedRound?.priceOnChain > 0 &&
                          trimZeroFromTheEnd(
                            showActualValue(
                              selectedRound?.priceOnChain?.toString(),
                              18,
                              "string"
                            ),
                            true
                          )}

                        <span className="currencyName">
                          {stateObj.baseCurrency &&
                          selectedRound?.priceOnChain > 0
                            ? stateObj.baseCurrency.key
                            : ""}
                          {/* $ */}
                        </span>
                        <span className="dollerValueTxt">
                          {selectedRound?.priceOnChain > 0 &&
                            "$" +
                              insertComma(
                                parseFloat(priceOnDollar)?.toFixed(2)
                              )}
                        </span>
                      </h2>
                      {new Date().getTime() <=
                        parseInt(selectedRound.endTime) * 1000 &&
                      new Date().getTime() >=
                        parseInt(selectedRound.startTime) * 1000 ? (
                        <>
                          Ending After
                          <CountDown
                            boxInitiateTime={selectedRound.endTime * 1000}
                            handleTimeOut={handleTimeOut}
                            roundExpiration={true}
                          />
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="buttonGrupBuy">
                        {parseInt(selectedRound.startTime) * 1000 <=
                        new Date().getTime() ? (
                          parseInt(selectedRound.endTime) * 1000 <=
                          new Date().getTime() ? (
                            <>
                              <Button
                                className="buypackBtn"
                                block
                                type="button"
                                variant="primary"
                              >
                                <FormattedMessage id="timeExpired"></FormattedMessage>
                              </Button>
                            </>
                          ) : selectedRound?.buyBoxCount !== undefined &&
                            selectedRound?.buyBoxCount <
                              selectedRound?.maxBoxesChain ? (
                            props.metaMaskAddress ? (
                              parseInt(stateObj.userBoxCount) <
                                parseInt(selectedRound.perUserLimit) ||
                              parseInt(selectedRound?.perUserLimit) === 0 ? (
                                stateObj.userIsWhiteListed ||
                                !selectedRound.whiteListCheck ? (
                                  <>
                                    <Button
                                      block
                                      type="button"
                                      variant="primary"
                                      className="buypackBtn "
                                      onClick={() => buyNFTItem()}
                                    >
                                      {loaderFor === "Buy" ? (
                                        <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                          variant="info"
                                          role="status"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <FormattedMessage id="buy"></FormattedMessage>
                                      )}
                                    </Button>

                                    {props.metaMaskAddress !== "" &&
                                    rangeToBuy !== "" ? (
                                      rangeToBuy.length > 0 ? (
                                        <div className="multiselectHead">
                                          <select
                                            className="form-control"
                                            onChange={
                                              handleDepositeAmountChange
                                            }
                                            id="noOfToken"
                                          >
                                            <option value={""}>
                                              Select No of NFTs
                                            </option>
                                            {rangeToBuy.map((token) => {
                                              return (
                                                <option
                                                  value={token}
                                                  key={token}
                                                >
                                                  {token}
                                                </option>
                                              );
                                            })}
                                          </select>
                                        </div>
                                      ) : (
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Enter amount"
                                          onChange={handleDepositeAmountChange}
                                          value={selectedRangeToBuy}
                                        />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <FormattedMessage id={"notwhitelistuser"} />
                                  </>
                                )
                              ) : (
                                <>
                                  {intl.formatMessage({
                                    id: "buylimitreach",
                                  })}
                                </>
                              )
                            ) : (
                              <Button
                                block
                                type="button"
                                variant="primary"
                                className="buypackBtn"
                                onClick={() => showConnectPopUp()}
                              >
                                <FormattedMessage id="buy"></FormattedMessage>
                              </Button>
                            )
                          ) : (
                            <Button
                              className="buypackBtn"
                              block
                              type="button"
                              variant="primary"
                            >
                              <FormattedMessage id="soldout"></FormattedMessage>
                            </Button>
                          )
                        ) : (
                          <>
                            <CountDown
                              boxInitiateTime={selectedRound.startTime * 1000}
                              handleTimeOut={handleTimeOut}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="rightcollectionProductDetails">
                      <div className="mt-auto mb-0 collectionProductTabs">
                        <Tabs
                          defaultActiveKey="CollectionId"
                          id="uncontrolled-tab-example"
                        >
                          <Tab eventKey="CreatorId" title="Creator">
                            <h3>Hiroko Koshino</h3>
                            <p className="creatorDescription">
                              Born in OSA, eldest of 3 sisters, iconic F DZNr of
                              JPN, w over 60 yrs carrier at TKO, PAR, Rome, TPE
                              Being artist lately 2 run KH A.G.at Ashiya, HYO{" "}
                            </p>
                          </Tab>
                          <Tab eventKey="CollectionId" title="Collection">
                            <h3>HIROKO KOSHINO ANOTHER ONE</h3>
                            <p>
                              Limit u made 4 u, safe assureness, brk thru the
                              boredom 2 get new wind, discovery by change w adv
                              mind 2 say bye 4 usual. Brd new urself is found
                            </p>
                          </Tab>
                          {/* <Tab eventKey="HowToBuy" title="How To Buy">
                            <p className="creatorDescriptionBuy">
                              <ol>
                                <li>
                                  Login To Metamask with desire chain ETH/BSC
                                </li>
                                <li>
                                  Select the similar chain as from top right
                                  corner
                                </li>
                                <li>Click on buy for ETH and BNB</li>
                                <li>
                                  Final will be confirmation for transaction
                                </li>
                              </ol>
                              <span>
                                Congrats your Bought NFT will be shown in owned
                              </span>
                            </p>
                          </Tab> */}
                        </Tabs>
                      </div>
                    </div>
                  </div>
                )}
                <div className={`collectionNav`}>
                  <TabFilter
                    shouldLoad={stateObj.shouldLoad}
                    metaMaskAddress={props.metaMaskAddress}
                    showFilter={true}
                  />
                </div>
                {!stateObj.shouldLoad && !stateObj.selectedPack?.tokenUri ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      No NFTs Found
                    </div>
                  </>
                ) : !stateObj.shouldLoad &&
                  stateObj.selectedPack?.tokenUri &&
                  stateObj.selectedPack?.tokenUri?.length > 0 ? (
                  <>
                    <div className="collectionListcontainer">
                      <div className={`collectionProductCard`}>
                        <NewCard
                          data={stateObj.selectedPack.tokenUri}
                          history={props.history}
                        />
                      </div>
                    </div>
                  </>
                ) : stateObj.selectedPack.tokenUri &&
                  !stateObj.shouldLoad &&
                  stateObj.selectedPack?.tokenUri?.length === 0 ? (
                  <>
                    <div className="no-data-main">No NFTs Found</div>
                  </>
                ) : (
                  <>
                    <div className="loader-box-infi loader-box">
                      <NewLoader />
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            //   </InfiniteScroll>
            <div className="no-data-main">
              <p className="no-data-text">No Data Found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="loader-box">
          <NewLoader />
        </div>
      )}
    </React.Fragment>
  );
}

const mapStateToProps = (stateObj, ownProps) => {
  return {
    metaMaskAddress: stateObj.metaMaskReducer.metaMaskAddress,

    provider: stateObj.metaMaskReducer.provider,
    contract: stateObj.metaMaskReducer.contract,
    transactionInProgress: stateObj.metaMaskReducer.transactionInProgress,
  };
};
export default injectIntl(
  connect(mapStateToProps, { setTransactionInProgress })(
    withRouter(BlindBoxOffChain)
  )
);
