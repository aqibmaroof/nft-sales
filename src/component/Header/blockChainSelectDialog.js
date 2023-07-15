import React from "react";
import { FormattedMessage } from "react-intl";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { blockChainConfig } from "../../config/blockChainConfig";
import {
  setBlockChain,
  deleteBlockChain,
} from "../../_actions/blockchain.actions";
import { connect } from "react-redux";
import { setChainErrorMsg } from "../../_actions/blockchain.actions";

function WalletSelectDialog(props) {
  const history = useHistory();
  function handleChainChanged(key, selectedChainIndex) {
    if (
      localStorage.getItem("selectedBlockChain").toString() !==
      selectedChainIndex.toString()
    ) {
      sessionStorage.setItem("selectedBlockChain", selectedChainIndex);
      localStorage.setItem("selectedBlockChain", selectedChainIndex);
      props.hideShow();
      if (
        localStorage.getItem("userAuth") ||
        localStorage.getItem("userConnected")
      ) {
        history.push(history?.location?.pathname);
        props.handleLogout(false, true);
      } else {
        // window.location.reload();
        props.setBlockChain(blockChainConfig[selectedChainIndex])
      }
    }
  }

  function onHide() {
    if (props.isChainModalHidable) {
      props.hideShow();
    }
  }

  return (
    <>
      <Modal
        className="connect-modal NetworkswitchUI switch-network-modal_adjust"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui whiteBg NetworkswitchContant"
        backdropClassName="custom-backdrop"
        contentClassName="custom-content custom-ui NetworkswitchBody"
        centered
        show={true}
        onHide={onHide}
        backdrop={props.isChainModalHidable ?"static" : "static"}

      >
        <div className="NetworkswitchHeader">
          <div className="NetworkswitchTitle">
            <FormattedMessage id="switchnetwk"></FormattedMessage>
          </div>
          {props.isChainModalHidable &&
          <div onClick={onHide} className="img"> 

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.9687 6.96973L11.999 10.9395L8.02925 6.96973L6.96875 8.03023L10.9385 12L6.96875 15.9697L8.02925 17.0302L11.999 13.0605L15.9687 17.0302L17.0292 15.9697L13.0595 12L17.0292 8.03023L15.9687 6.96973Z"
                fill="white"
              />
            </svg>
          </div>
       }
        </div>

        <Modal.Body className="p-0">
          <div className="NetworkswitchList">
            {blockChainConfig.map((blockChain, index) => {
              return (
                <div className="NetworkswitchItem binance-modal" key={blockChain.key}>
                  <div
                    className={`cta- ${
                      props.selectedNetworkChain.name === blockChain.name
                        ? "box-select-style active"
                        : "box-select-style"
                    }`}
                    onClick={() => handleChainChanged(blockChain.key, index)}
                  >
                    {props.selectedNetworkChain.name === blockChain.name ? (
                      <img
                        className="checkedIcon"
                        src={`https://ik.imagekit.io/xanalia/Images/checked.svg`}
                        alt="..."
                      />
                    ) : null}

                    <img
                      className="networkIcon"
                      src={blockChain.image}
                      alt="..."
                    />
                    <h5
                      className={`${
                        blockChain.name == "XANAChain" ? "xana-name" : "xana-name"
                      }`}
                    >
                      <FormattedMessage id={blockChain.name} />
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
          {props.errorMsg &&
          <span style={{fontSize:12, color:"red", display:'flex', textAlign:'center'}}>
              {props.errorMsg}
          </span>}
        </Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedNetworkChain: state.blockChainReducer.selectedNetworkChain,
    isChainModalHidable: state.blockChainReducer.isChainModalHidable,
    errorMsg: state.blockChainReducer.errorMsg,
  };
};

export default React.memo(
  connect(mapStateToProps, { setBlockChain, deleteBlockChain })(
    WalletSelectDialog
  )
);
