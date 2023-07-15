/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { networkType } from "../../config/networkType";
import axios from "axios";
import { blockChainConfig } from "../../config/blockChainConfig";
import { adminAccess } from "../../config/networkType";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Button,
  Card,
  Spinner,
  Figure,
  Form,
  ListGroup,
  Modal,
  FormGroup,
  FormLabel,
  Dropdown,
} from "react-bootstrap";
import { connect } from "react-redux";
import checkWalletConnection from "../../utils/checkWalletConnection";
import { setTransactionInProgress } from "../../_actions/metaMaskActions";
import NewLoader from "../../component/Loader/loader";
import { toast } from "react-toastify";
import { divideNo } from "../../utils/divideByEighteen";
import { checkAvailabilityOnChain } from "../../config/setupNetworkInWallet";
import { basePriceTokens } from "../../config/availableTokens";
import Big from "big.js";

import {categories, plotTypes} from '../Land/landConfig'

import "./BlindBoxCollection.scss";

let providerUrl = "";

let xanaGenesisDexAbi,
  xanaGenesisDexAddress = "";

const Web3 = require("web3");

function CheckoutModal(props) {
  const [loaderFor, setLoaderFor] = useState("");
  const [nftChain, setNftChain] = useState(
    adminAccess ? "binance" : "ethereum"
  );

  const [collectionData, setCollectionData] = useState("");
  const [loadCollData, setLoadCollData] = useState(false);

  const [priceData, setPriceData] = useState("");

  const [order, setOrder] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [gasPrice, setGasPrice] = useState(0);
  const [gasPriceCalculation, setGasPriceCalculation] = useState(false);

  const [userProof, setUserProof] = useState([]);

  const [plotData, setPlotData] = useState({
    rarity: "",
    plotSize: "",
    units: "",
    price: "",
  });
  const [plotRates, setPlotRates] = useState({});

  const [selectedOption, setSelectedOption] = useState("");

  const setContractAddress = () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        providerUrl = blockChainConfig[i].providerUrl;
        xanaGenesisDexAbi = blockChainConfig[i].xanaGenesisDexConConfig.abi;
        xanaGenesisDexAddress = blockChainConfig[i].xanaGenesisDexConConfig.add;
      }
    }
  };

  useEffect(() => {
    let timer;
    if (totalAmount > 0) {
      timer = setTimeout(async () => {
        let gasprice = await getGasPrice(totalAmount);
        setGasPrice(gasprice);
      }, 1000);
    } else {
      setGasPrice(0);
      setGasPriceCalculation(false);
    }

    return () => clearTimeout(timer);
  }, [totalAmount]);

  const handleDataChange = (key, value, rowIndex) => {
    if (rowIndex === selectedOption) {
      let newData = {
        ...plotData,
        [key]: value,
      };

      setPlotData(newData);
    } else {
      let newData = {
        rarity: "",
        plotSize: "",
        units: "",
        price: "",
      };

      setPlotData({ ...newData, [key]: value });
      setSelectedOption(rowIndex);
    }
  };

  console.log(plotData);
  useEffect(() => {
    // if (plotData.plotSize && plotData.rarity) {
    //     getPlotRates();
    // }
    // let price = parseInt(plotRates.cost) * parseInt(plotData.units);
    // let newData = {
    //     ...plotData,
    //     price: price,
    // };
    // if (price) {
    //     setPlotData(newData);
    // }
  }, [plotData.plotSize, plotData.rarity, plotData.cost, plotData.units]);

  const checkUserWhiteListed = async (_vipId, proof) => {
    let web3 = new Web3(providerUrl);
    let xanaGenesisDexContract = new web3.eth.Contract(
      xanaGenesisDexAbi,
      xanaGenesisDexAddress
    );
    let collDataPrice = await xanaGenesisDexContract.methods
      .isWhitelisted(props.metaMaskAddress, proof, _vipId)
      .call();
    if (collDataPrice !== undefined) {
      return collDataPrice;
    }
  };

  const getUserBought = async (range) => {
    let web3 = new Web3(providerUrl);
    let xanaGenesisDexContract = new web3.eth.Contract(
      xanaGenesisDexAbi,
      xanaGenesisDexAddress
    );
    let userRange = [];
    for (let i = 0; i < range; i++) {
      userRange.push(
        xanaGenesisDexContract.methods
          .userBought(props.metaMaskAddress, i)
          .call()
      );
    }
    return userRange;
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

  const whiteListSaleId = async () => {
    let web3 = new Web3(providerUrl);
    let xanaGenesisDexContract = new web3.eth.Contract(
      xanaGenesisDexAbi,
      xanaGenesisDexAddress
    );
    let collDataPrice = await xanaGenesisDexContract.methods
      .whiteListSaleId()
      .call();

    return collDataPrice;
  };

  const getGasPrice = async (count) => {
    let url =
      networkType === "testnet"
        ? `https://testapi.xanalia.com/xanaGenesis/get-gas-price?walletAddr=${props.metaMaskAddress}&countNft=${count}`
        : `https://api.xanalia.com/xanaGenesis/get-gas-price?walletAddr=${props.metaMaskAddress}&countNft=${count}`;
    let res = await axios.get(url);
    setGasPriceCalculation(false);
    if (res && res.data.success) {
      return res.data.gasprice;
    }
  };

  useEffect(async () => {
    setContractAddress();

    if (props.metaMaskAddress) {
      setLoadCollData(true);
      let url =
        networkType === "testnet"
          ? `https://testapi.xanalia.com/xanaGenesis/get-user-limit?walletAddr=${props.metaMaskAddress}`
          : `https://api.xanalia.com/xanaGenesis/get-user-limit?walletAddr=${props.metaMaskAddress}`;
      axios
        .get(url)
        .then(async (res) => {
          if (res.data.data && res.data.success) {
            let rangeIds = Object.keys(res.data.data).length;
            let isSaleWhiteList = await saleWhiteList();
            console.log("isSaleWhiteList", isSaleWhiteList);
            if (
              isSaleWhiteList &&
              props.selectedRound?.whitelistStartTime <= new Date().getTime()
            ) {
              rangeIds++;
            }

            let userRange = await getUserBought(rangeIds);
            let userRangeRes = await Promise.all(userRange);
            console.log("res of user bought", userRangeRes);
            let prices = await getPrices(rangeIds);
            console.log("prices", prices);

            let arr = [];
            for (const key in res.data.data) {
              let range = [];
              let availableNftForBuy = false;
              let limitReached = false;

              if (res.data.data[key].count) {
                let purchaselimit =
                  parseInt(res.data.data[key].count) *
                  parseInt(prices[key].limit);

                let diff =
                  parseInt(purchaselimit) - parseInt(userRangeRes[key]);
                for (let i = 1; i <= diff; i++) range.push(i);
                console.log(diff);
                limitReached = diff <= 0 ? true : false;
                if (limitReached) {
                  availableNftForBuy = false;
                } else {
                  availableNftForBuy = true;
                }
              }
              arr.push({
                ...res.data.data[key],
                userLimit: range.length > 0 ? range : "",
                availableNftForBuy,
                limitReached,
              });
            }
            if (
              isSaleWhiteList &&
              props.selectedRound?.whitelistStartTime <= new Date().getTime()
            ) {
              let saleWhiteListId = await whiteListSaleId();
              console.log(saleWhiteListId);
              let url =
                networkType === "testnet"
                  ? `https://testapi.xanalia.com/xanaGenesis/get-proof?id=${props.collId}&walletAddr=${props.metaMaskAddress}`
                  : `https://api.xanalia.com/xanaGenesis/get-proof?id=${props.collId}&walletAddr=${props.metaMaskAddress}`;
              let res = await axios.get(url);
              if (res && res.data.success) {
                setUserProof(res.data.data);
              }

              if (saleWhiteListId) {
                let userWhiteListed = await checkUserWhiteListed(
                  saleWhiteListId,
                  res.data.data
                );
                if (userWhiteListed) {
                  console.log(userWhiteListed);
                  let obj = {
                    count: 0,
                    key: "WhiteListed",
                    userLimit: [],
                    availableNftForBuy: true,
                    limitReached: false,
                    collection: {
                      name: "WhiteListed",
                      iconImage:
                        "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
                      description:
                        "White listed user can buy this even without having any of the passes",
                    },
                  };
                  arr.splice(saleWhiteListId, 0, obj);
                }
              }
            }
            console.log(arr);
            setCollectionData(arr);
            setPriceData(prices);
            setLoadCollData(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleDepositeAmountChange = (evt, index) => {
    const re = /^[0-9\b]+$/;
    if (re.test(evt.target.value) || evt.target.value === "") {
      setGasPriceCalculation(true);
      let tempOrder = [...order];
      tempOrder[index] = {
        amount: evt.target.value === "" ? "" : parseInt(evt.target.value),
        price: parseFloat(priceData[index].parsedPrice),
        vipPassId: index,
        buyer: "0x0000000000000000000000000000000000000000",
        proof: userProof,
      };
      let totalAmount = 0;
      for (let i = 0; i < tempOrder.length; i++) {
        if (tempOrder[i]?.amount && parseInt(tempOrder[i].amount) > 0) {
          totalAmount += tempOrder[i].amount;
        }
      }
      setOrder(tempOrder);
      setTotalAmount(totalAmount);
    }
  };

  const calculateSubTotal = useCallback(() => {
    let bill = 0;
    for (let i = 0; i < order.length; i++) {
      if (order[i]?.amount && parseInt(order[i].amount) > 0) {
        let x = new Big(order[i].amount.toString());
        let y = new Big(order[i].price.toString());
        let perCollectionPrice = x.times(y).toNumber();
        bill = new Big(bill).add(perCollectionPrice).toNumber();
      }
    }
    return bill;
  }, [order]);

  const calculateTotalBill = useCallback(() => {
    let subTotal = calculateSubTotal();
    return new Big(subTotal).add(gasPrice).toNumber();
  }, [gasPrice]);

  const handlePlaceOrder = async () => {
    let subTotal = calculateSubTotal() + gasPrice;
    let finalOrder = [];
    for (let i = 0; i < order.length; i++) {
      if (order[i] && order[i]?.amount && parseInt(order[i].amount) > 0) {
        finalOrder.push({
          amount: order[i].amount,
          vipPassId: order[i].vipPassId,
          buyer: order[i].buyer,
          proof: order[i].proof,
        });
      }
    }

    if (totalAmount === 0) {
      toast.info(`Please select some quantity to buy`, {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "selectcurrencymsg-1",
      });
      return;
    }

    if (totalAmount > 100) {
      toast.info(`Amount to buy should not be greater than 100`, {
        position: "bottom-right",
        autoClose: 3000,
        progress: undefined,
        toastId: "selectcurrencymsg-1",
      });
      return;
    }

    let web3 = new Web3(props.provider);
    web3.eth.getAccounts().then(async (acc) => {
      setLoaderFor("Buy");
      let balance = await web3.eth.getBalance(acc[0]);
      if (parseFloat(balance) < parseFloat(subTotal)) {
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
      let MarketPlaceContract = new web3.eth.Contract(
        xanaGenesisDexAbi,
        xanaGenesisDexAddress
      );
      MarketPlaceContract.methods
        .placeOrder(JSON.parse(JSON.stringify(finalOrder)), totalAmount)
        .send({
          from: acc[0],
          value: web3.utils.toHex(
            web3.utils.toWei(subTotal.toString(), "ether")
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
          props.setModalOpen(false);
          props.setOpenSuccessModal(true);
          setOrder([]);
        })
        .catch((err) => {
          console.log(err);
          props.setTransactionInProgress(false);
          setLoaderFor("");
        });
    });
  };

  const toggleCheckoutButton = () => {
    for (let i = 0; i < collectionData.length; i++) {
      if (
        !collectionData[i].limitReached &&
        collectionData[i].availableNftForBuy
      )
        return true;
    }
  };

  const handleChangeCheckBox = (index) => {
    if (selectedOption === index) setSelectedOption("");
    else {
      setSelectedOption(index);
      setPlotData({
        rarity: categories[index].rarity,
        plotSize: "",
        units: "",
        price: "",
      });
    }
  };

  return (
    <React.Fragment>
      <Modal
        size="xl"
        className="fade connect-modal purchaseNftModal"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui whiteBg"
        backdropClassName="custom-backdrop"
        contentClassName="custom-content"
        centered
        show={true}
        onHide={() => props.setModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!loadCollData ? (
            <div className="cartProductCheckOut">
              <div className="cartProductTable">
                <div className="cartProductHeader">
                  <h5> Item</h5>
                  <h5> Qty</h5>
                </div>
                {/* {collectionData &&
                  priceData &&
                  collectionData.length > 0 &&
                  collectionData.map((number, index) => (
                    <Figure>
                      <Figure.Image
                        alt="171x180"
                        src={
                          number.collection && number.collection.iconImage
                            ? number.collection.iconImage
                            : "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png"
                        }
                      />
                      <Figure.Caption>
                        <h4>
                          {" "}
                          {number.collection && number.collection.name
                            ? number.collection.name
                            : ""}{" "}
                        </h4>
                        <p>
                          {number.collection && number.collection.description
                            ? number.collection.description
                            : ""}{" "}
                        </p>
                        <h2>
                          {" "}
                          {priceData[index].parsedPrice}
                          <span>
                            {nftChain === "binance"
                              ? "BNB"
                              : nftChain === "polygon"
                              ? "MATIC"
                              : "ETH"}
                          </span>
                        </h2>
                      </Figure.Caption>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        {!number.limitReached ? (
                          number.availableNftForBuy ? (
                            number.userLimit.length > 0 ? (
                              <div className="multiselectHead">
                                <select
                                  className="form-control"
                                  onChange={(e) =>
                                    handleDepositeAmountChange(e, index)
                                  }
                                  id="noOfToken"
                                >
                                  <option value={""}>No of NFTs</option>
                                  {number.userLimit.map((token) => {
                                    return (
                                      <option value={token} key={token}>
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
                                placeholder="Enter quantity"
                                onChange={(e) =>
                                  handleDepositeAmountChange(e, index)
                                }
                                value={
                                  order[index]?.amount
                                    ? order[index]?.amount
                                    : ""
                                }
                              />
                            )
                          ) : (
                            <span style={{ color: "white" }}>
                              No pass available
                            </span>
                          )
                        ) : (
                          <span style={{ color: "white" }}>Limit Reached</span>
                        )}
                      </Form.Group>
                    </Figure>
                  ))} */}

                {categories.map((category, index) => (
                  <Figure className={selectedOption === index? "activeRow" :"" }>
                    <Figure.Image alt="171x180" src={category.image} />
                    <Figure.Caption>
                      <h4>{category.name}</h4>
                      <p>{category.description}</p>
                      <h2>
                        {0.02}{" "}
                        {nftChain === "binance"
                          ? "BNB"
                          : nftChain === "polygon"
                          ? "MATIC"
                          : "ETH"}
                      </h2>
                    </Figure.Caption>

                    <>
                      <FormGroup>
                        <div className="opt-container">
                          <FormLabel className="text-white inputLabels">
                            Plot Size
                          </FormLabel>

                          <Dropdown>
                            <Dropdown.Toggle
                              // disabled={!(selectedOption === index)}
                              variant="primary"
                              id="dropdown-basic"
                              className="dropdown-main"
                            >
                              {selectedOption === index &&
                              plotData["plotSize"] !== ""
                                ? plotTypes[plotData["plotSize"]].value
                                : "Select"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {category.plotTypes.map((item, plotIndex) => (
                                <Dropdown.Item
                                  eventKey={item.key}
                                  index={item.value}
                                  onClick={() => {
                                    handleDataChange(
                                      "plotSize",
                                      plotIndex,
                                      index
                                    );
                                  }}
                                >
                                  {item.value}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        <div className="opt-container">
                          <FormLabel className="text-white inputLabels">
                            No. of Units
                          </FormLabel>
                          <input
                            // disabled={!(selectedOption === index)}
                            type="number"
                            max={10}
                            min={0}
                            name="units"
                            id="units"
                            value={selectedOption === index && plotData.units}
                            onChange={(e) => {
                              handleDataChange("units", e.target.value, index);
                            }}
                          />
                        </div>
                      </FormGroup>

                      {/* <FormGroup className="col-md-5 pr-0">
                            <FormLabel className="text-white">Price</FormLabel>
                            <select
                              type="text"
                              disabled
                              name="price"
                              id="price"
                              value={getPlotPrice()}
                            />
                          </FormGroup> */}
                    </>
                  </Figure>
                ))}
              </div>
              <Card>
                <Card.Header>Summary</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Subtotal{" "}
                    <span>
                      {calculateSubTotal()}{" "}
                      {nftChain === "binance"
                        ? "BNB"
                        : nftChain === "polygon"
                        ? "MATIC"
                        : "ETH"}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Whitelist Minting Fee{" "}
                    <span>
                      {gasPrice}{" "}
                      {nftChain === "binance"
                        ? "BNB"
                        : nftChain === "polygon"
                        ? "MATIC"
                        : "ETH"}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Total{" "}
                    <span>
                      {calculateTotalBill()}{" "}
                      {nftChain === "binance"
                        ? "BNB"
                        : nftChain === "polygon"
                        ? "MATIC"
                        : "ETH"}
                    </span>
                  </ListGroup.Item>
                </ListGroup>
                {toggleCheckoutButton() && (
                  <Button
                    block
                    type="button"
                    variant="primary"
                    className="checkoutBtn "
                    onClick={handlePlaceOrder}
                    disabled={gasPriceCalculation}
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
                      <FormattedMessage id="Proceed to Checkout"></FormattedMessage>
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
