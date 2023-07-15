import React from "react";
import { Button, Modal } from "react-bootstrap";
const Disclaimer = (props) => {
  return (
    <Modal
      className="fade successModalUI disclaimer-popup"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-connect-ui whiteBg successModalBody"
      backdropClassName="custom-backdrop"
      contentClassName="custom-content notavailable-modal"
      centered
      show={props.show}
      onHide={() => props.handleClose(false)}
    >
      <Modal.Header>
        <Modal.Title className="mb-0">disclaimer</Modal.Title>
        <p onClick={() => props.handleClose(false)} className="closeButton">
          x
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="wallet-connect-list">
          <div className="wallet-connect-item">
            <div className="cta-">
              <p>*This NFT is not an investment or speculative product.</p>
              <p>
                {" "}
                *Secondary distribution of NFT occurs due to supply and demand
                among users. As a result, please understand that there is a
                possibility of unsuccessful transactions or the sale amount
                being less than the purchase amount, and please purchase at your
                own risk.
              </p>
              <p>
                *Please note that the contents of the official website and
                official announcements are subject to change even after the
                announcement without prior notice. Also, NFTs with utilities
                that can be used with mobile apps may no longer be available due
                to revisions in Apple Store and Google Store regulations.
                Therefore, please understand that refunds cannot be made due to
                changes in usage or functions after purchase.
              </p>
              <p>
                *Please be assured that we will respond to each case in which
                you are unable to purchase NFTs due to a system malfunction,
                etc. However, please note that we cannot accept requests for
                refunds or compensation in any case.
              </p>
              <p>
                *If you are unable to claim your pre-ordered NFT within the
                specified MINT time period, please note that we will not be able
                to refund or provide compensation for any reason whatsoever.
              </p>
            </div>
            <div className="okbtn">
              <Button onClick={() => props.handleClose(false)}> OK</Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default Disclaimer;
