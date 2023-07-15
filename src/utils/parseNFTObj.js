import { basePriceTokens } from "../config/availableTokens";

export const getBaseCurrency = (chain, order) => {
  let baseCurrency = basePriceTokens.filter(
    (token) => token.chain === chain && token.order === parseInt(order)
  );
  return baseCurrency.length > 0 ? baseCurrency[0].key : "ALIA";
};

export function parseNftObject(obj) {
  let nftObj = {
    name: obj?.metaData?.name,
    image: obj?.metaData?.image ? obj?.metaData?.image : obj?.imageUrl,
    description: obj?.metaData?.description
      ? obj?.metaData?.description
      : obj?.description,
    title: obj?.metaData?.name ? obj?.metaData?.name : obj?.artName,
    type: obj?.metaData?.properties?.type
      ? obj?.metaData?.properties?.type
      : obj?.type,
    thumbnailUrl: obj?.thumbnailUrl ? obj?.thumbnailUrl : obj?.thumbnail,
    nftChain: obj.tokenId.toString().split("-")[0],
  };

  return nftObj;
}
