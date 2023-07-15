/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { networkType } from "../../config/networkType";
import axios from "axios";
import TabFilter from "../../component/Tabs/Tabs";
import { blockChainConfig } from "../../config/blockChainConfig";
import { adminAccess } from "../../config/networkType";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Card, Tabs, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import checkWalletConnection from "../../utils/checkWalletConnection";
import { setTransactionInProgress } from "../../_actions/metaMaskActions";
import NewLoader from "../../component/Loader/loader";
import { divideNo } from "../../utils/divideByEighteen";
import NewCard from "../../component/Card/new-card";
import { basePriceTokens } from "../../config/availableTokens";
import CountDown from "../../component/CountDown/countDown";
import Big from "big.js";
import CheckoutModal from "./checkoutModal";
import "./BlindBoxCollection.scss";
import { checkAvailabilityOnChain } from "../../config/setupNetworkInWallet";
import { toast } from "react-toastify";
import SuccessDialog from "../../component/OrderPlaceSuccessModal/successModal";
import { withRouter } from "react-router-dom";
import Paginate from "../../component/Paginate/paginate";

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

let xanaGenesisDexAddress,
  xanaGenesisDexAbi = "";

let xanaGenesisAddress,
  xanaGenesisAbi = "";

let providerUrl = "";

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

    whiteListId: "",

    userBoxCount: 0,
  });

  const [selectedRound, setSelectedRound] = useState("");

  const [nftChain, setNftChain] = useState(
    adminAccess ? "binance" : "ethereum"
  );
  const [loader, setLoader] = useState(true);
  const [selectedBlindBox, setSelectedBlindBox] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [timeEnded, setTimeEnded] = useState(false);

  const [priceData, setPriceData] = useState("");
  const [isSaleWhiteList, setIsSaleWhiteList] = useState(false);

  const [nextCursor, setNextCursor] = useState("");
  const [cursorRecord, setCursorRecord] = useState([{ page: 1, cursor: "" }]);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);

  const setContractAddress = () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        providerUrl = blockChainConfig[i].providerUrl;
        xanaGenesisDexAbi = blockChainConfig[i].xanaGenesisDexConConfig.abi;
        xanaGenesisDexAddress = blockChainConfig[i].xanaGenesisDexConConfig.add;

        xanaGenesisAbi = blockChainConfig[i].xanaGenesisConConfig.abi;
        xanaGenesisAddress = blockChainConfig[i].xanaGenesisConConfig.add;
      }
    }
  };

  const getPrices = async (range) => {
    let web3 = new Web3(providerUrl);
    let xanaGenesisDexContract = new web3.eth.Contract(
      xanaGenesisDexAbi,
      xanaGenesisDexAddress
    );
    let collDataPrice = [];
    for (let i = 0; i < range; i++) {
      collDataPrice.push(xanaGenesisDexContract.methods._vip(i).call());
    }
    if (collDataPrice.length > 0) {
      let prices = [];
      let collDataPriceRes = await Promise.all(collDataPrice);
      for (let i = 0; i < collDataPriceRes.length; i++) {
        prices.push({
          ...collDataPriceRes[i],
          parsedPrice: web3.utils.fromWei(collDataPriceRes[i].price),
        });
      }
      return prices;
    }

    return false;
  };

  const saleWhiteList = async () => {
    let web3 = new Web3(providerUrl);
    let xanaGenesisDexContract = new web3.eth.Contract(
      xanaGenesisDexAbi,
      xanaGenesisDexAddress
    );
    let collDataPrice = await xanaGenesisDexContract.methods
      .saleWhiteList()
      .call();
    if (collDataPrice !== undefined) {
      return collDataPrice;
    }

    return undefined;
  };

  useEffect(() => {
    setContractAddress();

    getBoxes();
  }, []);

  useEffect(() => {
    if (props.metaMaskAddress && selectedRound !== "") {
      let url =
        networkType === "testnet"
          ? `https://testapi.xanalia.com/xanaGenesis/get-user-limit?walletAddr=${props.metaMaskAddress}`
          : `https://api.xanalia.com/xanaGenesis/get-user-limit?walletAddr=${props.metaMaskAddress}`;
      axios
        .get(url)
        .then(async (res) => {
          if (res.data.data && res.data.success) {
            let rangeIds = Object.keys(res.data.data).length;
            let isSaleWhiteListed = await saleWhiteList();

            console.log("isSaleWhiteListed", isSaleWhiteListed);
            if (isSaleWhiteListed) {
              rangeIds++;
            }

            let prices = await getPrices(rangeIds);
            console.log("prices", prices);
            let totalBoughtSupply = 0;
            if (prices) {
              for (let i = 0; i < prices.length; i++) {
                totalBoughtSupply += parseInt(prices[i].supply);
              }
            }
            let totalAvailableSupply = 0;
            for (const key in res.data.data) {
              totalAvailableSupply =
                totalAvailableSupply + parseInt(res.data.data[key].supply);
            }

            console.log(totalBoughtSupply, totalAvailableSupply);

            setPriceData(prices);
            setIsSaleWhiteList(isSaleWhiteListed);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [props.metaMaskAddress, selectedRound]);

  useEffect(() => {
    if (timeEnded) {
      setLoader(true);

      setContractAddress();
      getBoxes();
    }
  }, [timeEnded]);

  useEffect(() => {
    if (selectedBlindBox !== "") {
      getCurrentRound();
      setStateObj((prevState) => ({
        ...prevState,
      }));
      getOwnedNFT(nextCursor, 1);
    }
  }, [selectedBlindBox]);

  const genericOwnedNFT = async (chain, userAddress) => {
    const selectedNFTChain = chain;
    let pUrl, ocBBAbi, ocBBAdd;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === selectedNFTChain) {
        ocBBAbi = blockChainConfig[i].xanaGenesisConConfig.abi;
        ocBBAdd = blockChainConfig[i].xanaGenesisConConfig.add;
        pUrl = blockChainConfig[i].providerUrl;
      }
    }
    let web3 = new Web3(pUrl);
    let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
    try {
      let totalSupply = await PackContract.methods.totalSupply().call();
      console.log(totalSupply, chain);
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

  const genericOwnedNFTMoralis = async (
    chain,
    userAddress,
    chainType,
    cursor,
    page
  ) => {
    const selectedNFTChain = chainType;
    let ocBBAdd;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === selectedNFTChain) {
        ocBBAdd = blockChainConfig[i].xanaGenesisConConfig.add;
      }
    }
    try {
      const config = {
        headers: {
          "X-API-Key":
            "QlBAfCsTH1E9gaOBbwj81ctMPu8qOxVvWgJvV87ZcVj2U8ckVd8eXCSysZvPmCP2",
        },
      };
      const url =
        networkType === "testnet"
          ? `https://deep-index.moralis.io/api/v2/${userAddress}/nft/${ocBBAdd}?chain=${chain}%20testnet&format=decimal&${
              cursor.length > 0 ? `&cursor=${cursor}` : ""
            }`
          : `https://deep-index.moralis.io/api/v2/${userAddress}/nft/${ocBBAdd}?chain=${chain}&format=decimal${
              cursor.length > 0 ? `&cursor=${cursor}` : ""
            }`;
      let afterCall = await axios.get(url, config);

      // res = [1, 2];
      if (afterCall !== undefined) {
        // let afterCall = [];
        let nftData = [];
        for (let i = 0; i < afterCall.data.result?.length; i++) {
          if (afterCall.data.result[i]) {
            let obj = {
              metaData: { ...JSON.parse(afterCall.data.result[i].metadata) },
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
              nftChain:
                chain === "bsc"
                  ? "binance"
                  : chain === "matic"
                  ? "polygon"
                  : "ethereum",
            });
          }
        }
        // let nftData = [];
        // for (let i = 0; i < res?.length; i++) {
        //   nftData.push({ ...staticMetaData, nftChain: chain });
        // }
        setTotalCount(afterCall.data.total);
        setNextCursor(afterCall.data.cursor);
        let temp = [...cursorRecord];
        temp[page - 1] = { page, cursor };
        setCursorRecord([...temp]);
        return nftData;
      }
    } catch (err) {
      return [];
    }
  };

  const getOwnedNFT = async (cursor, page) => {
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
        bResponse = [];
      //   bResponse = await genericOwnedNFT("binance", userAddress);
      //   eResponse = await genericOwnedNFT("ethereum", userAddress);
      //   pResponse = await genericOwnedNFT("polygon", userAddress);
      let chainAbbreviation =
        nftChain === "binance"
          ? "bsc"
          : nftChain === "ethereum"
          ? "eth"
          : nftChain === "polygon"
          ? "matic"
          : "";
      bResponse = await genericOwnedNFTMoralis(
        chainAbbreviation,
        userAddress,
        nftChain,
        cursor,
        page
      );
      console.log("bResponse", bResponse);
      collectiveResponse = [...bResponse];
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
        ocBBAbi = blockChainConfig[i].xanaGenesisDexConConfig.abi;
        ocBBAdd = blockChainConfig[i].xanaGenesisDexConConfig.add;
        pUrl = blockChainConfig[i].providerUrl;
      }
    }
    let web3 = new Web3(pUrl);
    let PackContract = new web3.eth.Contract(ocBBAbi, ocBBAdd);
    let timeStamp = parseInt(new Date().getTime() / 1000);
    let res = await PackContract.methods.getSaleTime().call();
    return res;
  };

  const getCurrentRound = async () => {
    let res = await getRoundDetails(nftChain);
    console.log("getSaleTime", res);
    if (res !== undefined) {
      let obj = {
        endTime: parseInt(res._endTime) * 1000,
        startTime: parseInt(res._startTime) * 1000,
        whitelistStartTime: parseInt(res._whitelistStartTime) * 1000,
        // perUserLimit: parseInt(res.userPurchaseLimit),
        // maxBoxesChain: parseInt(res.maxSupply),
        // buyBoxCount: parseInt(res.supply),
        // roundId: parseInt(res._roundId),
        // priceOnChain: divideNo(res.price),
        whiteListCheck: res.iswhiteList,
      };
      console.log(obj);
      let diff = parseInt(obj.perUserLimit) - parseInt(stateObj.userBoxCount);
      let arr = [];
      //   console.log(diff);
      for (let i = 1; i <= diff; i++) arr.push(i);
      setSelectedRound(obj);
    }
  };

  const getBoxes = async () => {
    let url =
      networkType === "testnet"
        ? `https://testapi.xanalia.com/xanaGenesis/get-collection?id=${props.match.params.collId}`
        : `https://api.xanalia.com/xanaGenesis/get-collection?id=${props.match.params.collId}`;
    let res = await axios.get(url);
    if (res.data.data) {
      setSelectedBlindBox(res.data.data);
      setStateObj((prevState) => ({
        ...prevState,
        shouldLoad: false,
        shouldUpdate: true,
      }));
      setLoader(false);
    }
  };

  const showConnectPopUp = () => {
    document.getElementById("connectWallet")?.click();
  };

  const handleVideoMute = () => {
    myRef.current.muted = !myRef.current.muted;
  };

  const handleTimeOut = (roundExpiration) => {
    setTimeEnded(true);
    setStateObj((prevState) => ({
      ...prevState,
      shouldUpdate: true,
      shouldLoad: true,
      userBoxCount: 0,
    }));
  };

  const handleBuyClick = async () => {
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
    }
    setModalOpen(true);
  };

  const handlePageChange = (selectedPage, movement) => {
    setPageNo(selectedPage);
    if (movement === "next") getOwnedNFT(nextCursor, selectedPage);
    else getOwnedNFT(cursorRecord[selectedPage - 1].cursor, selectedPage);
  };
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
                    <Card.Title>{selectedBlindBox.collectionName}</Card.Title>
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
                            src={
                              selectedBlindBox?.packVideo
                                ? selectedBlindBox?.packVideo
                                : `https://xanalia.s3.ap-southeast-1.amazonaws.com/collection-data/1651807206707.jpg`
                            }
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    )}
                    <div className="collectionProductDetails">
                      <h5>{selectedBlindBox.collectionName}</h5>
                      {new Date().getTime() <=
                        parseInt(selectedRound.endTime) &&
                      new Date().getTime() >=
                        parseInt(selectedRound.startTime) &&
                      new Date().getTime() >=
                        parseInt(selectedRound.whitelistStartTime) ? (
                        <>
                          <p className="ending-text">Ending After</p>
                          <CountDown
                            boxInitiateTime={selectedRound.endTime}
                            handleTimeOut={handleTimeOut}
                            roundExpiration={true}
                          />
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="buttonGrupBuy">
                        {selectedRound ? (
                          parseInt(selectedRound.startTime) <=
                          new Date().getTime() ? (
                            parseInt(selectedRound.endTime) <=
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
                                {/* )} */}
                              </>
                            ) : props.metaMaskAddress ? (
                              <>
                                <Button
                                  block
                                  type="button"
                                  variant="primary"
                                  className="buypackBtn "
                                  onClick={handleBuyClick}
                                >
                                  Buy
                                </Button>
                              </>
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
                            <>
                              <CountDown
                                boxInitiateTime={selectedRound.startTime}
                                handleTimeOut={handleTimeOut}
                              />
                            </>
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      {new Date().getTime() >=
                        parseInt(selectedRound.startTime) &&
                      new Date().getTime() <=
                        parseInt(selectedRound.whitelistStartTime) &&
                      new Date().getTime() <=
                        parseInt(selectedRound.endTime) ? (
                        <>
                          <span style={{ color: "white" }}>
                            WhiteList Sale Starting In
                          </span>
                          <CountDown
                            boxInitiateTime={selectedRound.whitelistStartTime}
                            handleTimeOut={handleTimeOut}
                            roundExpiration={true}
                          />
                          <br />
                        </>
                      ) : (
                        <></>
                      )}

                      <Button
                        block
                        type="button"
                        variant="primary"
                        className="buypackBtn "
                        onClick={handleBuyClick}
                      >
                        Buy
                      </Button>
                    </div>

                    <div className="rightcollectionProductDetails">
                      <div className="mt-auto mb-0 collectionProductTabs">
                        <Tabs
                          defaultActiveKey="CollectionId"
                          id="uncontrolled-tab-example"
                        >
                          <Tab eventKey="CreatorId" title="Creator">
                            <h3>{selectedBlindBox.creatorName}</h3>
                            <p className="creatorDescription">
                              {selectedBlindBox.creatorDesc}
                            </p>
                          </Tab>
                          <Tab eventKey="CollectionId" title="Collection">
                            <h3>{selectedBlindBox.collectionName}</h3>
                            <p>{selectedBlindBox.collectionDesc}</p>
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
                    <Paginate
                      style={{ borderRadius: "none !important" }}
                      className="pagination-bar"
                      totalCount={totalCount}
                      pageSize={100}
                      onPageChange={handlePageChange}
                      page={pageNo}
                    />
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

      {modalOpen && (
        <CheckoutModal
          setModalOpen={setModalOpen}
          selectedRound={selectedRound}
          priceData={priceData}
          isSaleWhiteList={isSaleWhiteList}
          setOpenSuccessModal={setOpenSuccessModal}
          collId={props.match.params.collId}
        />
      )}

      {openSuccessModal && (
        <SuccessDialog hideSuccessModal={setOpenSuccessModal} />
      )}
    </React.Fragment>
  );
}

const mapStateToProps = (stateObj, ownProps) => {
  return {
    metaMaskAddress: stateObj.metaMaskReducer.metaMaskAddress,
    provider: stateObj.metaMaskReducer.provider,
    contract: stateObj.metaMaskReducer.contract,
  };
};
export default injectIntl(
  connect(mapStateToProps, { setTransactionInProgress })(
    withRouter(BlindBoxOffChain)
  )
);
