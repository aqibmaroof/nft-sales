import React, { useCallback } from "react";
import CardComponent from "./cardJsonComponent";
import { ListGroup } from "reactstrap"; 

function NewCard(props) {
  const showDetail = useCallback((item) => {
    if (item?.awardPage) {
      props.history.push(`/market-award-details/${item?.id}`);
    } else {
      sessionStorage.setItem("selectedNFT", item.id);
      sessionStorage.setItem("selectedNFTChain", item.nftChain);
      sessionStorage.setItem("setLastPath", props.history.location.pathname);

      if (item.status) {
        props.history.push({
          pathname: `/reviewandmint/${item.id}`,
          state: {
            nftData: item,
          },
        });
        return;
      }
      openStoreItemDialog(item);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openStoreItemDialog = useCallback((nft) => {
    props.openStoreItemDialog(nft);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="hotAuctionUI explorCardUI">
        <ListGroup className="cardListGrup">
          {props.data &&
            props.data.map((nft, index) => {
              return (
                <React.Fragment key={index}>
                  <CardComponent
                    showDetail={showDetail}
                    id={index}
                    nft={nft}
                    showRejectedNfts={props.showRejectedNfts}
                    onChangeInput={props.onChangeInput}
                    openStoreItemDialog={openStoreItemDialog}
                    {...props}
                  />
                </React.Fragment>
              );
            })}
        </ListGroup>
      </div>
    </React.Fragment>
  );
}

export default React.memo(NewCard);
