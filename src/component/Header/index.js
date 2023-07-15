import React from "react";
import "./header.scss";
import { Navbar, Spinner } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {
  setMetaMask,
  setContract,
  deleteContract,
  deleteMetaMask,
  setLanguage,
  setProvider,
  setLogout,
} from "../../_actions/metaMaskActions";
import {
  setBlockChain,
  deleteBlockChain,
} from "../../_actions/blockchain.actions";
import NotAvailableDialog from "./notAvailableDialog.js";
import AlreadyConnectedDialog from "./alreadyConnectedDialog";
import { setAwardTranslation } from "../../_actions/metaMaskActions";
import UnlockButton from "./UnlockButton.js";
import NetworkButton from "./selectBlockChainButton";
import { networkType } from "config/networkType";
import axios from "axios";
import { CDN_LINK } from "utils/constants";
import { ethers } from "ethers";
import XLogo from ".././../assets/XANALogo.svg";
import {setupNetwork} from '../../config/setupNetworkInWallet'

if (!localStorage.getItem("selectedBlockChain")) {
sessionStorage.setItem("selectedBlockChain", 0);
localStorage.setItem("selectedBlockChain", 0);
}

let binanceMainNet;
let binanceTestNet;
let providerUrl;


const Web3 = require("web3");
class Header extends React.Component {
  constructor(props) {
    super(props);
    binanceMainNet = this.props.selectedNetworkChain.networkIdTestNet;
    binanceTestNet = this.props.selectedNetworkChain.networkIdMainNet;
    providerUrl = this.props.selectedNetworkChain.providerUrl;
    this.state = {
      showSpinner: true,
      showModal: false,
      showConnectedModal: false,
      showWalletConnectDialog: false,
      showProfileDropdown: false,

      showWarning: false,
      connectedWithWallet: false,
      warningMsg: "",
      networkChanged: false,
    };
    this.hideConnectedModal = this.hideConnectedModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.openProfileDropdown = this.openProfileDropdown.bind(this);
  }

  addContract(calledFor, provider = null) {
    if (
      calledFor === "metamask" &&
      Web3.givenProvider &&
      Web3.givenProvider.networkVersion === binanceMainNet &&
      Web3.givenProvider.networkVersion === binanceTestNet
    ) {
      this.props.setProvider(Web3.givenProvider);
    } else if (
      calledFor === "binanceSmartChain" &&
      window.BinanceChain !== "undefined" &&
      parseInt(window.BinanceChain.chainId).toString() === binanceMainNet &&
      parseInt(window.BinanceChain.chainId).toString() === binanceTestNet
    ) {
      this.props.setProvider(window.BinanceChain);
    } else if (calledFor === "walletConnect") {
      this.props.setProvider({ ...provider });
    } else {
    }
  }

  clearReducer() {
    this.props.setMetaMask("");
    this.props.setContract("");
  }

 
  async connectWithWalletMetaMask(calledFor = "connected") {
    if (window.screen.width > 768) {
      let web3, ethereum;
      if (typeof window.ethereum !== "undefined") {
        ethereum = window.ethereum;
        try{
        await ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${Number(
                this.props.selectedNetworkChain.networkIdTestNet
              ).toString(16)}`,
            },
          ],
        });
      }
      catch(err){
        if(err.code===4902){
          const {walletName , currency, symbol, providerUrl, explorerURL} = this.props.selectedNetworkChain
         let addNetworkRes =  await setupNetwork(this.props.selectedNetworkChain.networkIdTestNet,
            walletName,
            currency,
            symbol,
            providerUrl,
            explorerURL
            )
            if(!addNetworkRes) return
        }
        return
      }

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        if (
          !localStorage.getItem("userToken") ||
          (localStorage.getItem("accounts") &&
            accounts[0].toLowerCase() !==
              localStorage.getItem("accounts").toLowerCase())
        ) {
          // let getNonceUrl =
          //   networkType === "testnet"
          //     ? process.env.REACT_APP_API_URL_GET_NONCE_TESTNET
          //     : process.env.REACT_APP_API_URL_GET_NONCE_MAINNET;
          // let resNonce = await axios.post(getNonceUrl, {
          //   publicAddress: accounts[0],
          // });
          // let nonce = resNonce.data.data;
          let nonce =
            "Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!";
          let web3 = new Web3(window.ethereum);
          let signature = await web3.eth.personal.sign(nonce, accounts[0]);
          // let verifySigUrl =
          //   networkType === "testnet"
          //     ? process.env.REACT_APP_API_URL_VERIFY_SIGNATURE_TESTNET
          //     : process.env.REACT_APP_API_URL_VERIFY_SIGNATURE_MAINNET;

          let verifySigUrl =
            networkType === "testnet"
              ? "https://backend.xanalia.com/auth/login-external-wallet"
              : "https://prod-backend.xanalia.com/auth/login-external-wallet";
          let verification = await axios.post(verifySigUrl, {
            // nonce: nonce,
            signature: signature,
            address: accounts[0],
          });
          localStorage.setItem("userToken", verification.data.access_token);
          localStorage.setItem(
            "cryptoUserAuth",
            JSON.stringify(verification.data.user)
          );
          // let oldChain = localStorage.getItem("selectedBlockChain");
          // localStorage.setItem("selectedBlockChain", v);
          // sessionStorage.setItem("selectedBlockChain", v);

          // if (!oldChain || (oldChain && oldChain !== v)) {
          //   window.location.reload();
          // }
          window.location.reload();
        }
        localStorage.setItem("accounts", accounts[0]);
        localStorage.setItem("connectedWith", "metamask");

        if (accounts.length > 0) {
          this.props.setMetaMask(accounts[0]);
          if (calledFor === "accountChanged") {
          } else {
          }
        }

        if (accounts.length === 0) {
          this.clearReducer();
        }

        ethereum.on("networkChanged", (newChainId) => {
          if (
            (networkType === "testnet" &&
              (
                // newChainId === "97" ||
                // newChainId === "80001" ||
                newChainId === "5" ||
                newChainId === "76798"
                )) ||
            (networkType === "mainnet" &&
              (
                // newChainId === "137" ||
                // newChainId === "56" ||
                newChainId === "1" ||
                newChainId === "8888"
                )
                )
          ) {
            let v = 0;
            if (newChainId === "8888" || newChainId === "76798") v = 0;
            else if (newChainId === "1" || newChainId === "5") v = 1;
            // else if (newChainId === "56" || newChainId === "97") v = 2;
            // else if (newChainId === "137" || newChainId === "80001") v = 3;
            localStorage.setItem("selectedBlockChain", v);
            sessionStorage.setItem("selectedBlockChain", v);
            window.location.reload();
            return;
          } else {
            this.addContract("metamask");
            this.props.setMetaMask("");
            this.handleLogout(false, true);
          }
        });

        if (
          Web3.givenProvider &&
          Web3.givenProvider.networkVersion === binanceMainNet &&
          Web3.givenProvider.networkVersion === binanceTestNet
        ) {
          web3 = new Web3(Web3.givenProvider);
        } else {
          web3 = new Web3(providerUrl);
        }

       this.addContract("metamask");
      } else if (window.web3) {
        // eslint-disable-next-line no-unused-vars
        web3 = new Web3(window.web3.currentProvider);
      } else {
        this.clearReducer();
      }
    } else {
      this.setState({ showModal: true });
      return;
    }
  }

  async connectWithWalletWithBinance(calledFor = "connected") {
    setTimeout(async () => {
      if (window.screen.width > 768) {
        let web3, ethereum;
        if (typeof window.BinanceChain !== "undefined") {
          ethereum = window.BinanceChain;

          let v = "";
          let mainnetChains = ["56"];
          let testnetChains = ["97"];
          let validChains =
            networkType === "testnet" ? testnetChains : mainnetChains;
          validChains.forEach((element, index) => {
            if (element === parseInt(ethereum.chainId, 16).toString())
              v = index;
          });
          if (v === "") return;

          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          if (
            !localStorage.getItem("userToken") ||
            (localStorage.getItem("accounts") &&
              accounts[0].toLowerCase() !==
                localStorage.getItem("accounts").toLowerCase())
          ) {
            // let getNonceUrl =
            //   networkType === "testnet"
            //     ? process.env.REACT_APP_API_URL_GET_NONCE_TESTNET
            //     : process.env.REACT_APP_API_URL_GET_NONCE_MAINNET;

            // let resNonce = await axios.post(getNonceUrl, {
            //   publicAddress: accounts[0],
            // });
            // let nonce = resNonce.data.data;
            let nonce =
              "Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!";
            let w3 = new Web3(window.BinanceChain);
            let signature = await w3.eth.personal.sign(nonce, accounts[0]);
            // let verifySigUrl =
            //   networkType === "testnet"
            //     ? process.env.REACT_APP_API_URL_VERIFY_SIGNATURE_TESTNET
            //     : process.env.REACT_APP_API_URL_VERIFY_SIGNATURE_MAINNET;
            let verifySigUrl =
              networkType === "testnet"
                ? "https://backend.xanalia.com/auth/login-external-wallet"
                : "https://prod-backend.xanalia.com/auth/login-external-wallet";
            let verification = await axios.post(verifySigUrl, {
              // nonce: nonce,
              signature: signature,
              address: accounts[0],
            });
            localStorage.setItem("userToken", verification.data.access_token);
            localStorage.setItem(
              "cryptoUserAuth",
              JSON.stringify(verification.data.user)
            );

            let oldChain = localStorage.getItem("selectedBlockChain");
            localStorage.setItem("selectedBlockChain", v);
            sessionStorage.setItem("selectedBlockChain", v);
            if (!oldChain || (oldChain && oldChain !== v)) {
              window.location.reload();
            }
          }
          localStorage.setItem("accounts", accounts[0]);
          localStorage.setItem("connectedWith", "binanceSmartChain");

          if (accounts.length > 0) {
            this.props.setMetaMask(accounts[0]);
            if (calledFor === "accountChanged") {
            } else {
            }
          }
          if (accounts.length === 0) {
            this.clearReducer();
          }

          ethereum.on("chainChanged", () => {
            this.addContract("binanceSmartChain");
            this.props.setMetaMask("");
            if (parseInt(ethereum.chainId, 16).toString() !== binanceTestNet) {
              this.clearReducer();
            }
          });

          if (
            Web3.givenProvider &&
            Web3.givenProvider.networkVersion === binanceMainNet &&
            Web3.givenProvider.networkVersion === binanceTestNet
          ) {
            web3 = new Web3(Web3.givenProvider);
          } else {
            web3 = new Web3(providerUrl);
          }

          this.addContract("binanceSmartChain");
        } else if (window.web3) {
          // eslint-disable-next-line no-unused-vars
          web3 = new Web3(window.web3.currentProvider);
        } else {
          this.clearReducer();
        }
      } else {
        this.setState({ showModal: true });
        return;
      }
    }, 0);
  }

  async connectWithWalletConnect(provider) {
    let address = provider.provider.signer
      ? provider.provider.signer?.connection.accounts[0]
      : provider.provider.accounts
      ? provider.provider.accounts[0]
      : "";

    if (
      !localStorage.getItem("userToken") ||
      (localStorage.getItem("accounts") &&
        address.toLowerCase() !==
          localStorage.getItem("accounts").toLowerCase())
    ) {
      // let getNonceUrl =
      //   networkType === "testnet"
      //     ? process.env.REACT_APP_API_URL_GET_NONCE_TESTNET
      //     : process.env.REACT_APP_API_URL_GET_NONCE_MAINNET;

      // let resNonce = await axios.post(getNonceUrl, {
      //   publicAddress: address,
      // });
      // let nonce = resNonce.data.data;
      let nonce =
        "Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!";
      try {
        const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(nonce));
        let signature;
        if (provider.provider.signer) {
          signature =
            await provider.provider.signer.connection?.wc.signPersonalMessage([
              wcMessage,
              address,
            ]);
        } else {
          signature = await provider.provider.wc.signPersonalMessage([
            wcMessage,
            address,
          ]);
        }
        // let verifySigUrl =
        //   networkType === "testnet"
        //     ? process.env.REACT_APP_API_URL_VERIFY_SIGNATURE_TESTNET
        //     : process.env.REACT_APP_API_URL_VERIFY_SIGNATURE_MAINNET;
        let verifySigUrl =
          networkType === "testnet"
            ? "https://backend.xanalia.com/auth/login-external-wallet"
            : "https://prod-backend.xanalia.com/auth/login-external-wallet";
        let verification = await axios.post(verifySigUrl, {
          // nonce: nonce,
          signature: signature,
          address,
        });
        localStorage.setItem("userToken", verification.data.access_token);
        localStorage.setItem(
          "cryptoUserAuth",
          JSON.stringify(verification.data.user)
        );
      } catch (err) {
        return;
      }
    }
    localStorage.setItem("accounts", address);
    localStorage.setItem("connectedWith", "walletConnect");

    this.props.setMetaMask(address);
    this.addContract("walletConnect", provider.provider);
  }
  connectWithWallet(calledFor) {
    if (calledFor === "binanceSmartChain") {
      this.connectWithWalletWithBinance();
    } else if (calledFor === "metamask") {
      this.connectWithWalletMetaMask();
    } else if (calledFor === "walletConnect") {
      this.connectWithWalletConnect();
    }

    this.setState({ showWalletConnectDialog: false });
    setTimeout(() => {
      this.setState({ showWarning: false, warningMsg: "" });
    }, 3000);
  }

  componentDidUpdate(prevProps) {
    binanceMainNet = this.props.selectedNetworkChain.networkIdTestNet;
    binanceTestNet = this.props.selectedNetworkChain.networkIdMainNet;
    providerUrl = this.props.selectedNetworkChain.providerUrl;
    window.BinanceChain !== undefined &&
      window.BinanceChain.on("accountsChanged", (acc) => {
        if (this.props.metaMaskAddress !== "" && acc.length > 0) {
          localStorage.removeItem("userConnected");
          localStorage.removeItem("connectedWith");
          localStorage.removeItem("accounts");
          localStorage.removeItem("walletconnect");
          localStorage.removeItem("connectorId");
          localStorage.removeItem("userToken");
          localStorage.removeItem("cryptoUserAuth");
          this.clearReducer();
          this.connectWithWallet("binanceSmartChain");
        }
      });
    const disconnect = localStorage.getItem("disconnect");
    if (disconnect) {
      setTimeout(() => {
        window.location.reload();
        localStorage.removeItem("disconnect");
        localStorage.removeItem("sessionExpire");
      }, 2000);
    }
  }

  handleShowSpinner = () => {
    setTimeout(() => {
      this.setState({ showSpinner: false });
    }, 1000);
  };

  componentDidMount() {
    localStorage.setItem("lang", "en");

    const account = localStorage.getItem("accounts");
    const userlogout = localStorage.getItem("logout");
    const disconnect = localStorage.getItem("disconnect");
    this.handleShowSpinner();
    if (localStorage.getItem("userConnected") === "true") {
      setTimeout(() => {
        const connectedWith = localStorage.getItem("connectedWith");
        if (connectedWith === "metamask") {
          this.connectWithWallet("metamask");
        } else if (connectedWith === "binanceSmartChain") {
          this.connectWithWallet("binanceSmartChain");
        } else if (connectedWith === "walletConnect") {
          this.connectWithWallet("walletConnect");
        }
      }, 600);
    }

    window.ethereum !== undefined &&
      window.ethereum.on("accountsChanged", (acc) => {
        if (this.props.metaMaskAddress !== "" && acc.length > 0) {
          localStorage.removeItem("userConnected");
          localStorage.removeItem("connectedWith");
          localStorage.removeItem("accounts");
          localStorage.removeItem("walletconnect");
          localStorage.removeItem("connectorId");
          localStorage.removeItem("userToken");
          localStorage.removeItem("cryptoUserAuth");
          this.clearReducer();
          this.connectWithWallet("metamask");
        }
      });

    if (!this.props.metaMaskAddress && !account && !userlogout) {
      this.setState({ showWalletConnectDialog: true });
    } else if (userlogout || disconnect) {
      localStorage.removeItem("logout");
    }
  }

  handleConnectedButton() {
    this.setState({ showConnectedModal: true });
  }

  hideConnectedModal() {
    this.setState({ showConnectedModal: false });
  }

  async handleLogout(should, forNetworkChange) {
    if (localStorage.getItem("connectedWith") === "paymentCard") {
      this.setState({ connectedWithWallet: false });
    } else {
      this.setState({ connectedWithWallet: true });
    }

    if (forNetworkChange === true) {
      this.setState({ networkChanged: true });
    } else if (forNetworkChange === false) {
      this.setState({ networkChanged: false });
    }
    setTimeout(() => {
      localStorage.removeItem("userConnected");
      localStorage.removeItem("connectedWith");
      localStorage.removeItem("accounts");
      localStorage.removeItem("walletconnect");
      localStorage.removeItem("connectorId");
      localStorage.setItem("logout", true);
      localStorage.setItem("disconnect", true);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userAuth");
      localStorage.removeItem("withEmail");
      localStorage.removeItem("cryptoUserAuth");
      this.hideConnectedModal();
    });

    const disconnect = localStorage.getItem("disconnect");
    if (disconnect) {
      setTimeout(() => {
        !should && window.location.reload();
      }, 500);
    }
  }

  openProfileDropdown() {
    this.setState({ showProfileDropdown: !this.state.showProfileDropdown });
  }

  render() {
    const user = localStorage.getItem("accounts");
    window.ethereum !== undefined &&
      window.ethereum.on("accountsChanged", (acc) => {
        if (acc.length === 0) {
          this.handleLogout();
        }
      });

    return (
      <React.Fragment>
        <Navbar collapseOnSelect className="header p-0">
          <div className="row header-row">
            <div className=" col-3 logo">
              <a href="https://xana.net/" target="_blank" rel="noreferrer">
                <img className="headerLogo" src={XLogo} alt="logo" />
              </a>
            </div>
            <div className="col-9 headerOption">
              {!localStorage.getItem("userAuth") ? (
                <NetworkButton handleLogout={this.handleLogout.bind(this)} />
              ) : undefined}

              {this.props.metaMaskAddress && user ? (
                <span className="my-2 connected-Wallet-btn profile-pix-wrap">
                  <img
                    alt="userImg"
                    onClick={() => {
                      this.handleConnectedButton();
                    }}
                    className="profile-pix"
                    src={
                      JSON.parse(localStorage.getItem("cryptoUserAuth"))?.avatar
                        ? JSON.parse(localStorage.getItem("cryptoUserAuth"))
                            ?.avatar
                        : `${CDN_LINK}/XETAicon.png?tr=w-86,tr=h-86`
                    }
                  />
                </span>
              ) : this.state.showSpinner ? (
                <div className="Spinner-btn my-2">
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    variant="info"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <UnlockButton
                  connectWithWalletConnect={this.connectWithWalletConnect.bind(
                    this
                  )}
                  connectWithWallet={this.connectWithWallet.bind(this)}
                />
              )}
            </div>
          </div>
        </Navbar>

        {this.state.showModal ? (
          <NotAvailableDialog
            show={this.state.showModal}
            hideShow={() => this.setState({ showModal: false })}
          />
        ) : undefined}
        {this.state.showConnectedModal ? (
          <AlreadyConnectedDialog
            show={this.state.showConnectedModal}
            hideShow={this.hideConnectedModal}
            userAddress={this.props.metaMaskAddress}
            handleLogout={this.handleLogout}
          />
        ) : undefined}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  setAwardTranslation,
  setMetaMask,
  setContract,
  deleteContract,
  deleteMetaMask,
  setLanguage,
  setProvider,
  setLogout,
  setBlockChain,
  deleteBlockChain,
};

const mapStateToProps = (state, ownProps) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,
    contract: state.metaMaskReducer.contract,
    language: state.metaMaskReducer.language,
    loginDetails: state.authReducer,
    selectedNetworkChain: state.blockChainReducer.selectedNetworkChain,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Header)));
