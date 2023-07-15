import React, { Component } from "react";
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
// import Recaptcha from "react-google-recaptcha";

import "./BlindBoxCollection.scss";

let MarketPlaceAbi,
  MarketContractAddress = "";

let OffChainBlindBoxAbi,
  OffChainBlindBoxAddress = "";

let AstroBoyAdd,
  AstroBoyAbi = "";

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
class BlindBoxOffChain extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef(null);
    this.whitelistInterval = "";
    this.state = {
      selectedPack: "",
      loader: true,
      tab: "my_collection",
      // tab: "gallery",
      shouldUpdate: false,
      shouldLoad: false,
      noRecord: "",
      loaderFor: "",
      selectedBlindBox: "",
      blindBoxFound: true,
      collectionFound: true,
      baseCurrency: "",
      availableChains: [],
      selectedCurrencyToTrade: "",

      nftChain: "binance",

      userIsWhiteListed: false,
      whiteListId: "",
      userBoxCount: 0,
      priceOnDollar: 0,

      rangeToBuy: "",
      selectedRangeToBuy: "",

      selectedRound: "",
    };
    this.staticMetaData = {
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
  }

  async componentWillMount() {
    this.getBoxes();
  }

  getUserWhiteListStatus = async () => {
    if (
      localStorage.getItem("connectedWith") === "paymentCard" ||
      localStorage.getItem("cryptoUserAuth")
    ) {
      try {
        let pUrl, ocBBAbi, ocBBAdd;
        for (let i = 0; i < blockChainConfig.length; i++) {
          if (blockChainConfig[i].key === this.state.nftChain) {
            ocBBAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
            ocBBAdd = blockChainConfig[i].offChainBlindBoxConConfig.add;
            pUrl = blockChainConfig[i].providerUrl;
          }
        }
        let web3 = new Web3(pUrl);
        let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
        let userAddress, conId;
        if (
          PackContract.methods.isUserWhiteListed &&
          this.state.selectedRound
        ) {
          if (localStorage.getItem("cryptoUserAuth")) {
            userAddress = this.props.metaMaskAddress;
            conId =
              "0x6c00000000000000000000000000000000000000000000000000000000000000";
          }

          let res = await PackContract.methods
            .isUserWhiteListed(this.state.selectedRound.roundId, userAddress)
            .call();
          console.log("res for white list", res);
          // if (networkType === "mainnet" && res !== undefined && res === true) {
          //   this.setState({
          //     userIsWhiteListed: true,
          //     whiteListId: conId,
          //   });
          // } else if (networkType === "mainnet") {
          //   this.setState({
          //     userIsWhiteListed: false,
          //     whiteListId: conId,
          //   });
          // }
          if (res !== undefined && res === true) {
            this.setState({
              userIsWhiteListed: true,
              whiteListId: conId,
            });
          }
        }
        // if (networkType === "testnet") {
        //   this.setState({
        //     userIsWhiteListed: true,
        //     // whiteListId: conId,
        //     whiteListId:
        //       "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   });
        // } else if (networkType === "testnet") {
        //   this.setState({
        //     userIsWhiteListed: false,
        //     // whiteListId: conId,
        //     whiteListId:
        //       "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   });
        // }
      } catch (error) {
        console.error(error);
      }
    }
  };

  getUserRemainingNFT = async () => {
    const selectedNFTChain = this.state.nftChain;
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

    if (userAddress && this.state.selectedRound?.roundId) {
      let res = await PackContract.methods
        .getUserBoxCount(this.state.selectedRound?.roundId, userAddress)
        .call({ from: userAddress });

      if (res !== undefined) {
        let diff =
          parseInt(this.state.selectedRound.perUserLimit) - parseInt(res);
        let arr = [];
        for (let i = 1; i <= diff; i++) arr.push(i);
        // console.log(arr);
        this.setState({ userBoxCount: parseInt(res), rangeToBuy: arr });
      }
    }
  };

  genericOwnedNFT = async (chain, userAddress) => {
    const selectedNFTChain = chain;
    let pUrl, ocBBAbi, ocBBAdd;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === selectedNFTChain) {
        //   ocBBAbi = blockChainConfig[i].astroBoyConConfig.abi;
        //   ocBBAdd = blockChainConfig[i].astroBoyConConfig.add;
        ocBBAbi = blockChainConfig[i].offChainBlindBoxConConfig.abi;
        ocBBAdd = blockChainConfig[i].offChainBlindBoxConConfig.add;
        pUrl = blockChainConfig[i].providerUrl;
      }
    }
    let web3 = new Web3(pUrl);
    let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
    try {
      let totalSupply = await PackContract.methods.totalSupply().call();
      console.log(totalSupply, chain);
      // let res = await PackContract.methods.tokensOfOwner(userAddress).call();
      let startIndex =
      networkType === "testnet" || chain === "ethereum" ? 1 : 20001;
      let res = await PackContract.methods
        .tokensOfOwnerIn(userAddress, startIndex, totalSupply + 1)
        .call();
      console.log("res from tokensOfOwner", chain, res, ocBBAdd);
      // res = [1, 2];
      if (res !== undefined) {
        // let afterCall = [];
        // let asyncCall = [];
        // for (let i = 0; i < res.length; i++) {
        //   asyncCall.push(PackContract.methods.tokenURI(res[i]).call());
        // }
        // let afterCall = await Promise.all([...asyncCall]);
        // asyncCall = [];
        // for (let i = 0; i < afterCall.length; i++) {
        //   asyncCall.push(axios.get(afterCall[i]));
        // }
        // afterCall = await Promise.all([...asyncCall]);

        // let nftData = [];
        // for (let i = 0; i < afterCall?.length; i++) {
        //   if (afterCall[i].status === 200 && afterCall[i].data.name) {
        //     let obj = {
        //       metaData: { ...afterCall[i].data },
        //     };
        //     nftData.push({
        //       name: obj?.metaData?.name,
        //       image: obj?.metaData?.image ? obj?.metaData?.image : obj?.imageUrl,
        //       description: obj?.metaData?.description
        //         ? obj?.metaData?.description
        //         : obj?.description,
        //       type: obj?.metaData?.properties?.type
        //         ? obj?.metaData?.properties?.type
        //         : obj?.type,
        //       properties: {
        //         type: obj?.metaData?.properties?.type,
        //       },
        //       totalSupply: obj?.metaData?.totalSupply,
        //       externalLink: obj?.metaData?.externalLink,
        //       thumbnft: obj?.metaData?.thumbnft,
        //       thumbnailUrl: obj?.metaData?.thumbnft,
        //       tokenURI: obj?.returnValues?.tokenURI,
        //       nftChain: chain,
        //     });
        //   }
        // }
        let nftData = [];
        for (let i = 0; i < res?.length; i++) {
          nftData.push({ ...this.staticMetaData, nftChain: chain });
        }
        return nftData;
      }
    } catch (err) {
      return [];
    }
  };

  getOwnedNFT = async () => {
    this.setState({ shouldLoad: true });
    let selectedSeriesId, userAddress;
    if (localStorage.getItem("cryptoUserAuth")) {
      userAddress = localStorage.getItem("accounts");
      selectedSeriesId = this.getSeriesAsOfChain();
    } else {
      this.setState({ shouldLoad: false });
      this.setState({ noRecord: "noRecord" });
      this.setSelectedPack([]);
    }

    if (userAddress && selectedSeriesId?.seriesId) {
      let collectiveResponse,
        bResponse,
        eResponse,
        pResponse = [];
      bResponse = await this.genericOwnedNFT("binance", userAddress);
      eResponse = await this.genericOwnedNFT("ethereum", userAddress);
      pResponse = await this.genericOwnedNFT("polygon", userAddress);
      console.log("bResponse", bResponse, eResponse, pResponse);
      collectiveResponse = [...bResponse, ...eResponse, ...pResponse];
      console.log(collectiveResponse);
      if (collectiveResponse.length > 0) {
        this.setSelectedPack(collectiveResponse);
      } else {
        this.setState({ noRecord: "noRecord" });
        this.setSelectedPack(collectiveResponse);
      }
      this.setState({ shouldLoad: false });
    }
  };

  setSelectedPack(nftData) {
    this.setState({
      selectedPack: {
        tokenUri: nftData,
      },
    });
  }

  getSeriesAsOfChain = () => {
    let selectedSeriesId;
    for (let i = 0; i < this.state.selectedBlindBox?.seriesChain?.length; i++) {
      if (
        this.state.selectedBlindBox.seriesChain[i].hasOwnProperty(
          this.state.nftChain
        )
      ) {
        selectedSeriesId =
          this.state.selectedBlindBox.seriesChain[i][this.state.nftChain];
      }
    }

    return selectedSeriesId;
  };

  getCurrentRound = async () => {
    const selectedNFTChain = this.state.nftChain;
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
    let res = await PackContract.methods.getRoundDetails().call();
    if (res !== undefined) {
      console.log(res);
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
      let diff = parseInt(obj.perUserLimit) - parseInt(this.state.userBoxCount);
      let arr = [];
      console.log(diff);
      for (let i = 1; i <= diff; i++) arr.push(i);
      // console.log(arr);

      this.setState(
        { selectedRound: obj, rangeToBuy: arr, loader: false },
        async () => {
          this.getUserRemainingNFT();
          this.setState({
            priceOnDollar: divideNo(
              await this.calculatePrice(
                res.price,
                this.state.nftChain === "ethereum" ? 0 : 1,
                "0x0000000000000000000000000000000000000000"
              )
            ),
          });
        }
      );
    }
  };

  getBoxes = async () => {
    let url =
      networkType === "testnet"
        ? `https://testapi.xanalia.com/blindBox/view-blind-series-info?collectionAddress=${this.props.match.params.collId}&frontend=true`
        : `https://api.xanalia.com/blindBox/view-blind-series-info?collectionAddress=${this.props.match.params.collId}&frontend=true`;
    let res = await axios.get(url);
    if (res.data.data) {
      let bb = res.data.data?.filter(
        (b) => b._id === this.props.match.params.blindBoxId
      );
      this.setState(
        {
          selectedBlindBox: bb ? bb[0] : [],
          shouldLoad: false,
          shouldUpdate: true,
        },
        () => {
          this.getCurrentRound();

          let index = "";
          let availableChains = [];
          for (
            let i = 0;
            i < this.state.selectedBlindBox.seriesChain.length;
            i++
          ) {
            if (
              this.state.selectedBlindBox.seriesChain[i][this.state.nftChain]
            ) {
              index = i;
            }
            if (
              this.state.selectedBlindBox.seriesChain[i].hasOwnProperty(
                "polygon"
              )
            ) {
              availableChains.push("polygon");
            } else if (
              this.state.selectedBlindBox.seriesChain[i]?.hasOwnProperty(
                "ethereum"
              )
            ) {
              availableChains.push("ethereum");
            } else if (
              this.state.selectedBlindBox.seriesChain[i].hasOwnProperty(
                "binance"
              )
            ) {
              availableChains.push("binance");
            }
          }

          // let baseCurrencyBB =
          //   index !== "" &&
          //   this.state.selectedBlindBox.seriesChain[index][this.state.nftChain]
          //     .baseCurrency;
          let baseCurrencyBB =
            this.state.nftChain === "ethereum"
              ? 1
              : this.state.nftChain === "binance"
              ? 2
              : this.state.nftChain === "polygon"
              ? 3
              : "";
          let baseCurrency = basePriceTokens.filter(
            (token) =>
              token.chain === this.state.nftChain &&
              token.order === baseCurrencyBB
          );
          let chainCurrency = basePriceTokens.filter(
            (token) =>
              token.chain === this.state.nftChain && token.chainCurrency
          );
          this.setState({
            baseCurrency: baseCurrency[0],
            availableChains: availableChains.sort(),
            selectedCurrencyToTrade: chainCurrency[0],
          });
        }
      );
    }
  };

  componentDidMount() {
    this.whitelistInterval = setInterval(() => {
      this.getUserWhiteListStatus();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.whitelistInterval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.metaMaskAddress !== prevProps.metaMaskAddress &&
      this.props.metaMaskAddress
    ) {
      this.getUserWhiteListStatus();
      // this.getOwnedNFT();
    }

    let userConnected = localStorage && localStorage.getItem("userConnected");
    if (
      this.props.metaMaskAddress &&
      this.props.metaMaskAddress !== prevProps.metaMaskAddress &&
      userConnected
    ) {
      this.getUserRemainingNFT();
    }

    if (
      this.state.selectedBlindBox &&
      prevState.selectedBlindBox !== this.state.selectedBlindBox
    ) {
      this.getUserWhiteListStatus();
      this.getOwnedNFT();
    }

    if (this.state.selectedRound && prevState.selectedRound === "") {
      this.getUserWhiteListStatus();
    }

    if (this.state.selectedBlindBox) {
      const selectedNFTChain = this.state.nftChain;
      for (let i = 0; i < blockChainConfig.length; i++) {
        if (blockChainConfig[i].key === selectedNFTChain) {
          MarketPlaceAbi = blockChainConfig[i].marketConConfig.abi;
          MarketContractAddress = blockChainConfig[i].marketConConfig.add;

          OffChainBlindBoxAbi =
            blockChainConfig[i].offChainBlindBoxConConfig.abi;
          OffChainBlindBoxAddress =
            blockChainConfig[i].offChainBlindBoxConConfig.add;

          AstroBoyAbi = blockChainConfig[i].astroBoyConConfig.abi;
          AstroBoyAdd = blockChainConfig[i].astroBoyConConfig.add;

          ApproveAbi = blockChainConfig[i].marketApproveConConfig.abi;
          providerUrl = blockChainConfig[i].providerUrl;
        }
      }
    }

    if (this.state.shouldUpdate) {
      // this.setState({ shouldUpdate: false });
    }
  }

  showConnectPopUp = () => {
    document.getElementById("connectWallet")?.click();
  };

  handleApprove() {
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      let appprovalValue =
        "115792089237316195423570985008687907853269984665640564039457";
      let web3 = new Web3(this.props.provider);
      web3.eth
        .getAccounts()
        .then((acc) => {
          let approvalContract = new web3.eth.Contract(
            ApproveAbi,
            this.state.selectedCurrencyToTrade.approvalAdd
          );
          approvalContract.methods
            .approve(
              OffChainBlindBoxAddress,
              web3.utils.toWei(appprovalValue, "ether")
            )
            .send({ from: acc[0] })
            .then((res) => {
              this.handleApproveForAll();
            })
            .catch((err) => {
              this.props.setTransactionInProgress(false);
              this.setState({ loaderFor: "" });
            });
        })
        .catch((err) => {
          this.props.setTransactionInProgress(false);
          this.setState({ loaderFor: "" });
        });
    }
  }

  handleApproveForAll() {
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      let web3 = new Web3(this.props.provider);
      let PackContract = new web3.eth.Contract(
        OffChainBlindBoxAbi,
        OffChainBlindBoxAddress
      );
      let approvalContract = new web3.eth.Contract(
        ApproveAbi,
        this.state.selectedCurrencyToTrade.approvalAdd
      );
      web3.eth.getAccounts().then((acc) => {
        this.handleBuyCall(PackContract, approvalContract, acc);
      });
    }
  }

  async calculatePrice(price, tradeCurr, owner) {
    let collectionAddress = OffChainBlindBoxAddress;
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );

    let res = await MarketPlaceContract.methods
      .calculatePrice(
        price,
        this.state.baseCurrency.order,
        tradeCurr,
        this.state.selectedRound.roundId,
        owner,
        collectionAddress
      )
      .call();
    if (res) return res;
    else return "";
  }

  async handleBuyCall(PackContract, approvalContract, acc) {
    let decimals = await approvalContract.methods.decimals().call();
    let w = new Web3(providerUrl);
    approvalContract.methods.balanceOf(acc[0]).call(async (err, res) => {
      let ownerAdd =
        this.state.selectedBlindBox.collectionAddr[this.state.nftChain];
      let convertedCurrency = await this.calculatePrice(
        w.utils.toWei(
          this.state.selectedRound.priceOnChain.toString(),
          "ether"
        ),
        this.state.selectedCurrencyToTrade.order,
        ownerAdd
      );
      if (!err) {
        if (
          parseInt(res) / Math.pow(10, parseInt(decimals)) === 0 ||
          parseInt(res) / Math.pow(10, parseInt(decimals)) <
            parseInt(divideNo(convertedCurrency))
        ) {
          this.setState({ loaderFor: "" });
          this.props.setTransactionInProgress(false);
          toast.info(this.props.intl.formatMessage({ id: "nobaltoproceed" }), {
            position: "bottom-right",
            autoClose: 3000,
            progress: undefined,
            toastId: "nobaltoproceed-1",
          });
        } else {
          let selectedSeriesId = this.getSeriesAsOfChain();
          PackContract.methods
            .buyBox(
              selectedSeriesId.seriesId,
              false,
              this.state.selectedCurrencyToTrade.order,
              this.state.selectedBlindBox.collectionAddr[this.state.nftChain],
              "",
              this.state.whiteListId
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
              this.props.setTransactionInProgress(false);
              this.setState({ loaderFor: "" });
              // let temptokenUri = [...this.state.selectedPack.tokenUri];
              // this.setState({
              //   loaderFor: "",
              //   selectedPack: {
              //     tokenUri: [
              //       ...temptokenUri,
              //       { ...this.staticMetaData, nftChain: this.state.nftChain },
              //     ],
              //   },
              // });
              this.getBoxes();
            })
            .catch((err) => {
              this.props.setTransactionInProgress(false);
              this.setState({ loaderFor: "" });
            });
        }
      } else {
        this.setState({ loaderFor: "" });
        this.props.setTransactionInProgress(false);
      }
    });
  }

  async buyNFTBnb(MarketPlaceContract, acc) {
    let web3 = new Web3(this.props.provider);

    let ownerAdd = OffChainBlindBoxAddress;

    let finalPrice =
      this.state.selectedRound.priceOnChain * this.state.selectedRangeToBuy;

    console.log(
      this.state.selectedRangeToBuy,
      this.state.selectedRound.priceOnChain,
      this.state.selectedRangeToBuy * this.state.selectedRound.priceOnChain
    );

    let res = divideNo(
      await this.calculatePrice(
        web3.utils.toWei(finalPrice.toString(), "ether"),
        this.state.selectedCurrencyToTrade.order,
        ownerAdd
      )
    );

    console.log("res after calculate price", res);
    let addedFivePercent = res;
    if (
      !this.state.baseCurrency.chainCurrency &&
      this.state.selectedCurrencyToTrade.chainCurrency
    ) {
      let percetile = (parseFloat(res) / 100) * 5;
      addedFivePercent = (parseFloat(res) + parseFloat(percetile)).toFixed(18);
    }

    let balance = await web3.eth.getBalance(acc[0]);
    if (parseFloat(balance) < parseFloat(addedFivePercent)) {
      this.setState({ loaderFor: "" });
      this.props.setTransactionInProgress(false);
      toast.info(this.props.intl.formatMessage({ id: "nobaltoproceed" }), {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "nobaltoproceed-1",
      });
      return;
    }

    MarketPlaceContract.methods
      .buyBox(this.state.selectedRound.roundId, this.state.selectedRangeToBuy)
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
        this.props.setTransactionInProgress(false);
        this.setState({ loaderFor: "" });
        // let temptokenUri = [...this.state.selectedPack.tokenUri];
        // this.setState({
        //   loaderFor: "",
        //   selectedPack: {
        //     tokenUri: [
        //       ...temptokenUri,
        //       { ...this.staticMetaData, nftChain: this.state.nftChain },
        //     ],
        //   },
        // });
        this.getBoxes();
      })
      .catch((err) => {
        this.props.setTransactionInProgress(false);
        this.setState({ loaderFor: "" });
      });
  }

  async buyNFTItem() {
    const connectedWithTo = localStorage.getItem("connectedWith");

    if (!this.state.availableChains.toString().includes(this.state.nftChain)) {
      toast.info(<FormattedMessage id="SelectNtwkchainmsg" />, {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "SelectNtwkchainmsg-1",
      });
      return;
    }

    if (
      connectedWithTo !== "paymentCard" &&
      !this.state.selectedBlindBox.cryptoAllowed[this.state.nftChain]
    ) {
      toast.info(<FormattedMessage id="notallowtopen" />, {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "notallowtopen-1",
      });
      return;
    }

    if (connectedWithTo) {
      // if (!this.state.selectedCurrencyToTrade) {
      //   toast.info(<FormattedMessage id="selectcurrencymsg" />, {
      //     position: "bottom-right",
      //     autoClose: 3000,
      //     progress: undefined,
      //     toastId: "selectcurrencymsg-1",
      //   });
      //   return;
      // }

      if (!this.state.selectedRangeToBuy) {
        toast.info(<FormattedMessage id="selectcurrencymsg" />, {
          position: "bottom-right",
          autoClose: 3000,
          progress: undefined,
          toastId: "selectcurrencymsg-1",
        });
        return;
      }

      let web3 = new Web3(this.props.provider);
      if (this.props.transactionInProgress) return;

      if (
        checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
      ) {
        let availability = await checkAvailabilityOnChain(
          this.state.nftChain,
          this?.props?.intl?.formatMessage,
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
            this.setState({ loaderFor: "Buy" });
            let balance = await web3.eth.getBalance(acc[0]);
            if (parseFloat(balance) === 0) {
              this.setState({ loaderFor: "" });
              this.props.setTransactionInProgress(false);
              toast.info(
                this.props.intl.formatMessage({ id: "nobaltoproceed" }),
                {
                  position: "bottom-right",
                  autoClose: 3000,
                  progress: undefined,
                  toastId: "nobaltoproceed-1",
                }
              );
              return;
            }
            this.props.setTransactionInProgress(true);
            if (this.state.selectedCurrencyToTrade.approvalRequired) {
              let approvalContract = new web3.eth.Contract(
                ApproveAbi,
                this.state.selectedCurrencyToTrade.approvalAdd
              );

              approvalContract.methods
                .allowance(acc[0], OffChainBlindBoxAddress)
                .call((err, res) => {
                  this.props.setTransactionInProgress(true);
                  if (parseInt(res) / Math.pow(10, 18) <= 0) {
                    this.handleApprove();
                  } else {
                    this.handleApproveForAll();
                  }
                });
            } else {
              let PackContract = new web3.eth.Contract(
                OffChainBlindBoxAbi,
                OffChainBlindBoxAddress
              );
              this.buyNFTBnb(PackContract, acc);
            }
          })
          .catch((err) => {
            this.props.setTransactionInProgress(false);
            this.setState({ loaderFor: "" });
          });
      }
    }
  }

  handleChainChange = (type) => {
    if (this.state.nftChain !== type) {
      this.setState(
        {
          nftChain: type,
          tab: "my_collection",
          shouldUpdate: true,
          shouldLoad: true,
          selectedCurrencyToTrade: "",
        },
        () => {
          this.setState({ loader: true });
          this.getBoxes();
        }
      );
    }
  };

  handleTimeOut = () => {
    this.setState(
      {
        shouldUpdate: true,
        shouldLoad: true,
      },
      () => {
        this.setState({ loader: true });
        this.getBoxes();
      }
    );
  };

  handleVideoMute = () => {
    this.myRef.current.muted = !this.myRef.current.muted;
  };

  handleDepositeAmountChange = (evt) => {
    const re = /^[0-9\b]+$/;
    if (re.test(evt.target.value) || evt.target.value === "")
      this.setState({ selectedRangeToBuy: evt.target.value === "" ? "" : parseInt(evt.target.value)    });
  };

  // onSubmit() {
  //   if ( '' == this.state.value ) {
  //     alert( 'Validation failed! Input cannot be empty.' );
  //     this.recaptcha.reset();
  //   } else {
  //     this.recaptcha.execute();
  //   }
  // }
  // onResolved() {
  //   this.buyNFTItem();
  // }

  // onChange(value) {
  //   console.log("Captcha value:", value);
  // }

  render() {
    let intl;
    if (this.props && this.props.intl) {
      intl = this.props.intl;
    }

    return (
      <React.Fragment>
        {!this.state.loader ? (
          <div className="collectionPageUi" id="home-page">
            {this.state.blindBoxFound && this.state.collectionFound ? (
              <>
                <div className="collectionUiBody">
                  <div className="collectionBanner">
                    <img
                      className="collectionBannerImg"
                      src="https://ik.imagekit.io/xanalia/Images/AstroyboyBanner.jpg"
                      alt="bannerimage"
                    />
                  </div>
                  <Card className="collectionProfileCard">
                    <Card.Img
                      variant="top"
                      src="https://ik.imagekit.io/xanalia/CollectionMainData/AstroboyIcon.png?tr=w-113,tr=h-113"
                    />
                    <Card.Body>
                      <Card.Title>Astroboy : NFTDuel Genesis</Card.Title>
                      <div className="networkButtonsGrup">
                        {this.state.availableChains.map((item, index) => {
                          return (
                            <div key={index}>
                              <button
                                key={item}
                                onClick={() => this.handleChainChange(item)}
                                className={`networkButtonUI ${
                                  this.state.nftChain === item ? "active" : ""
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

                  {this.state.selectedBlindBox && (
                    <div className="collectionProductUI">
                      {this.state?.selectedBlindBox?.packVideo.match(
                        /\.(jpg|jpeg|png|gif)$/
                      ) ? (
                        <div className="collectionProductImg">
                          <img
                            alt=""
                            src={
                              this.state?.selectedBlindBox?.packVideo
                                ? this.state?.selectedBlindBox?.packVideo
                                : `https://ik.imagekit.io/xanalia/Images/Underground_castle_xanalia.jpg`
                            }
                            type="video/mp4"
                          />
                        </div>
                      ) : (
                        <div
                          className="collectionProductImg"
                          onClick={() => this.handleVideoMute()}
                        >
                          <video
                            autoPlay={true}
                            muted
                            loop={true}
                            ref={this.myRef}
                            playsInline
                          >
                            <source
                              src={
                                this.state?.selectedBlindBox?.packVideo
                                  ? this.state?.selectedBlindBox?.packVideo
                                  : `https://ik.imagekit.io/xanalia/Images/Underground_castle_xanalia.jpg`
                              }
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      )}
                      <div className="collectionProductDetails">
                        <h5>
                          {this.state.selectedBlindBox?.seriesURIMetaInfo?.name}
                        </h5>
                        <h2 className="">
                          {this.state.selectedRound?.priceOnChain &&
                            trimZeroFromTheEnd(
                              showActualValue(
                                this.state.selectedRound?.priceOnChain?.toString(),
                                18,
                                "string"
                              ),
                              true
                            )}

                          <span className="currencyName">
                            {this.state.baseCurrency
                              ? this.state.baseCurrency.key
                              : ""}
                            {/* $ */}
                          </span>
                          <span className="dollerValueTxt">
                            ($
                            {insertComma(
                              parseFloat(this.state.priceOnDollar)?.toFixed(2)
                            )}
                            )
                          </span>
                        </h2>
                        <div className="buttonGrupBuy">
                          {parseInt(this.state.selectedRound.startTime) *
                            1000 <=
                          new Date().getTime() ? (
                            parseInt(this.state.selectedRound.endTime) * 1000 <=
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
                            ) : this.state.selectedRound?.buyBoxCount !==
                                undefined &&
                              this.state.selectedRound?.buyBoxCount <
                                this.state.selectedRound?.maxBoxesChain ? (
                              this.props.metaMaskAddress ? (
                                parseInt(this.state.userBoxCount) <
                                  parseInt(
                                    this.state.selectedRound.perUserLimit
                                  ) ||
                                parseInt(
                                  this.state.selectedRound?.perUserLimit
                                )===0 ? (
                                  this.state.userIsWhiteListed ||
                                  !this.state.selectedRound.whiteListCheck ? (
                                    <>
                                      <Button
                                        block
                                        type="button"
                                        variant="primary"
                                        className="buypackBtn "
                                        onClick={() => this.buyNFTItem()}
                                        // onClick={() => this.onSubmit()}
                                      >
                                        {this.state.loaderFor === "Buy" ? (
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

                                      {/* <Recaptcha
                                        ref={ ref => this.recaptcha = ref }
                                        sitekey="6Le7Uq4fAAAAAF6VnBEPhnMBDEDYMiqLc3lq8H9s"
                                        onResolved={ this.onResolved } />
                                        onChange={this.onChange} */}

                                      {this.props.metaMaskAddress !== "" &&
                                      this.state.rangeToBuy !== "" ? (
                                        this.state.rangeToBuy.length > 0 ? (
                                          <div className="multiselectHead">
                                            <select
                                              className="form-control"
                                              id="exampleFormControlSelect1"
                                              onChange={
                                                this.handleDepositeAmountChange
                                              }
                                            >
                                              <option value={""}>
                                                {/* {intl.formatMessage({
                                                  id: "selectNoofToken",
                                                })} */}
                                                Select No of Tokens
                                              </option>
                                              {this.state.rangeToBuy.map(
                                                (token) => {
                                                  return (
                                                    <option
                                                      value={token}
                                                      key={token}
                                                    >
                                                      {token}
                                                    </option>
                                                  );
                                                }
                                              )}
                                            </select>
                                          </div>
                                        ) : (
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter amount"
                                            onChange={
                                              this.handleDepositeAmountChange
                                            }
                                            value={
                                              this.state.selectedRangeToBuy
                                            }
                                          />
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <FormattedMessage
                                        id={"notwhitelistuser"}
                                      />
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
                                  onClick={() => this.showConnectPopUp()}
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
                                boxInitiateTime={
                                  this.state.selectedRound.startTime * 1000
                                }
                                handleTimeOut={this.handleTimeOut.bind(this)}
                              />
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rightcollectionProductDetails">
                        <div className="mt-auto mb-0 collectionProductTabs">
                          <Tabs
                            defaultActiveKey="HowToBuy"
                            id="uncontrolled-tab-example"
                          >
                            <Tab eventKey="CreatorId" title="Creator">
                              <h3>XANA</h3>
                              <p className="creatorDescription">
                                XANA is the world-leading Metaverse
                                infrastructure adopted by major institutions and
                                global brands.
                              </p>
                            </Tab>
                            <Tab eventKey="CollectionId" title="Collection">
                              <h3>Astroboy : NFTDuel Genesis</h3>
                              <p>
                                {" "}
                                Astroboy x Japan is the GameFi NFT for NFTduel,
                                featuring the most sold Japanese comic character
                                Astroboy with Japans' regional sightseeing spots{" "}
                              </p>
                            </Tab>
                            <Tab eventKey="HowToBuy" title="How To Buy">
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
                                  Congrats your Bought NFT will be shown in
                                  owned
                                </span>
                              </p>
                            </Tab>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={`collectionNav`}>
                    <TabFilter
                      shouldLoad={this.state.shouldLoad}
                      metaMaskAddress={this.props.metaMaskAddress}
                      showFilter={true}
                    />
                  </div>
                  {!this.state.shouldLoad &&
                  !this.state.selectedPack?.tokenUri ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <img
                          style={{ width: 200, height: 200 }}
                          className="no-data-placeholder"
                          src={`${CDN_LINK}/no-data.svg?tr=orig-true`}
                          alt="no-data"
                        />
                        <FormattedMessage id={"noDataFound"} />
                      </div>
                    </>
                  ) : !this.state.shouldLoad &&
                    this.state.selectedPack?.tokenUri &&
                    this.state.selectedPack?.tokenUri?.length > 0 ? (
                    <>
                      <div className="collectionListcontainer">
                        <div className={`collectionProductCard`}>
                          <NewCard
                            data={this.state.selectedPack.tokenUri}
                            history={this.props.history}
                          />
                        </div>
                      </div>
                    </>
                  ) : this.state.selectedPack.tokenUri &&
                    !this.state.shouldLoad &&
                    this.state.selectedPack?.tokenUri?.length === 0 ? (
                    <>
                      <div className="no-data-main">
                        <img
                          className="no-data-placeholder"
                          src={`${CDN_LINK}/no-data.svg?tr=orig-true`}
                          alt="no-data"
                        />
                        <FormattedMessage id={"noDataFound"} />
                      </div>
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
                <img
                  className="no-data-placeholder"
                  src={`${CDN_LINK}/no-data.svg?tr=orig-true`}
                  alt="no-data"
                />
                <p className="no-data-text">
                  <FormattedMessage id={"noDataFound"} />
                </p>
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
}

const mapStateToProps = (state, ownProps) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,

    provider: state.metaMaskReducer.provider,
    contract: state.metaMaskReducer.contract,
    transactionInProgress: state.metaMaskReducer.transactionInProgress,
  };
};
export default injectIntl(
  connect(mapStateToProps, { setTransactionInProgress })(BlindBoxOffChain)
);
