import React, { Component } from "react";
import { networkType } from "../../config/networkType";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { ListGroup } from "react-bootstrap";
import { Card } from "react-bootstrap";

import NewLoader from "../../component/Loader/loader";

import CollectinCard from "../../component/CollectionCard/collectionCard";

let collId = "620e55d8b17f18221dd692b9";
// let collId = "626a31e427d3b54671fd9ea3";

class BlindBoxList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      should: false,
      loader: true,
      shouldLoad: true,
      noDataFound: false,
      blindboxList: [],
    };
    this.handleCollectionClick = this.handleCollectionClick.bind(this);
  }

  getBoxes = async () => {
    let url =
      networkType === "testnet"
        ? `https://testapi.xanalia.com/blindBox/view-blind-series-info?collectionAddress=${collId}&frontend=true`
        : `https://api.xanalia.com/blindBox/view-blind-series-info?collectionAddress=${collId}&frontend=true`;
    let res = await axios.get(url);
    if (res.data.data) {
      this.fetchPackDataForAll(res.data.data);
    }
  };

  componentDidMount() {
    this.getBoxes();
  }

  fetchPackDataForAll = (data) => {
    let nftData = [];
    for (let i = 0; i < data.length; i++) {
      nftData.push({
        ...data[i],
        collectionName: data[i]?.boxURIMetaInfo?.name,
        bannerImage: data[i]?.boxURIMetaInfo?.banner_image,
        iconImage: data[i]?.boxURIMetaInfo?.image,
        items: data[i]?.maxBoxes,
      });
    }

    this.setState({
      shouldLoad: false,
      should: false,
      loader: false,
      blindboxList: nftData,
    });
  };

  handleCollectionClick(nft) {
    this.props.history.push(`/launchpad/astroboyxjapan/${collId}/series/${nft._id}`);
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.loader ? (
          <div className="collectionPageUi" id="home-page">
            <div className="collectionBanner">
              <div className="collectionUiBody">
                <div className="collectionBanner">
                <img
                  src="https://ik.imagekit.io/xanalia/Images/AstroyboyBanner.jpg"
                  alt="bannerimage"
                  className="collectionBannerImg"
                />
              </div>
              </div>
              <Card className="collectionProfileCard">
                <Card.Img
                  variant="top"
                  src="https://ik.imagekit.io/xanalia/CollectionMainData/AstroboyIcon.png?tr=w-113,tr=h-113"
                />
                <Card.Body>
                  <Card.Title>Astroboy : NFTDuel Genesis</Card.Title>
                </Card.Body>
              </Card>
              <>
                {this.state.blindboxList && (
                  <div className="list-container">
                    <div className="launchPadUI hotCollectionUI collectionsUI">
                      <ListGroup className="cardListGrup">
                        {this.state.blindboxList.length > 0 ? (
                          this.state.blindboxList?.map((item) => (
                            <CollectinCard
                              title="hotcollections"
                              isLoading={false}
                              item={item}
                              handleCollectionClick={this.handleCollectionClick.bind(
                                this
                              )}
                            />
                          ))
                        ) : (
                          <>
                            <div className="no-data-main">
                              <img
                                className="no-data-placeholder"
                                src="https://cdn.xanalia.com/assets/images/no-data.svg?tr=orig-true"
                                alt="no-data"
                              />
                              <p className="no-data-text">
                                {" "}
                                <FormattedMessage id={"noDataFound"} />{" "}
                              </p>
                            </div>
                          </>
                        )}
                      </ListGroup>
                    </div>
                  </div>
                )}
              </>
          
          </div>
          </div>
        ) : (
          <div className="loader-box">
            <NewLoader />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default BlindBoxList;
