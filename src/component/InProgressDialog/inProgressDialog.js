import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import "../InProgressDialog/inprogressModal.scss";

function InProgressDialog(props) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  }, []);
  return (
    <Modal show={open} className="inprogressModal">
      <Modal.Header>
        <div 
          className="closebtn"
          onClick={() => {
            setOpen(false);
          }}
        >
          <img src="https://ik.imagekit.io/xanalia/Images/icon-close.svg" alt="close" />
        </div>
      </Modal.Header>

      <Modal.Body>
        <h2>
        <FormattedMessage id={props.heading}></FormattedMessage>
        </h2>
        <p>
          <FormattedMessage id={props.msg}></FormattedMessage>
        </p>
        
          <button
            type="button"
         
            // className="close"
            onClick={() => {
              setOpen(false);
            }}
          >
            <FormattedMessage id="closepopbtn"></FormattedMessage>
            {/* ok */}
          </button>
 
      </Modal.Body>
    </Modal>
  );
}

export default InProgressDialog;
