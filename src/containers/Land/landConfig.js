export const plotTypes = [
  { value: "1x1", key: "1" },
  { value: "2x2", key: "2" },
  { value: "3x3", key: "3" },
  { value: "4x4", key: "4" },
];

export const categories = [
  {
    id: 1,
    name: "Super Rare",
    key: "Super Rare",
    rarity: "Super Rare",
  },
  {
    id: 2,
    name: "Rare",
    key: "Rare",
    rarity: "Rare",
  },
  {
    id: 3,
    name: "Common",
    key: "Common",
    rarity: "Common",
  },
];

export const mainTypes = [
  {
    id: 0,
    name: "Public Sale",
    description: "Public sale of the land is open to all.",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [categories[2]],
  },
  {
    id: 1,
    name: "First Penguine",
    description: "Limited number of users who were selected for FP can be able to participate",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 2,
    name: "Whitelist",
    description:
      "Sales round for all whitelist winners including XETA staking, SWEEP widget, transfer, etc.",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [categories[1], categories[2]],
  },
  {
    id: 3,
    name: "Whitelist B",
    description:
      "Only available to SWEEP widget Land Whitelist winners",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [categories[2]],
  },
  {
    id: 4,
    name: "Discounted",
    description: "Only available for XETA Staking Land Discount winners",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: [plotTypes[0]],
    rarities: [categories[2]],
  },

  {
    id: 5,
    name: "Free Mint",
    description: "Only users who had won the Land NFT can able to preform free mint at XETA Staking.",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: [plotTypes[0]],
    rarities: [categories[2]],
  },

  {
    id: 6,
    name: "Claim Rooster",
    description: "Only users who had won the Land NFT can able to preform free mint at XETA Staking.",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: [plotTypes[0]],
    rarities: [categories[2]],
  },
  
];

// export const categories = [
//   {
//     id: 1,
//     name: "Super Rare",
//     key: "Super Rare",
//     rarity: "Super Rare",
//     limit: true,
//     rarityType: "SR",
//   },
//   {
//     id: 2,
//     name: "Rare",
//     key: "Rare",
//     rarity: "Rare",
//     limit: true,
//     rarityType: "R",
//   },
//   {
//     id: 3,
//     name: "Common",
//     key: "Common",
//     rarity: "Common",
//     limit: true,
//     rarityType: "C",
//   },

//   {
//     id: 4,
//     name: "Super Rare",
//     key: "Super Rare",
//     rarity: "Super Rare",
//     limit: false,
//     rarityType: "SR",
//   },
//   {
//     id: 5,
//     name: "Rare",
//     key: "Rare",
//     rarity: "Rare",
//     limit: false,
//     rarityType: "R",
//   },
//   {
//     id: 6,
//     name: "Common",
//     key: "Common",
//     rarity: "Common",
//     limit: false,
//     rarityType: "C",
//   },

//   {
//     id: 7,
//     name: "Discounted(Common)",
//     key: "discount",
//     rarity: "Common",
//     limit: true,
//     rarityType: "DIS",
//   },
//   {
//     id: 8,
//     name: "Free Mint(Common)",
//     key: "free",
//     rarity: "Common",
//     limit: true,
//     rarityType: "FM",
//   },
// ];
