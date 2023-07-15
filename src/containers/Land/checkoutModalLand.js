/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Big from "big.js";
import { injectIntl } from "react-intl";
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
} from "react-bootstrap";
import { connect } from "react-redux";

import { setTransactionInProgress } from "../../_actions/metaMaskActions";
import NewLoader from "../../component/Loader/loader";
import { showNotitication } from "../../utils/showNotification";
import { blockChainConfig } from "../../config/blockChainConfig";
import { networkType } from "../../config/networkType";
import { categories, plotTypes, mainTypes } from "./landConfig";
import CountDown from "../../component/CountDown/countDown";

import "./landCollection.scss";

let providerUrl = "";

let landAbi,
  landAddress = "";

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

  const [allowedCategories, setAllowedCategories] = useState([]);

  const [plotData, setPlotData] = useState({
    plotSize: "",
    units: "",
    price: "",
  });
  const [plotRates, setPlotRates] = useState({});

  const [selectedSaleTypeIndex, setSelectedSaleTypeIndex] = useState("");

  const [selectedOption, setSelectedOption] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const [isSoldOut, setIsSoldOut] = useState(false);

  const [limitRemains, setIsLimitRemains] = useState(false);


  useEffect(async () => {
    setContractAddress();

    if (props.metaMaskAddress) {
      let resData = await getWhitelistCategoryData();
      console.log("resData", resData);
      if (props.isPublicSaleOpen) {
        setAllowedCategories([
          {
            ...mainTypes[0],
            remainingLimit: "Unlimited",
            userBought: 0,
            limit: false,
            startTime: parseInt(resData[0].startTime) * 1000,
            endTime: parseInt(resData[0].endTime) * 1000,
          },
        ]);
        setLoadCollData(false);
      } else {
        axios
          .get(
            `${baseUrl}/blind-box/get-user-limit?address=${props.metaMaskAddress}&blindBoxId=1`
          )
          .then(async (res) => {
            console.log("user limit", res.data);
            if (res.data && res.status === 200) {
              let user_bought = await getUserBought();
              console.log("user bought", user_bought);

              let tempAllowedCategories = [];
              for (let i = 1; i < mainTypes.length; i++) {
                let limitObj = res.data[mainTypes[i].id];
                let remainingLimit = limitObj.limit - parseInt(user_bought[i]);

                if (remainingLimit > 0) {
                  tempAllowedCategories.push({
                    ...mainTypes[i],
                    remainingLimit,
                    userBought: user_bought[i],
                    limit: true,
                    startTime: parseInt(resData[i].startTime) * 1000,
                    endTime: parseInt(resData[i].endTime) * 1000,
                  });
                } else if (limitObj.infinity) {
                  tempAllowedCategories.push({
                    ...mainTypes[i],
                    remainingLimit: "Unlimited",
                    userBought: user_bought[i],
                    limit: false,
                    startTime: parseInt(resData[i].startTime) * 1000,
                    endTime: parseInt(resData[i].endTime) * 1000,
                  });
                }
              }
              console.log("tempAllowedCategories", tempAllowedCategories);
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
    if (
      Object.keys(plotRates).length > 0 &&
      plotData.plotSize !== "" &&
      plotData.units !== "" &&
      selectedOption !== ""
    ) {
      setCalculatingPrice(false);
      if (
        parseInt(plotData.units) >
        parseInt(plotRates.total) - parseInt(plotRates.sold)
      ) {
        setIsLimitRemains(false)
        return showNotitication(
          "You cannot able to purchase multiple items beyond our Stock.",
          "info"
        );
      }
      let x = new Big(plotRates.perUnitprice.toString());
      let y = new Big(plotData.units.toString());
      let price = x.times(y).toNumber();
      setTotalPrice(price);
      setIsLimitRemains(true)
    }
  }, [plotRates]);

  useEffect(() => {
    console.log(plotData);
    if (
      plotData.plotSize !== "" &&
      plotData.units !== "" &&
      selectedOption !== ""
    ) {
      getPlotRates();
      if (allowedCategories[selectedSaleTypeIndex].name === "Discounted") {
        calculateDiscount();
      }
    }
  }, [plotData.plotSize, plotData.units, selectedOption]);

  useEffect(() => {
    if (!props.metaMaskAddress) {
      props.setModalOpen(false);
    }
  }, [props.metaMaskAddress]);

  const getWhitelistCategoryData = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(landAbi, landAddress);
    let userRange = [];
    for (let i = 0; i < mainTypes.length; i++) {
      userRange.push(
        landContract.methods.whitelistRoot(mainTypes[i].id).call()
      );
    }
    return Promise.all(userRange);
  };

  const getUserBought = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(landAbi, landAddress);
    let userRange = [];
    for (let i = 0; i < mainTypes.length; i++) {
      userRange.push(
        landContract.methods
          ._userBought(mainTypes[i].id, props.metaMaskAddress)
          .call()
      );
    }
    return Promise.all(userRange);
  };

  const calculateDiscount = async () => {
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(landAbi, landAddress);
    let dis = await landContract.methods
      .calculateDiscount(plotTypes[plotData.plotSize].key, selectedOption.key)
      .call();
    console.log(dis);
    if (dis) {
      let x = new Big(web3.utils.fromWei(dis).toString());
      let y = new Big(plotData.units.toString());
      let price = x.times(y).toNumber();
      setDiscountedPrice(price);
      return dis;
    }
  };

  const setContractAddress = () => {
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        providerUrl = blockChainConfig[i].providerUrl;
        landAbi = blockChainConfig[i].landConConfig.abi;
        landAddress = blockChainConfig[i].landConConfig.add;
      }
    }
  };

  const handleDataChange = (key, value, sIndex) => {
    let newData;
    if (sIndex === selectedSaleTypeIndex) {
      newData = { ...plotData };
    } else {
      newData = {
        plotSize: "",
        units: "",
        price: "",
      };

      setPlotRates({});
      setTotalPrice(0);
      setSelectedOption("");
    }

    const re = /^[0-9\b]+$/;
    if (key === "units") {
      if (re.test(value) || value === "") {
        newData[key] = value;
        setPlotData(newData);
      }
    } else {
      newData[key] = value;
      setPlotData(newData);
    }
    if (key === "rarity")
      setSelectedOption(allowedCategories[sIndex].rarities[value]);

    setSelectedSaleTypeIndex(sIndex);
  };

  const getPlotRates = async () => {
    setCalculatingPrice(true);
    let web3 = new Web3(providerUrl);
    let landContract = new web3.eth.Contract(landAbi, landAddress);
    let collDataPrice = await landContract.methods
      .rates(plotTypes[plotData.plotSize].key, selectedOption.rarity)
      .call();
    console.log(collDataPrice);
    if (collDataPrice !== undefined) {
      if (parseInt(collDataPrice.sold) >= parseInt(collDataPrice.total)) {
        setIsSoldOut(true);
      } else {
        setIsSoldOut(false);
      }
      setPlotRates({
        ...collDataPrice,
        perUnitprice: web3.utils.fromWei(collDataPrice.cost),
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
      `${baseUrl}/blind-box/get-proof-hash?address=${props.metaMaskAddress}&limit=${limit}&type=${allowedCategories[selectedSaleTypeIndex].id}&blindBoxId=1`
    );
    return proof;
  };

  const handlePlaceOrder = async () => {
    if (props.transactionInProgress === true)
      return showNotitication("Transaction is already in Progress", "info");

    if (!plotData["units"] || plotData["units"] === "0") {
      showNotitication(`Please select some units to buy`, "info");
      return;
    }

    if (plotData.plotSize === "") {
      showNotitication(`Please select the plot size to buy`, "info");
      return;
    }

    if (parseInt(plotData["units"]) > 30) {
      showNotitication(
        `You can able to purchase maximum of 30 items in a transaction`,
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
        // if (
        //   selectedOption.name === "Common" ||
        //   selectedOption.name === "Rare" ||
        //   selectedOption.name === "Super Rare"
        // ) {
        //   buyCommon(acc, user_proof.data?.hexProof);
        // } else if (selectedOption.name === "discount") {
        //   mintDiscountCommon(acc, user_proof.data?.hexProof);
        // } else if (selectedOption.name === "free") {
        //   freeMint(acc, user_proof.data?.hexProof);
        // }
        props.setTransactionInProgress(true);
        if (
          allowedCategories[selectedSaleTypeIndex].id === 0 ||
          allowedCategories[selectedSaleTypeIndex].id === 1 ||
          allowedCategories[selectedSaleTypeIndex].id === 2 ||
          allowedCategories[selectedSaleTypeIndex].id === 3
        ) {
          buyCommon(acc, user_proof.data?.hexProof);
        } else if (allowedCategories[selectedSaleTypeIndex].id === 4) {
          mintDiscountCommon(acc, user_proof.data?.hexProof);
        } else if (allowedCategories[selectedSaleTypeIndex].id === 5) {
          freeMint(acc, user_proof.data?.hexProof);
        } else if (allowedCategories[selectedSaleTypeIndex].id === 6) {
          claimRooster(acc, user_proof.data?.hexProof);
        }
      }
    });
  };

  const buyCommon = (acc, user_proof) => {
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(landAbi, landAddress);
    console.log(
      selectedOption.key,
      plotData.units,
      plotTypes[plotData.plotSize].key,
      user_proof,
      allowedCategories[selectedSaleTypeIndex].limit,
      allowedCategories[selectedSaleTypeIndex].id
    );
    LandContract.methods
      .mintLand(
        selectedOption.key,
        plotData.units,
        plotTypes[plotData.plotSize].key,
        user_proof,
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
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
      });
  };

  const mintDiscountCommon = async (acc, user_proof) => {
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(landAbi, landAddress);
    // mintDiscountCommon(uint256 _mintAmount, uint256 _size, bytes32[] calldata proof, bool isLimit)

    LandContract.methods
      .mintDiscountCommon(plotData.units, user_proof)
      .send({
        from: acc[0],
        value: web3.utils.toHex(
          web3.utils.toWei(discountedPrice.toString(), "ether")
        ),
      })
      .then((res) => {
        showNotitication("Transaction got successfull", "success");
        props.setTransactionInProgress(false);
        setLoaderFor("");
        props.setModalOpen(false);
        props.setOpenSuccessModal(true);
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
      });
  };

  const freeMint = (acc, user_proof) => {
    //freeMint(uint256 _mintAmount,  bytes32[] calldata proof)
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(landAbi, landAddress, user_proof);
    LandContract.methods
      .freeMint(plotData.units, user_proof)
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
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
      });
  };


  const claimRooster = (acc, user_proof) => {
    //freeMint(uint256 _mintAmount,  bytes32[] calldata proof)
    let web3 = new Web3(props.provider);
    let LandContract = new web3.eth.Contract(landAbi, landAddress, user_proof);
    LandContract.methods
      .claimRooster(plotData.units, user_proof)
      .send({
        from: acc[0],
      })
      .then((res) => {
        console.log(res)
        showNotitication("Transaction got successfull", "success");
        props.setTransactionInProgress(false);
        setLoaderFor("");
        props.setModalOpen(false);
        props.setOpenSuccessModal(true);
      })
      .catch((err) => {
        props.setTransactionInProgress(false);
        setLoaderFor("");
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
        className="fade connect-modal purchaseNftModal"
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
                  <h5> Item</h5>
                  <h5> Qty</h5>
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
                          <h4>{type.name}</h4>
                          <p>{type.description}</p>
                          <h6>
                            Max to Buy:
                            <span>
                              {" "}
                              {type.remainingLimit
                                ? type.remainingLimit === "Unlimited"
                                  ? "Unlimited"
                                  : type.remainingLimit
                                : "0"}
                            </span>
                          </h6>
                        </Figure.Caption>

                        {new Date().getTime() >= type.startTime ? (
                          type.endTime >= new Date().getTime() ? (
                            <FormGroup>
                              <div className="opt-container">
                                <FormLabel className="text-white inputLabels">
                                  Rarity
                                </FormLabel>

                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="primary"
                                    className="dropdown-main"
                                  >
                                    {selectedSaleTypeIndex === mainTypeIndex &&
                                    selectedOption?.name
                                      ? selectedOption.name
                                      : "Select"}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    {type.rarities.length > 0 ? (
                                      type.rarities.map(
                                        (category, rarityIndex) => (
                                          <Dropdown.Item
                                            eventKey={category.key}
                                            index={category.key}
                                            onClick={() => {
                                              handleDataChange(
                                                "rarity",
                                                rarityIndex,
                                                mainTypeIndex
                                              );
                                            }}
                                          >
                                            {category.name}
                                          </Dropdown.Item>
                                        )
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>

                              <div className="opt-container">
                                <FormLabel className="text-white inputLabels">
                                  Plot Size
                                </FormLabel>

                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="primary"
                                    className="dropdown-main"
                                  >
                                    {selectedSaleTypeIndex === mainTypeIndex &&
                                    plotData["plotSize"] !== ""
                                      ? plotTypes[plotData["plotSize"]].value
                                      : "Select"}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    {type.plotSizes.map((item, plotIndex) => (
                                      <Dropdown.Item
                                        eventKey={item.key}
                                        index={item.value}
                                        onClick={() => {
                                          handleDataChange(
                                            "plotSize",
                                            plotIndex,
                                            mainTypeIndex
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
                                  name="units"
                                  placeholder="Enter quantity"
                                  value={
                                    selectedSaleTypeIndex === mainTypeIndex
                                      ? plotData.units
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleDataChange(
                                      "units",
                                      e.target.value,
                                      mainTypeIndex
                                    );
                                  }}
                                />
                              </div>

                              <div className="opt-container">
                                {/* <FormLabel className="text-white mb-0">
                                  Ends In:
                                </FormLabel> */}
                                <CountDown
                                  boxInitiateTime={type.endTime}
                                  handleTimeOut={handleTimeOut}
                                  roundExpiration={true}
                                />
                              </div>
                            </FormGroup>
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
                              <h4>Time Left to start Sale</h4>
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
              <Card>
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
                        :  nftChain === "ethereum" ? "ETH" :"XETA"}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    No of Units to Buy{" "}
                    <span>{plotData.units ? plotData.units : "0"}</span>
                  </ListGroup.Item>
                  {/* <ListGroup.Item>
                    Size of Plot{" "}
                    <span>
                      {plotData?.plotSize !== ""
                        ? plotTypes[plotData.plotSize].key
                        : "0"}
                    </span>
                  </ListGroup.Item> */}
                  <ListGroup.Item>
                    Total{" "}
                    <span>
                      {totalPrice.toString().includes("e") ? totalPrice.toFixed(8) : totalPrice}{" "}
                      {nftChain === "binance"
                        ? "BNB"
                        : nftChain === "polygon"
                        ? "MATIC"
                        :  nftChain === "ethereum" ? "ETH" :"XETA"}
                    </span>
                  </ListGroup.Item>

                  {selectedSaleTypeIndex &&
                    allowedCategories[selectedSaleTypeIndex].name ===
                      "Discounted" && (
                      <>
                        <ListGroup.Item>
                          Discount <span>30%</span>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          After Discount{" "}
                          <span>
                            {discountedPrice.toString().includes("e") ? discountedPrice.toFixed(8) : discountedPrice}{" "}
                            {nftChain === "binance"
                               ? "BNB"
                               : nftChain === "polygon"
                               ? "MATIC"
                               :  nftChain === "ethereum" ? "ETH" :"XETA"}
                          </span>
                        </ListGroup.Item>
                      </>
                    )}
                </ListGroup>
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
                      calculatingPrice ||
                      !limitRemains ||
                      plotData["units"] === "" ||
                      plotData.plotSize === "" ||
                      selectedOption === ""
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
