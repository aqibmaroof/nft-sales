import React from "react";
import { FormattedMessage } from "react-intl";
import "./header.scss"
import { Modal } from "react-bootstrap";
import { CDN_LINK } from "utils/constants";
function LoadingDialog(props) {
  return (
    <>
      <Modal
        size="md"
        className="fade connect-modal"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui whiteBg" 
        backdropClassName="custom-backdrop" 
        contentClassName="custom-content notavailable-modal"
        centered
        show={true}
        onHide={() => props.hideShow()}
      > 
        <Modal.Body>
        <div className="wallet-connect-list">
        <div className="wallet-connect-item" onClick={()=> props.connectWithWallet("walletConnect")}>
        <div className="cta-">
          <img src={`${CDN_LINK}/WalletConnect.svg`} className="wallet" alt="wallet"/>
           <h5 style={{cursor:'pointer'}} ><FormattedMessage id="walletConnect" /></h5>  
           <p><FormattedMessage id="walletConnection" /></p>
           </div>
        </div>
          
        </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(LoadingDialog);
