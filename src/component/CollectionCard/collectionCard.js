import React, { useEffect, useState } from "react";
import "./cardUpdate.scss";
import {
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SkeletonText from "../Card/SkeletonText";

const CreatorComponent = (props) => {
  const { item, onlyString } = props;
  if (props?.collectionTitle === "launchpad") {
    return (
      <ListGroupItemText>
        by &nbsp;
        {onlyString
          ? item?.creator
          : props.item?.creatorInfo[0]?.title
          ? props.item?.creatorInfo[0]?.title
          : props.item?.creatorInfo[0]?.username?.slice(0, 6)}
      </ListGroupItemText>
    );
  } else {
    return (
      <ListGroupItemText>
        by &nbsp;
        {item?.blind
          ? item.creator || "Xanalia"
          : props.item?.creatorInfo[0]?.title ||
            props.item?.creatorInfo[0]?.username?.slice(0, 6)
          ? props.item?.creatorInfo[0]?.title
            ? props.item?.creatorInfo[0]?.title
            : props.item?.creatorInfo[0]?.username?.slice(0, 6)
            ? props.item?.creatorInfo[0]?.username?.slice(0, 6)
            : ""
          : "Xanalia"}
      </ListGroupItemText>
    );
  }
};

const CollectinCard = ({ item, isLoading, title, ...props }) => {
  const [cardDimension, setCardDimension] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const width =
      document.getElementsByClassName("cardlistCardImg")[0]?.clientWidth;
    const height =
      document.getElementsByClassName("cardlistCardImg")[0]?.clientHeight;

    setCardDimension({
      width: width,
      height: height,
    });
  }, [item]);

  const PolygonIcon =
    "https://ik.imagekit.io/xanalia/CollectionMainData/Polygon.svg";
  const EthereumIcon =
    "https://ik.imagekit.io/xanalia/Images/Ethereum-logo.svg";
  const BinenceIcon =
    "https://ik.imagekit.io/xanalia/CollectionMainData/BitmapLogo.svg";

  const chainIcon = (chain) => {
    if (chain === "binance")
      return "https://ik.imagekit.io/xanalia/CollectionMainData/BitmapLogo.svg";
    else if (chain === "polygon")
      return "https://ik.imagekit.io/xanalia/CollectionMainData/Polygon.svg";
    else if (chain === "ethereum")
      return "https://ik.imagekit.io/xanalia/Images/Ethereum-logo.svg";
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <ListGroupItem className="SkeletonTheme-collectation-wrap" key={item._id}>
          <div className="SkeletonTheme-collectation">
            <SkeletonTheme color="#D0D0D0" highlightColor="#D8D8D8">
              <div className="loading-cd">
                <Skeleton height={137} width={274} borderRadius={10} />
              </div>
              <div className="loading-profile">
                <Skeleton height={76} width={76} borderRadius={10} />
              </div>
              <div className="loading-center-text">
                <SkeletonText width={200} color="#fff" />
                <SkeletonText width={130} color="#fff" />
              </div>
              <div className="loading-footer">
                <div className="one">
                  <Skeleton height={25} width={25} borderRadius={10} />
                </div>
                <div className="one">
                  <SkeletonText width={100} color="#fff" />
                </div>
                <div className="one">
                  <SkeletonText width={86} color="#fff" />
                </div>
              </div>
            </SkeletonTheme>
          </div>
        </ListGroupItem>
      ) : (
        <ListGroupItem
          key={item._id}
          onClick={(e) => {
            props.handleCollectionClick(item);
          }}
        >
          <div className="cardlistCardImg">
            <img
              // src={`${item?.bannerImage}?tr=w-${cardDimension?.width},tr=h-${cardDimension?.height}`}
              src="https://ik.imagekit.io/xanalia/Images/Roster_Fighter_NFT%20Thumbnail.png"
              className="listCardImg"
              alt=""
            />
          </div>
          <div className="listgroup-body">
            <img
              alt=""
              className="listUserProfile"
              src={`${item?.iconImage}?tr=w-86,tr=h-86`}
            />
            <ListGroupItemHeading>{item?.collectionName}</ListGroupItemHeading>

            {(item.creatorInfo || item.creator) && (
              <CreatorComponent
                item={item}
                collectionTitle={title}
                onlyString={item.creator ? true : false}
              />
            )}
           
          </div>
        </ListGroupItem>
      )}
    </React.Fragment>
  );
};

export default React.memo(CollectinCard);
