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

export const Options = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const mainTypes = [
  {
    id: 0,
    name: "Public Sale",
    description: "All the users can able to mint in the Public Sale",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [categories[2]],
  },

  {
    id: 2,
    name: "Pre-order",
    description: "Only whitelist winners can pre-order ahead of time.",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },

  {
    id: 1,
    name: "Whitelist",
    description: "Only Whitelist Winners can able to Mint",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },

  {
    id: 3,
    name: "Pre-ordered NFTs",
    description: "Can only be claimed if pre-ordered in advance.",
    image:
      "https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png",
    plotSizes: plotTypes,
    rarities: [...categories],
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
