import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Modal, Button } from "react-bootstrap";
import "./alreadyConnected.scss";
import { useWeb3React } from "@web3-react/core";
import { CDN_LINK } from "utils/constants";

function LoadingDialog(props) {
  const { deactivate } = useWeb3React();
  const [copied, setCopied] = useState(false);

  if (copied) {
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  function handleLogout() {
    deactivate();
    props.handleLogout();
  }

  return (
    <>
      <Modal
        size="md"
        className="p-lg-0 mobileModalSpace"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}
        onHide={() => props.hideShow()}
        dialogClassName="modal-connect-ui-logout connectedWalletUI whiteBg"
        backdropClassName="custom-backdrop"
        contentClassName="custom-content"
      >
        <div className="copymessage"></div>
        <Modal.Header closeButton className="connectedWalletHeader">
          <Modal.Title className="connectedWalleTitle">
            <FormattedMessage id={"Yourwallet"} className="formated-message" />{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="connectedWalletBody">
          <div className="add-wrapper">
            <p className="addresscopy">
              {" "}
              {props.userAddress
                ? props.userAddress.toString().substring(0, 6) +
                "....." +
                props.userAddress
                  .toString()
                  .substr(props.userAddress.length - 4)
                : ""}
            </p>
            <CopyToClipboard
              text={props.userAddress}
              onCopy={() => setCopied(true)}
            >
              <span
                data-balloon="size: 2x"
                data-balloon-pos="up"
                className="db color-inherit link hover-cyan"
              >
                <FormattedMessage id={"Copyaddress"} />
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="copy"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="svg-inline--fa fa-copy fa-w-14 fa-1x"
                  style={{
                    width: 15,
                    height: 14,
                    margin: 5,
                    color: "rgb(0, 153, 255)",
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"
                    className=""
                  ></path>
                </svg>
                {copied ? (
                  <div className="copymessage">
                    <span>
                      <FormattedMessage id="addressCopied" />
                      <svg viewBox="0 -65 434.67733 434">
                        <path d="m152.003906 304.34375c-5.460937 0-10.921875-2.089844-15.082031-6.25l-130.664063-130.667969c-8.34375-8.339843-8.34375-21.824219 0-30.164062 8.339844-8.339844 21.820313-8.339844 30.164063 0l115.582031 115.582031 246.253906-246.25c8.339844-8.339844 21.820313-8.339844 30.164063 0 8.339844 8.34375 8.339844 21.824219 0 30.167969l-261.332031 261.332031c-4.160156 4.160156-9.625 6.25-15.085938 6.25zm0 0" />
                      </svg>
                    </span>
                  </div>
                ) : undefined}
              </span>
            </CopyToClipboard>
          </div>
          <div className="linksCopy">
            <a
              target="_blank"
              href={
                props.selectedNetworkChain.key === "binance"
                  ? `https://bscscan.com/address/${props.userAddress}`
                  : props.selectedNetworkChain.key === "polygon" ?
                    `https://polygonscan.com/address/${props.userAddress}`
                    : props.selectedNetworkChain.key === "ethereum" ?
                      `https://etherscan.com/address/${props.userAddress}` :
                      props.selectedNetworkChain.key === "xanachain" ?
                      `https://xanachain.xana.net/address/${props.userAddress}`:
                      ""
              }
              rel="noreferrer"
            >
              <FormattedMessage
                id={
                  props.selectedNetworkChain.key === "binance"  ?
                   "ViewonBscScan" :
                    props.selectedNetworkChain.key === "ethereum"  ?
                      "View On EtherScan"
                      :props.selectedNetworkChain.key === "polygon"?
                       "ViewonPolygonScan":
                       "ViewonXANAChainScan"
                }
              />
              <img
                src={`${CDN_LINK}/arrow-top.svg`}
                alt="Arrow Top"
                style={{
                  width: 14,
                  height: 14,
                  marginLeft: 5,
                  position: "relative",
                  top: "0",
                  background: "#008FFF",
                }}
              />{" "}
            </a>
          </div>

          <div className="text-center mt-4">
            <Button className="disconnectBtn" variant="primary" onClick={() => handleLogout()}>
              <FormattedMessage id={"disconnect"} />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedNetworkChain: state.blockChainReducer.selectedNetworkChain,
  };
};

export default connect(mapStateToProps, {})(LoadingDialog);
