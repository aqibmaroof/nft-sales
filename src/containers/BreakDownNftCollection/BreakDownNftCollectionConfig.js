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
    user_bought: 0,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [categories[2]],
  },
  {
    id: 1,
    name: " Allowlist",
    description: "Only winners of the Allowlist will be able to mint.",
    user_bought: 1,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 2,
    name: "Pre-order (Group  A)",
    description: "Only winners of the Allowlist will be able to mint.",
    user_bought: 2,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 6,
    name: "Pre-order (Group B)",
    description: "Only winners of the Allowlist will be able to mint.",
    user_bought: 6,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 7,
    name: "Pre-order (Group C)",
    description: "Only winners of the Allowlist will be able to mint.",
    user_bought: 7,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 4,
    name: " Free Mint",
    description: "Only winners of the Allowlist will be able to free mint.",
    user_bought: 4,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 4,
    name: " Free Mint",
    description: "Only winners of the Allowlist will be able to free mint.",
    user_bought: 4,
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
    plotSizes: plotTypes,
    rarities: [...categories],
  },
  {
    id: 3,
    // name: "Pre-ordered NFTs",
    name: "Claim Pre-ordered NFTs",
    user_bought: 3,
    description: "Can only be claimed if pre-ordered in advance.",
    image: "https://ik.imagekit.io/xanalia/Images/XANAIconlauncherB.png",
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
