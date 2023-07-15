import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAuth from "./useAuth";
import { useWeb3React } from "@web3-react/core";
import "./header.scss"; 
import WalletSelectDialog from "./walletSelectDialog";
import { CDN_LINK } from "utils/constants";

const UnlockButton = (props) => {
  const { login } = useAuth();
  const history = useHistory();
  const { library } = useWeb3React();
  const disconnect = localStorage.getItem("disconnect");
  const [showWalletConnectDialog, setShowWalletConnectDialog] = useState(false);

  useEffect(() => {
    if (disconnect) {
      setTimeout(() => {
        localStorage.removeItem("disconnect");
      }, 3000);
    }
    if (typeof library !== "undefined") {
      props.connectWithWalletConnect(library);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, disconnect]);

  function connectWithWallet(calledFor) {
    if (calledFor === "walletConnect") {
      let success = login();
      if (!success) {
        setShowWalletConnectDialog(false);
      }
      return;
    }
    props.connectWithWallet(calledFor);
    setShowWalletConnectDialog(false);
  }

  useEffect(() => {
    if (
      localStorage.getItem("userConnected") === "true" &&
      localStorage.getItem("connectedWith") === "walletConnect"
    ) {
      login();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {props?.dontShow ? (
        <div
          className="like-count"
          style={{ backgroundColor: "cornflowerblue" }}
          onClick={() =>
            history?.location?.pathname !== "/user-authentication" &&
            setShowWalletConnectDialog(true)
          }
        >
          <img
            className="like-img"
            width="20"
            height="20"
            alt="like"
            src={`${CDN_LINK}/post-like.svg`}
          />
        </div>
      ) : (
        <span
          className="my-2 connect-Wallet-btn btn-container"
          onClick={() =>
            history?.location?.pathname !== "/user-authentication" &&
            setShowWalletConnectDialog(true)
          }
          id="connectWallet"
        >
          <svg
            width="30"
            height="26"
            viewBox="0 0 30 26"
            fill="#151a2f"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 0.9H27C28.1598 0.9 29.1 1.8402 29.1 3V23C29.1 24.1598 28.1598 25.1 27 25.1H3C1.8402 25.1 0.9 24.1598 0.9 23V3C0.9 1.8402 1.8402 0.9 3 0.9Z"
              stroke="black"
              strokeWidth="1.8"
            />
            <path
              d="M21 6.9H29.1V18.1H21C19.8402 18.1 18.9 17.1598 18.9 16V9C18.9 7.8402 19.8402 6.9 21 6.9Z"
              stroke="black"
              strokeWidth="1.8"
            />
            <path
              d="M26.1 12C26.1 13.1598 25.1598 14.1 24 14.1C22.8402 14.1 21.9 13.1598 21.9 12C21.9 10.8402 22.8402 9.9 24 9.9C25.1598 9.9 26.1 10.8402 26.1 12Z"
              stroke="black"
              strokeWidth="1.8"
            />
          </svg>
        </span>
      )}
      {showWalletConnectDialog ? (
        <WalletSelectDialog
          show={showWalletConnectDialog}
          hideShow={() => setShowWalletConnectDialog(false)}
          connectWithWallet={connectWithWallet}
        />
      ) : undefined}
    </>
  );
};

export default React.memo(UnlockButton);
