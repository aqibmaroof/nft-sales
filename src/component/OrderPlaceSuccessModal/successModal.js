import React from "react";
import { Modal, Button } from "react-bootstrap";
import './successModal.scss'
import SuccessTickIcon from "../../assets/tick.svg";

function SuccessDialog(props) {

  const handleModalClose = () => {
    props.hideSuccessModal(false)
    return window.location.reload()
  }
  
  return (
    <>
      <Modal
        className="fade successModalUI"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui whiteBg successModalBody"
        backdropClassName="custom-backdrop"
        contentClassName="custom-content notavailable-modal"
        centered
        show={true}
        onHide={() => handleModalClose()}
      >
        <Modal.Header  >
            <img src={SuccessTickIcon} alt="" />
          <Modal.Title>{props.title ? props.title : "ORDER COMPLETED"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wallet-connect-list">
            <div
              className="wallet-connect-item"
              onClick={() => handleModalClose()}
            >
              <div className="cta- body-text-modal">
                <p>
                  {props.msg1 ? 
                  props.msg1
                    :                  
                  "Congrats…Your order has been placed successfully. After successful verification, your NFTs will be visible in the owned tab."
                  }
                </p>
                <p>{props.msg2 ? props.msg2 :"" }</p>
                <p>
                  {props.msg3 ? 
                  props.msg3
                     :"" 
                   }
                </p>
              </div>
              <div className="okbtn">
                <Button onClick={()=>handleModalClose()} > OK</Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(SuccessDialog);
