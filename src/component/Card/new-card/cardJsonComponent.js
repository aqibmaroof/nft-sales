import React, { useEffect } from "react";
import { connect, } from "react-redux";
import { FormattedMessage } from "react-intl";
import { ListGroupItem, ListGroupItemHeading } from "reactstrap";
import LoadingCardJsonComponents from "./loadingCardJsonComponents";
import ImageComponent from "./ImageComponent";

function setDate(endTime) {
  var launchDate = new Date(endTime).toUTCString();
  var currDate = new Date();
  let daysDiff =
    (new Date(launchDate).getTime() - currDate.getTime()) /
    (1000 * 60 * 60 * 24);
  let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
  let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
  let secDiff = (minDiff - parseInt(minDiff)) * 60;
  const daysLeft = parseInt(daysDiff) * 24 * 60 * 60 * 1000;
  const hourLeft = parseInt(hoursDiff) * 60 * 60 * 1000;
  const minLeft = parseInt(minDiff) * 60 * 1000;
  const secLeft = parseInt(secDiff) * 1000;

  let x = "";
  if (daysLeft >= 1) {
    x = daysLeft / (24 * 60 * 60 * 1000) + "d";
  } else if (hourLeft > 0) {
    x = hourLeft / (60 * 60 * 1000) + "h";
  } else if (minLeft > 0) {
    x = minLeft / (60 * 1000) + "m";
  } else if (secLeft > 0) {
    x = secLeft / 1000 + "s";
  } else {
    x = <FormattedMessage id="auctiontimeeneded" />;
  }

  return x;
}

function CardComponent(props) {

  useEffect(() => {
    if (props.nft.newprice && props.nft.newprice.endTime) {
      setDate(parseInt(props.nft.newprice.endTime));
    }
  }, [props.nft.newprice]);

  const nftChainIcon = (chain) => {
    if (props?.nft.isForAward)
      return "https://ik.imagekit.io/xanalia/Images/Ethereum-logo.svg";
    else if (chain === "binance")
      return "https://ik.imagekit.io/xanalia/CollectionMainData/BitmapLogo.svg";
    else if (chain === "polygon")
      return "https://ik.imagekit.io/xanalia/CollectionMainData/Polygon.svg";
    else if (chain === "ethereum")
      return "https://ik.imagekit.io/xanalia/Images/Ethereum-logo.svg";
    else if(chain === "xanachain")
      return "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png?tr=w-86,tr=h-86"
  };

  return (
    <React.Fragment>
      {props?.nft &&
        (props.isLoading ? (
          <LoadingCardJsonComponents />
        ) : (
          <>
            <ListGroupItem key={props?.nft.id} tag="a">
              <div className="cardlistCardImg" id={props.id}>
                <ImageComponent
                  type={props?.nft.type}
                  image={props?.nft.thumbnailUrl ? props?.nft.thumbnailUrl : props?.nft.image}
                  actualFileUrl={props?.nft.image}
                  showDetail={props.showDetail}
                  nft={props?.nft}
                  id={props.id}
                  dimension={{
                    width: 0,
                    height: 0,
                  }}
                  className="listCardImg"
                ></ImageComponent>
              </div>
              <div className="listgroup-body">
                <ListGroupItemHeading>{props?.nft?.name}</ListGroupItemHeading>
                <div className="holderBox">
                  <h6 className="holderName">
                    {props.metaMaskAddress && props.metaMaskAddress.substring(0, 6)}
                  </h6>

                  <h6 className="holderName">
                    Owned : {props.nft?.ownedCopies ? props.nft?.ownedCopies : 1}
                  </h6>
                </div>

                <div className="listgroup-Footer">
                  <img
                    src={nftChainIcon(props?.nft?.nftChain)}
                    className="currencyLogo"
                    alt={"nftChainLogo"}
                  />
                </div>
              </div>
            </ListGroupItem>
          </>
        ))}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,
    language: state.metaMaskReducer.language,
  };
};

export default connect(mapStateToProps)(React.memo(CardComponent));
