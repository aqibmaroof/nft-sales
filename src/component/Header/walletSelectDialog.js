import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Modal } from "react-bootstrap";

function WalletSelectDialog(props) {
  // eslint-disable-next-line no-unused-vars
  const [show, setShow] = useState(false);

  return (
    <>
      <Modal className="connect-modal"
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="connectWalletUi whiteBg" backdropClassName="custom-backdrop" contentClassName="custom-content pb-0"
        centered
        show={!show}
        onHide={() => props.hideShow()}
      >

        <Modal.Body>

          <div className="connectWalletListUI">
            <div className="connectWalletListItem metaMask">
              <div className="cta-" onClick={() => props.connectWithWallet("metamask")}>
                <img src={`https://ik.imagekit.io/xanalia/Images/metmask-icon.svg`} alt="Meta mask" />
                <h5> <FormattedMessage id="metaMask" /></h5>
                <p> <FormattedMessage id="metaMaskConnect" /></p>
              </div>
            </div>

            {/* <div className={`connectWalletListItem second-child binance`}>
              <div className="cta-" onClick={() => props.connectWithWallet("binanceSmartChain")}>
                <img src={`https://ik.imagekit.io/xanalia/Images/binance-icon.svg`} alt="Binance" />
                <h5 style={{ cursor: 'pointer' }} ><FormattedMessage id="binanceChain" /></h5>
                <p><FormattedMessage id="connectbinancechainwallet" /></p>
              </div>
            </div> */}
            <div className="connectWalletListItem" onClick={() => props.connectWithWallet("walletConnect")}>
              <div className="cta-">
                <img src={`https://ik.imagekit.io/xanalia/Images/WalletConnect.svg`} alt="wallet" className="wallet" />
                <h5 style={{ cursor: 'pointer' }} ><FormattedMessage id="walletConnect" /></h5>
                <p className="mb-0"><FormattedMessage id="walletConnection" /></p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(WalletSelectDialog);
