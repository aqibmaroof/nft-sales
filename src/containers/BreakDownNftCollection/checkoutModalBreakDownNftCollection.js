/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Big from "big.js";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Button,
  Card,
  Spinner,
  Figure,
  ListGroup,
  Modal,
  FormGroup,
  FormLabel,
  Dropdown,
  Form,
  DropdownButton,
} from "react-bootstrap";
import { connect } from "react-redux";
import "../../../src/component/OrderPlaceSuccessModal/successModal.scss";

import { setTransactionInProgress } from "../../_actions/metaMaskActions";
import NewLoader from "../../component/Loader/loader";
import { showNotitication } from "../../utils/showNotification";
import { blockChainConfig } from "../../config/blockChainConfig";
import { networkType } from "../../config/networkType";
import { mainTypes, Options } from "./BreakDownNftCollectionConfig";
import CountDown from "../../component/CountDown/countDown";
import Disclaimer from "./disclaimerModal";
import "./BreakDownNftCollection.scss";

let providerUrl = "";

let deemoAbi,
  deemoAddress = "";

const baseUrl =
  networkType === "testnet"
    ? `https://backend.xanalia.com`
    : `https://prod-backend.xanalia.com`;

const Web3 = require("web3");

function CheckoutModal(props) {
  const [loaderFor, setLoaderFor] = useState("");

  const [nftChain] = useState(props.nftChain);

  const [loadCollData, setLoadCollData] = useState(true);

  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [allowedCategories, setAllowedCategories] = useState([]);

  const [plotData, setPlotData] = useState({
    type: "",
    plotSize: "",
    units: "",
    price: "",
  });
  const [plotRates, setPlotRates] = useState({});

  const [selectedSaleTypeIndex, setSelectedSaleTypeIndex] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  const [isSoldOut, setIsSoldOut] = useState(false);

  const [limitRemains, setIsLimitRemains] = useState(false);

  const [isLimitExceedTen, setIsLimitExceedTen] = useState(false);

  useEffect(async () => {
    setContractAddress();

    if (props.metaMaskAddress) {
      let resData = await getWhitelistCategoryData();
      let user_bought = await getUserBought();

      let tempAllowedCategories = [];

      if (props.isPublicSaleOpen) {
        tempAllowedCategories.push({
          ...mainTypes[0],
          remainingLimit: "Unlimited",
          userBought: 0,
          limit: false,
          startTime: parseInt(resData[0]._startTime) * 1000,
          endTime: parseInt(resData[0]._endTime) * 1000,
        });

        if (
          parseInt(user_bought[2]) +
            parseInt(user_bought[3]) +
            parseInt(user_bought[4]) -
            parseInt(user_bought[5]) >
          0
        ) {
          tempAllowedCategories.push({
            ...mainTypes[5],
            remainingLimit: 0,
            userBought:
              parseInt(user_bought[2]) +
              parseInt(user_bought[3]) +
              parseInt(user_bought[4]) -
              parseInt(user_bought[5]),
            limit: false,
            startTime: parseInt(resData[5]._startTime) * 1000,
            endTime: parseInt(resData[5]._endTime) * 1000,
          });
        }
        setAllowedCategories(tempAllowedCategories);
        setLoadCollData(false);
      } else {
        axios
          .get(
            `${baseUrl}/blind-box/get-user-limit?address=${props.metaMaskAddress}&blindBoxId=16`
          )
          .then(async (res) => {
            console.log("user limit", res.data);
            if (res.data && res.status === 200) {
              for (let i = 1; i < mainTypes.length; i++) {
                let limitObj = res.data[mainTypes[i].id];
                let remainingLimit = limitObj?.limit - parseInt(user_bought[i]);

                if (
                  parseInt(resData[i]._endTime) * 1000 >
                  new Date().getTime()
                ) {
                  if (
                    mainTypes[i].id === 3 &&
                    parseInt(user_bought[i - 3]) +
                      parseInt(user_bought[i - 2]) +
                      parseInt(user_bought[i - 1]) -
                      parseInt(user_bought[i]) >
                      0
                  ) {
                    tempAllowedCategories.push({
                      ...mainTypes[i],
                      remainingLimit: 0,
                      userBought:
                        parseInt(user_bought[i - 3]) +
                        parseInt(user_bought[i - 2]) +
                        parseInt(user_bought[i - 1]) -
                        parseInt(user_bought[i]),
                      limit: false,
                      startTime: parseInt(resData[i]._startTime) * 1000,
                      endTime: parseInt(resData[i]._endTime) * 1000,
                    });
                  } else if (remainingLimit > 0 && mainTypes[i].id === 2) {
                    tempAllowedCategories.push({
                      ...mainTypes[i],
                      remainingLimit,
                      userBought: user_bought[i],
                      limit: true,
                      startTime: Number(resData[i]._startTime) * 1000,
                      endTime: Number(resData[i]._endTime) * 1000,
                    });
                  } else if (remainingLimit > 0 && mainTypes[i].id === 6) {
                    tempAllowedCategories.push({
                      ...mainTypes[i],
                      remainingLimit,
                      userBought: user_bought[i],
                      limit: true,
                      startTime: Number(resData[i]._startTime) * 1000,
                      endTime: Number(resData[i]._endTime) * 1000,
                    });
                  } else if (remainingLimit > 0 && mainTypes[i].id === 7) {
                    tempAllowedCategories.push({
                      ...mainTypes[i],
                      remainingLimit,
                      userBought: user_bought[i],
                      limit: true,
                      startTime: Number(resData[i]._startTime) * 1000,
                      endTime: Number(resData[i]._endTime) * 1000,
                    });
                  } else if (remainingLimit > 0 && mainTypes[i].id === 4) {
                    tempAllowedCategories.push({
                      ...mainTypes[i],
                      remainingLimit,
                      userBought: user_bought[i],
                      limit: true,
                      startTime: Number(resData[i]._startTime) * 1000,
                      endTime: Number(resData[i]._endTime) * 1000,
                    });
                  } else if (limitObj.infinity) {
                    tempAllowedCategories.push({
                      ...mainTypes[i],
                      remainingLimit: "Unlimited",
                      userBought: user_bought[i],
                      limit: false,
                      startTime: parseInt(resData[i]._startTime) * 1000,
                      endTime: parseInt(resData[i]._endTime) * 1000,
                    });
                  }
                }
              }
              setAllowedCategories(tempAllowedCategories);
              setLoadCollData(false);
            } else {
              setLoadCollData(false);
            }
          })
          .catch((err) => {
            setLoadCollData(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(plotRates).length > 0 && plotData.units !== "") {
      setCalculatingPrice(false);
      if (
        parseInt(plotData.units) * parseInt(plotRates.perBundleNfts) >
        parseInt(plotRates.total) - parseInt(plotRates.sold)
      ) {
        setIsLimitRemains(false);
        return showNotitication(
          "You cannot able to purchase multiple items beyond our Stock.",
          "info"
        );
      }
      let x = new Big(plotRates.perUnitprice.toString());
      let y = new Big(plotData.units.toString());
      let price = x.times(y).toNumber();
      setTotalPrice(price);
      setIsLimitRemains(true);
    }
  }, [plotRates]);

  useEffect(() => {
    if (plotData.units !== "") {
      getPlotRates();
    }
  }, [plotData.units]);

  useEffect(() => {
    if (!props.metaMaskAddress) {
      props.setModalOpen(false);
    }
  }, [props.metaMaskAddress]);

  const getWhitelistCategoryData = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(deemoAbi, deemoAddress);
    let userRange = [];
    for (let i = 0; i < mainTypes.length; i++) {
      userRange.push(
        landContract.methods.getSaleDetails(mainTypes[i].id).call()
      );
    }
    return Promise.all(userRange);
  };

  const getUserBought = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(deemoAbi, deemoAddress);
    let userRange = [];
    for (let i = 0; i < mainTypes.length; i++) {
      userRange.push(
        landContract.methods
          .getUserBoughtCount(props.metaMaskAddress, mainTypes[i].user_bought)
          .call()
      );
    }
    return Promise.all(userRange);
  };

  const setContractAddress = () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        providerUrl = blockChainConfig[i].providerUrl;
        deemoAbi = blockChainConfig[i].breakDownConfig.abi;
        deemoAddress = blockChainConfig[i].breakDownConfig.add;
      }
    }
  };
  const handleDataChange = (type, key, value, sIndex) => {
    let newData;
    if (sIndex === selectedSaleTypeIndex) {
      newData = { ...plotData };
    } else {
      newData = {
        units: "",
        price: "",
      };

      setPlotRates({});
      setTotalPrice(0);
    }

    const re = /^[0-9\b]+$/;
    if (key === "units") {
      if (re.test(value) || value === "") {
        newData[key] = value;
        newData.type = type.id;
        setPlotData(newData);
      }
    } else {
      newData[key] = value;
      newData.type = type.id;

      setPlotData(newData);
    }

    setSelectedSaleTypeIndex(sIndex);
  };

  const getPlotRates = async () => {
    setCalculatingPrice(true);
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(deemoAbi, deemoAddress);
    let collDataPrice = await landContract.methods.getPrice().call();
    if (collDataPrice !== undefined) {
      let maxMint = await landContract.methods.getMaxSupply().call();
      let perBundleNfts = await landContract.methods
        .perPurchaseNFTToMint()
        .call();
      let totalSupply = await landContract.methods.totalSupply().call();
      let reservedSupply = await landContract.methods.reservedNFT(10).call();
      console.log(maxMint, totalSupply, reservedSupply, perBundleNfts);
      if (maxMint && totalSupply && perBundleNfts) {
        if (
          parseInt(maxMint) <=
          parseInt(totalSupply) +
            parseInt(reservedSupply) * parseInt(perBundleNfts)
        ) {
          setIsSoldOut(true);
        } else {
          setIsSoldOut(false);
        }
      }
      setPlotRates({
        // ...collDataPrice,
        sold:
          parseInt(totalSupply) +
          parseInt(reservedSupply) * parseInt(perBundleNfts),
        total: parseInt(maxMint),
        perUnitprice: web3.utils.fromWei(collDataPrice),
        perBundleNfts,
      });
    }
  };

  const getUserProof = async () => {
    let limit = 0;
    if (allowedCategories[selectedSaleTypeIndex].limit) {
      limit =
        parseInt(plotData.units) +
        parseInt(allowedCategories[selectedSaleTypeIndex].userBought);
    }
    let proof = await axios.get(
      `${baseUrl}/blind-box/get-proof-hash?address=${props.metaMaskAddress}&limit=${limit}&type=${allowedCategories[selectedSaleTypeIndex].id}&blindBoxId=16`
    );
    return proof;
  };

  const handlePlaceOrder = async () => {
    if (props.transactionInProgress === true)
      return showNotitication("Transaction is already in Progress", "info");

    if (!plotData["units"] || plotData["units"] === "0") {
      showNotitication(`Please select some Nfts to buy`, "info");
      return;
    }

    // if (!plotData["units"] || plotData["units"] < "5") {
    //   showNotitication(`Please select miniumum 5 Nfts to buy`, "info");
    //   return;
    // }

    // if (!plotData["units"] || plotData["units"] > "50") {
    //   showNotitication(`Please select maximun 50 Nfts to buy`, "info");
    //   return;
    // }

    if (parseInt(plotData["units"]) > 50) {
      showNotitication(
        `You can able to purchase maximum of 50 Nfts in a transaction`,
        "info"
      );
      return;
    }
    if (
      allowedCategories[selectedSaleTypeIndex].remainingLimit !== "Unlimited" &&
      allowedCategories[selectedSaleTypeIndex].limit &&
      parseInt(plotData["units"]) >
        allowedCategories[selectedSaleTypeIndex].remainingLimit
    ) {
      showNotitication(`You can't buy units more than your max limit`, "error");
      return;
    }
    let web3 = new Web3(props.provider);
    web3.eth.getAccounts().then(async (acc) => {
      setLoaderFor("Buy");
      props.setTransactionInProgress(true);
      let balance = await web3.eth.getBalance(acc[0]);
      if (parseFloat(balance) < parseFloat(totalPrice)) {
        setLoaderFor("");
        props.setTransactionInProgress(false);
        showNotitication(`Insufficient Balance`, "error");
        return;
      } else {
        let user_proof = await getUserProof();
        if (user_proof.status !== 200 || user_proof.data?.hexProof === 0) {
          setLoaderFor("");
          props.setTransactionInProgress(false);
          showNotitication(`You are not whitelist to buy this.`, "error");
          return;
        }
        if (
          allowedCategories[selectedSaleTypeIndex].id === 0 ||
          allowedCategories[selectedSaleTypeIndex].id === 1
        ) {
          buyCommon(acc, user_proof.data?.hexProof, true);
        } else if (
          allowedCategories[selectedSaleTypeIndex].id === 2 ||
          allowedCategories[selectedSaleTypeIndex].id === 6 ||
          allowedCategories[selectedSaleTypeIndex].id === 7
        ) {
          preOrderAstroboyNFT(
            acc,
            user_proof.data?.hexProof,
            allowedCategories[selectedSaleTypeIndex].id
          );
        } else if (allowedCategories[selectedSaleTypeIndex]?.id === 4) {
          FreeMint(
            user_proof.data?.hexProof,
            plotData.units,
            allowedCategories[selectedSaleTypeIndex].limit
          );
        }
      }
    });
  };

  const buyCommon = (acc, user_proof, isLimit) => {
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(deemoAbi, deemoAddress);

    LandContract.methods
      .buy(
        user_proof,
        plotData.units,
        allowedCategories[selectedSaleTypeIndex].limit,
        allowedCategories[selectedSaleTypeIndex].id
      )
      .send({
        from: acc[0],
        value: web3.utils.toHex(
          web3.utils.toWei(totalPrice.toString(), "ether")
        ),
      })
      .then((res) => {
        showNotitication("Transaction got successfull", "success");
        props.setTransactionInProgress(false);
        setLoaderFor("");
        props.setModalOpen(false);
        props.setOpenSuccessModal(true);
        props.setTitle("ORDER COMPLETED");
        props.setMsg1("Congrats! Your order has been placed successfully.");
        props.setMsg2(
          "After successful verification, your NFTs will be visible in the owned tab."
        );
        props.setMsg3(
          "Note: Please wait it may take 24 hours to get reflected in owned tab"
        );
        props.checkMaxMint();
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
      });
  };

  const preOrderAstroboyNFT = (acc, user_proof, whiteList) => {
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(deemoAbi, deemoAddress);
    LandContract.methods
      .preOrder(user_proof, plotData.units, whiteList)
      .send({
        from: acc[0],
        value: web3.utils.toHex(
          web3.utils.toWei(totalPrice.toString(), "ether")
        ),
      })
      .then((res) => {
        showNotitication("Transaction got successfull", "success");
        props.setTransactionInProgress(false);
        setLoaderFor("");
        props.setModalOpen(false);
        props.setOpenSuccessModal(true);
        props.setTitle("PRE-ORDER COMPLETED");
        props.setMsg1("Congrat! Your Pre-order has been made successfully.");
        props.setMsg2("You can claim NFTs as soon as the claim is ready.");
        props.setMsg3("");
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
      });
  };
  // FreeMint
  const FreeMint = (user_proof, limit, isLimit) => {
    if (props.transactionInProgress === true)
      return showNotitication("Transaction is already in Progress", "info");
    props.setTransactionInProgress(true);
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(deemoAbi, deemoAddress);
    web3.eth.getAccounts().then(async (acc) => {
      LandContract.methods
        .freeMint(limit, isLimit, user_proof)
        .send({
          from: acc[0],
          value: 0,
        })
        .then((res) => {
          showNotitication("Transaction got successfull", "success");
          props.setTransactionInProgress(false);
          setLoaderFor("");
          props.setModalOpen(false);
          props.setOpenSuccessModal(true);
          props.setTitle("FREE MINT COMPLETED");
          props.setMsg1("Congrats! Your claim has been done successfully.");
          props.setMsg2(
            "After successful verification, your NFTs will be visible in the owned tab."
          );
          props.setMsg3(
            "Note: Please wait it may take 24 hours to get reflected in owned tab"
          );
        })
        .catch((err) => {
          props.setTransactionInProgress(false);
          setLoaderFor("");
        });
    });
  };

  const claimAstroboyNFT = () => {
    if (props.transactionInProgress === true)
      return showNotitication("Transaction is already in Progress", "info");

    props.setTransactionInProgress(true);
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(deemoAbi, deemoAddress);
    web3.eth.getAccounts().then(async (acc) => {
      setLoaderFor("Claim");
      LandContract.methods
        .claim()
        .send({
          from: acc[0],
        })
        .then((res) => {
          showNotitication("Transaction got successfull", "success");
          props.setTransactionInProgress(false);
          setLoaderFor("");
          props.setModalOpen(false);
          props.setOpenSuccessModal(true);
          props.setTitle("CLAIM COMPLETED");
          props.setMsg1("Congrats! Your claim has been done successfully.");
          props.setMsg2(
            "After successful verification, your NFTs will be visible in the owned tab."
          );
          props.setMsg3(
            "Note: Please wait it may take 24 hours to get reflected in owned tab"
          );
        })
        .catch((err) => {
          props.setTransactionInProgress(false);
          setLoaderFor("");
        });
    });
  };

  const handleTimeOut = useCallback(() => {
    setLoadCollData(true);
    setTimeout(() => {
      setLoadCollData(false);
    }, 500);
  }, []);

  return (
    <React.Fragment>
      <Modal
        size="xl"
        className="fade connect-modal purchaseNftModal checkbox-correction"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui whiteBg"
        backdropClassName="custom-backdrop"
        contentClassName="custom-content"
        centered
        show={true}
        // onHide={() => props.setModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>Checkout</Modal.Title>
          <p onClick={() => props.setModalOpen(false)} className="closeButton">
            x
          </p>
        </Modal.Header>
        <Modal.Body>
          {!loadCollData ? (
            <div className="cartProductCheckOut">
              <div className="cartProductTable">
                <div className="cartProductHeader">
                  <h5>Item</h5>
                  <h5>Qty</h5>
                </div>
                {allowedCategories.length > 0 ? (
                  allowedCategories.map((type, mainTypeIndex) => {
                    return (
                      <Figure
                        className={
                          selectedSaleTypeIndex === mainTypeIndex
                            ? "activeRow"
                            : ""
                        }
                        key={type.name}
                      >
                        <Figure.Image alt="171x180" src={type.image} />
                        <Figure.Caption>
                          <h4>
                            {type.name === "Allowlist"
                              ? type.name + " Sale"
                              : type.name === "Claim Pre-ordered NFTs"
                              ? "Pre-ordered NFTs"
                              : type.name}
                          </h4>
                          <p>{type.description}</p>
                          {type.id !== 3 ? (
                            <h6>
                              Max to Buy:
                              <span className="limit">
                                {" "}
                                {type.remainingLimit
                                  ? type.remainingLimit === "Unlimited"
                                    ? "Unlimited"
                                    : type.remainingLimit
                                  : "0"}
                              </span>
                            </h6>
                          ) : (
                            <>
                              <h6>
                                Reserved:
                                <span>
                                  {" "}
                                  {type.userBought ? type.userBought : "0"}
                                </span>
                              </h6>
                            </>
                          )}
                        </Figure.Caption>
                        {new Date().getTime() >= type.startTime ? (
                          type.endTime >= new Date().getTime() ? (
                            type.id !== 3 ? (
                              <FormGroup>
                                <div className="opt-container new-updateonclass">
                                  <FormLabel className="text-white inputLabels tr-text">
                                    No. of NFTs
                                  </FormLabel>

                                  {isLimitExceedTen ? (
                                    <input
                                      autoComplete="off"
                                      name="units"
                                      placeholder="Enter quantity"
                                      value={
                                        selectedSaleTypeIndex ===
                                          mainTypeIndex &&
                                        plotData.type === type.id
                                          ? plotData.units
                                          : ""
                                      }
                                      onChange={(e) => {
                                        handleDataChange(
                                          type,
                                          "units",
                                          e.target.value,
                                          mainTypeIndex
                                        );
                                      }}
                                    />
                                  ) : (
                                    <DropdownButton
                                      title={
                                        plotData["units"] &&
                                        plotData["type"] === type.id
                                          ? plotData["units"]
                                          : "Select Quantity"
                                      }
                                    >
                                      {Options.map((option) => {
                                        return (
                                          <Dropdown.Item
                                            className={
                                              option === plotData["units"]
                                                ? "active"
                                                : ""
                                            }
                                            onClick={() => {
                                              handleDataChange(
                                                type,
                                                "units",
                                                option,
                                                mainTypeIndex
                                              );
                                            }}
                                          >
                                            {option}
                                          </Dropdown.Item>
                                        );
                                      })}
                                      <Dropdown.Item
                                        onClick={() => {
                                          setIsLimitExceedTen(true);
                                          setPlotData((prevState) => ({
                                            ...prevState,
                                            units: "",
                                          }));
                                        }}
                                      >
                                        {"10+"}
                                      </Dropdown.Item>
                                    </DropdownButton>
                                  )}
                                </div>

                                <div className="opt-container-time  align-self-right">
                                  <FormLabel className="text-white text mb-0">
                                    {type?.id === 0 ||
                                    type?.id === 2 ||
                                    type?.id === 6 ||
                                    type?.id === 7 ||
                                    type?.id === 3 ||
                                    type?.id === 4 ? (
                                      <>Time Left to End the {type?.name}</>
                                    ) : (
                                      <>
                                        Time Left to End the
                                        {type?.name} Sale
                                      </>
                                    )}{" "}
                                  </FormLabel>
                                  <CountDown
                                    boxInitiateTime={type.endTime}
                                    handleTimeOut={handleTimeOut}
                                    roundExpiration={true}
                                  />
                                </div>
                              </FormGroup>
                            ) : (
                              <>
                                <div className="Ended-container-btn">
                                  <Button
                                    onClick={claimAstroboyNFT}
                                    className="claimDeemoNFT"
                                  >
                                    {loaderFor === "Claim" ? (
                                      <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        variant="info"
                                        role="status"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      "Claim NFT"
                                    )}
                                  </Button>
                                </div>
                              </>
                            )
                          ) : (
                            <div className="Ended-container">
                              <FormGroup>
                                <FormLabel className="text-white mb-0">
                                  Sale Ended
                                </FormLabel>
                              </FormGroup>
                            </div>
                          )
                        ) : (
                          <>
                            <div className="CountDownClass">
                              <h4>
                                {type?.id === 0 ||
                                type?.id === 2 ||
                                type?.id === 6 ||
                                type?.id === 7 ||
                                type?.id === 3 ||
                                type?.id === 4 ? (
                                  <>Time Left to start the {type?.name}</>
                                ) : (
                                  <>
                                    Time Left to start the
                                    {type?.name} Sale
                                  </>
                                )}{" "}
                              </h4>

                              <CountDown
                                boxInitiateTime={type.startTime}
                                handleTimeOut={handleTimeOut}
                                roundExpiration={true}
                              />
                            </div>
                          </>
                        )}
                      </Figure>
                    );
                  })
                ) : (
                  <h2 className="text-white text-center datanotthere">
                    No Data Found
                  </h2>
                )}
              </div>
              <Card className="correction-card">
                <Card.Header>Summary</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Per Unit Price{" "}
                    <span>
                      {plotRates?.perUnitprice ? plotRates?.perUnitprice : "0"}{" "}
                      {nftChain === "binance"
                        ? "BNB"
                        : nftChain === "polygon"
                        ? "MATIC"
                        : nftChain === "xanachain"
                        ? "XETA"
                        : "ETH"}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    No of NFTs to Buy{" "}
                    <span>{plotData.units ? plotData.units : "0"}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Total{" "}
                    <span>
                      {allowedCategories && selectedSaleTypeIndex && allowedCategories[selectedSaleTypeIndex].id === 4
                        ? "0"
                        : totalPrice.toString().includes("e")
                        ? totalPrice.toFixed(8)
                        : totalPrice}{" "}
                      {nftChain === "binance"
                        ? "BNB"
                        : nftChain === "polygon"
                        ? "MATIC"
                        : nftChain === "xanachain"
                        ? "XETA"
                        : "ETH"}
                    </span>
                  </ListGroup.Item>
                </ListGroup>
                {/* <Checkbox style={{ marginLeft: '15px',color: "blue" }} onClick={handleShow}>I agree to the disclaimer</Checkbox> */}
                {/* <input type="checkbox" style={{ marginLeft: '15px',color: "blue" }}>I agree to the disclaimer </input> */}
                {/* <div className="disclaimer-wrp">
                  <input
                    type="checkbox"
                    defaultChecked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <a onClick={handleShow}> I agree to the disclaimer</a>
                </div> */}

                <Form.Group
                  className="disclaimer-wrp"
                  controlId="formBasicCheckbox"
                >
                  <Form.Check
                    type="checkbox"
                    label=""
                    defaultChecked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <a onClick={handleShow}> I agree to the disclaimer</a>
                </Form.Group>
                {isSoldOut ? (
                  <Button
                    block
                    type="button"
                    variant="primary"
                    className="checkoutBtn "
                  >
                    Sold Out
                  </Button>
                ) : (
                  <Button
                    block
                    type="button"
                    variant="primary"
                    className="checkoutBtn "
                    onClick={handlePlaceOrder}
                    disabled={
                      !checked ||
                      calculatingPrice ||
                      !limitRemains ||
                      plotData["units"] === ""
                    }
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
                      "Proceed to Checkout"
                    )}
                  </Button>
                )}
              </Card>
            </div>
          ) : (
            <div className="loader-box">
              <NewLoader />
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Disclaimer
        show={show}
        handleShow={handleShow}
        handleClose={handleClose}
      ></Disclaimer>
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
  connect(mapStateToProps, { setTransactionInProgress })(CheckoutModal)
);