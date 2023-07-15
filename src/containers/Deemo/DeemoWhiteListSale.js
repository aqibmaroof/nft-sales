/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { networkType, adminAccess } from "../../config/networkType";
import axios from "axios";
import TabFilter from "../../component/Tabs/Tabs";
import { blockChainConfig } from "../../config/blockChainConfig";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Card, Tabs, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import checkWalletConnection from "../../utils/checkWalletConnection";
import { setTransactionInProgress } from "../../_actions/metaMaskActions";

import NewLoader from "../../component/Loader/loader";
import NewCard from "../../component/Card/new-card";
import CountDown from "../../component/CountDown/countDown";
import CheckoutModal from "./checkoutModalDeemo";
import "./deemoCollection.scss";
import { checkAvailabilityOnChain } from "../../config/setupNetworkInWallet";
import { toast } from "react-toastify";
import SuccessDialog from "../../component/OrderPlaceSuccessModal/successModal";
import { withRouter } from "react-router-dom";
import Paginate from "../../component/Paginate/paginate";
import {  mainTypes } from "./deemoConfig";
import {useVerifyNetwork} from '../../hooks/useVerifyNetwork'

const Web3 = require("web3");

let ongoingSale = false;
let saleToStart = false;


let DeemoAddress,
  DeemoAbi = "";

let providerUrl = "";

function BlindBoxOffChain(props) {
  const myRef = useRef(null);

  const [stateObj, setStateObj] = useState({
    selectedPack: "",
    shouldUpdate: false,
    shouldLoad: false,
    noRecord: "",
    blindBoxFound: true,

    whiteListId: "",

    userBoxCount: 0,
  });

  const [selectedRound, setSelectedRound] = useState({
    startTime: 1663835933,
    endTime: 1695409200000,
    whitelistStartTime: 1663835933,
  });

  const [nftChain] = useState("ethereum");
  const [loader, setLoader] = useState(true);
  const [selectedBlindBox, setSelectedBlindBox] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  
  const [msg1, setMsg1] = useState("");
  const [msg2, setMsg2] = useState("");
  const [msg3, setMsg3] = useState("");
  const [title, setTitle] = useState("");




  const [timeEnded, setTimeEnded] = useState(false);

  const [nextCursor, setNextCursor] = useState("");
  const [cursorRecord, setCursorRecord] = useState([{ page: 1, cursor: "" }]);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);

  const [saleStatus, setSaleStatus] = useState("");
  const [isPublicSaleOpen, setIsPublicSaleOpen] = useState(false);

  const [isSoldOut, setIsSoldOut] = useState(false);

  const [currentSaleObj, setCurrentSaleObj] = useState("");

  const [categoryTypesData, setCategoryTypesData] = useState([]);

  useVerifyNetwork(selectedBlindBox)

  const setContractAddress = () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        providerUrl = blockChainConfig[i].providerUrl;
        DeemoAbi = blockChainConfig[i].deemoConConfig.abi;
        DeemoAddress = blockChainConfig[i].deemoConConfig.add;
      }
    }
  };

  const getWhitelistCategoryData = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(DeemoAbi, DeemoAddress);
    let userRange = [];
    for (let i = 0; i < mainTypes.length; i++) {
      userRange.push(
        landContract.methods.getSaleDetails(mainTypes[i].id).call()
      );
    }
    return Promise.all(userRange);
  };

  const setCurrentRunningSale = async () => {
    let data = await getWhitelistCategoryData();
    console.log(data);
    let saleToStartObj = {};
    let ongoingSaleObj = {};

    for (let i = 1; i < mainTypes.length; i++) {
      if (
        parseInt(data[i]._startTime) * 1000 > new Date().getTime() &&
        parseInt(data[i]._endTime) * 1000 > new Date().getTime()
      ) {
        saleToStart = true;
        saleToStartObj = {
          ...mainTypes[i],
          startTime: parseInt(data[i]._startTime) * 1000,
          endTime: parseInt(data[i]._endTime) * 1000,

        };
        if (
          saleToStartObj.name === "Whitelist"
        ) {
          saleToStartObj.name = "Whitelist Sale & Claim NFTs";
        } else {
        }
        break;
      }
    }

    for (let i = 1; i < mainTypes.length; i++) {
      if (
        parseInt(data[i]._startTime) * 1000 < new Date().getTime() &&
        parseInt(data[i]._endTime) * 1000 > new Date().getTime()
      ) {
        ongoingSale = true;
        ongoingSaleObj = {
          ...mainTypes[i],
          startTime: parseInt(data[i]._startTime) * 1000,
          endTime: parseInt(data[i]._endTime) * 1000,
        };
        if (
          ongoingSaleObj.name === "Whitelist"
        ) {
          ongoingSaleObj.name = "Whitelist Sale & Claim NFTs";
        } else {
        }
        break;
      }
    }

    console.log("current sale going to start", saleToStart);
    console.log("on going sale", ongoingSale);
    console.log("on going sale obj", ongoingSaleObj);
    if (ongoingSale) {
      setCurrentSaleObj(ongoingSaleObj);
    } else if (saleToStart) {
      setCurrentSaleObj(saleToStartObj);
    }

    setCategoryTypesData(data);
  };

  useEffect(() => {
    setContractAddress();
    setCurrentRunningSale();
    getMaxMint();
    getBoxes();
  }, []);

  useEffect(() => {
    if (categoryTypesData.length > 0) {
      getStatus();
    }
  }, [categoryTypesData]);

  useEffect(() => {
    if (timeEnded) {
      setLoader(true);

      setContractAddress();
      getBoxes();
    }
  }, [timeEnded]);

  useEffect(() => {
    if (selectedBlindBox !== "") {
      setStateObj((prevState) => ({
        ...prevState,
      }));
      getOwnedNFT(nextCursor, 1);
    }
  }, [selectedBlindBox]);

  const getStatus = async () => {
    ongoingSale = false
    saleToStart = false
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(DeemoAbi, DeemoAddress);
    let collDataPrice = await landContract.methods.status().call();
    console.log(collDataPrice);
    setSaleStatus(collDataPrice);
    if (collDataPrice !== undefined) {
      if (collDataPrice === "0" || collDataPrice === "1") {
      } else if (collDataPrice === "2") {
        setIsPublicSaleOpen(true);
        let saleToStartObj = {};
        let ongoingSaleObj = {};
        if (
          parseInt(categoryTypesData[0]._startTime) * 1000 >
            new Date().getTime() &&
          parseInt(categoryTypesData[0]._endTime) * 1000 > new Date().getTime()
        ) {
          saleToStart = true;
          saleToStartObj = {
            ...mainTypes[0],
            startTime: parseInt(categoryTypesData[0]._startTime) * 1000,
            endTime: parseInt(categoryTypesData[0]._endTime) * 1000,
            name: "Public Sale & Claim NFTs",
          };
        }

        if (
          parseInt(categoryTypesData[0]._startTime) * 1000 <
            new Date().getTime() &&
          parseInt(categoryTypesData[0]._endTime) * 1000 > new Date().getTime()
        ) {
          ongoingSale = true;
          ongoingSaleObj = {
            ...mainTypes[0],
            startTime: parseInt(categoryTypesData[0]._startTime) * 1000,
            endTime: parseInt(categoryTypesData[0]._endTime) * 1000,
            name: "Public Sale & Claim NFTs",
          };
        }
        if (ongoingSale) {
          setCurrentSaleObj(ongoingSaleObj);
        } else if (saleToStart) {
          setCurrentSaleObj(saleToStartObj);
        }
      }
    }
  };

  const getMaxMint = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(DeemoAbi, DeemoAddress);
    let maxMint = await landContract.methods.getMaxSupply().call();
    let totalSupply = await landContract.methods.totalSupply().call();
    let reservedSupply = await landContract.methods.mintedPerRarity(4).call();
    console.log(maxMint, totalSupply, reservedSupply);
    if (maxMint && totalSupply) {
      if (parseInt(maxMint) <= parseInt(totalSupply)) {
        setIsSoldOut(true);
      }
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
        ocBBAdd = blockChainConfig[i].deemoConConfig.add;
      }
    }
    try {
      const config = {
        headers: {
          "X-API-Key":
            "QlBAfCsTH1E9gaOBbwj81ctMPu8qOxVvWgJvV87ZcVj2U8ckVd8eXCSysZvPmCP2",
        },
      };
      const nftChain  = networkType === 'testnet' ? "goerli" : "eth"
      const url =
        networkType === "testnet"
          ? `https://deep-index.moralis.io/api/v2/${userAddress}/nft/${ocBBAdd}?chain=${nftChain}&format=decimal&${
              cursor.length > 0 ? `&cursor=${cursor}` : ""
            }`
          : `https://deep-index.moralis.io/api/v2/${userAddress}/nft/${ocBBAdd}?chain=${nftChain}&format=decimal${
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
              nftChain: "ethereum",
            });
          }
        }

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

      let chainAbbreviation ="eth";
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

  const getBoxes = async () => {
    let networkName = "";
    if (nftChain === "ethereum") {
      networkName = "Ethereum";
    } else if (nftChain === "binance") {
      networkName = "BSC";
    }
    let url =
      networkType === "testnet"
        ? `https://backend.xanalia.com/collections/collectionId?networkName=${networkName}&contractAddress=${props.match.params.collId}`
        : `https://prod-backend.xanalia.com/collections/collectionId?networkName=${networkName}&contractAddress=${props.match.params.collId}`;

    try {
      let res = await axios.get(url);
      if (res.data) {
        setSelectedBlindBox(res.data);
        setStateObj((prevState) => ({
          ...prevState,
          shouldLoad: false,
          shouldUpdate: true,
        }));
        setLoader(false);
      }
    } catch (err) {
      setStateObj((prevState) => ({ ...prevState, blindBoxFound: false }));
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
    // setTimeEnded(true);
    // setStateObj((prevState) => ({
    //   ...prevState,
    //   shouldUpdate: true,
    //   shouldLoad: true,
    //   userBoxCount: 0,
    // }));
    window.location.reload();
  };

  const handleBuyClick = async () => {
    if (checkWalletConnection(props.metaMaskAddress)) {
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
          {stateObj.blindBoxFound ? (
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
                    <Card.Title>{selectedBlindBox.name}</Card.Title>
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
                        // onClick={() => handleVideoMute()}
                      >
                        <img
                          alt=""
                          src={
                            selectedBlindBox?.packVideo
                              ? selectedBlindBox?.packVideo
                              : `https://ik.imagekit.io/xanalia/CollectionMainData/deemo_pack.jpg`
                          }
                        />
                        {/* <video
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
                                : `https://ik.imagekit.io/xanalia/nftData/packVideo.mp4`
                            }
                            type="video/mp4"
                          />
                        </video> */}
                      </div>
                    )}
                    <div className="collectionProductDetails">
                      <h5>{selectedBlindBox.name}</h5>
                      {/* {new Date().getTime() <=
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
                      )} */}
                      <div className="buttonGrupBuy">
                        {isSoldOut ? (
                          <>
                            <Button className="buypackBtn ">Sold Out</Button>
                          </>
                        ) : saleStatus === "0" || !currentSaleObj ? (
                          <Button className="buypackBtn ">Sale Ended</Button>
                        ) : parseInt(currentSaleObj.startTime) <=
                          new Date().getTime() ? (
                          parseInt(currentSaleObj.endTime) <=
                          new Date().getTime() ? (
                            <>
                              <Button className="buypackBtn">
                                <FormattedMessage id="timeExpired"></FormattedMessage>
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="padding-t1">
                                <div className="text-white">
                                  Time Left to End the {currentSaleObj.name}{" "}
                                </div>
                                <div className="padding-b1">
                                  <CountDown
                                    boxInitiateTime={currentSaleObj.endTime}
                                    handleTimeOut={handleTimeOut}
                                  />
                                </div>
                                <div>
                                  {props.metaMaskAddress ? (
                                    <Button
                                      className="buypackBtn "
                                      onClick={handleBuyClick}
                                    >
                                      Buy
                                    </Button>
                                  ) : (
                                    <Button
                                      className="buypackBtn"
                                      onClick={() => showConnectPopUp()}
                                    >
                                      <FormattedMessage id="buy"></FormattedMessage>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </>
                          )
                        ) : (
                          <div>
                            <div className="text-white">
                              Time Left to Start the {currentSaleObj.name}
                            </div>
                            <div>
                              <CountDown
                                boxInitiateTime={currentSaleObj.startTime}
                                handleTimeOut={handleTimeOut}
                              />
                            </div>
                            <div>
                              {props.metaMaskAddress ? (
                                <Button
                                  className="buypackBtn "
                                  onClick={handleBuyClick}
                                >
                                  Buy
                                </Button>
                              ) : (
                                <Button
                                  className="buypackBtn"
                                  onClick={() => showConnectPopUp()}
                                >
                                  <FormattedMessage id="buy"></FormattedMessage>
                                </Button>
                              )}
                            </div>
                          </div>
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
                            <h3>
                              {selectedBlindBox?.user.name
                                ? selectedBlindBox?.user.name
                                : ""}
                            </h3>
                            <p className="creatorDescription">
                              {selectedBlindBox?.user.description
                                ? selectedBlindBox?.user.description
                                : ""}
                            </p>
                          </Tab>
                          <Tab eventKey="CollectionId" title="Collection">
                            <h3>{selectedBlindBox.name}</h3>
                            <p>{selectedBlindBox.description}</p>
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
          isPublicSaleOpen={isPublicSaleOpen}
          setOpenSuccessModal={setOpenSuccessModal}
          collId={props.match.params.collId}
          setMsg1={setMsg1}
          setMsg2={setMsg2}
          setMsg3={setMsg3}
          setTitle={setTitle}
          nftChain={nftChain}
        />
      )}

      {openSuccessModal && (
        <SuccessDialog hideSuccessModal={setOpenSuccessModal} 
        msg1={msg1}
        msg2={msg2}
        msg3={msg3}
        title={title}
        />
      )}
    </React.Fragment>
  );
}

const mapStateToProps = (stateObj, ownProps) => {
  return {
    metaMaskAddress: stateObj.metaMaskReducer.metaMaskAddress,
    provider: stateObj.metaMaskReducer.provider,
  };
};
export default injectIntl(
  connect(mapStateToProps, { setTransactionInProgress })(
    withRouter(BlindBoxOffChain)
  )
);
