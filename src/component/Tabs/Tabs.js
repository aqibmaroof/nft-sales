import React, { useState } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Nav } from "react-bootstrap"; 
const TabFilter = ({
  metaMaskAddress,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [selectedTab, setSelectedTab] = useState("my_collection");

  const handleOnTabChange = (value) => {
    const userNonCrypto = localStorage.getItem("userAuth");
    if (value === "my_collection" && !(metaMaskAddress || userNonCrypto)) {
      showConnectPopUp(value);
      return;
    }
  };

  const showConnectPopUp = async (tab) => {
    await document.getElementById("connectWallet")?.click();
    // await this.showTimer(tab);
  };
  return (
    <React.Fragment>
      <Nav variant="tabs" activeKey={selectedTab ? selectedTab : "gallery"}>
        <div className="MobTabViewNav">
          <div className="MobTabViewNav-body">
            <Nav.Item className="my-collection">
              <Nav.Link
                className="active"
                eventKey="my_collection"
                onClick={() =>
                  selectedTab !== "my_collection" &&
                  handleOnTabChange("my_collection")
                }
              >
                <FormattedMessage id="MyCollection" />
              </Nav.Link>
            </Nav.Item>
          </div>
        </div>
      </Nav>
    </React.Fragment>
  );
};


export default injectIntl(TabFilter)
