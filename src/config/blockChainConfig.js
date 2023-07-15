import { networkType } from "./networkType";
//Binance Smart Chain

import LandAddBSC from "./binanceSmartChain/contractAddress/landContractAdd";
import LandAbiBSC from "./binanceSmartChain/abi/landAbi";

import DeemoAddBSC from "./binanceSmartChain/contractAddress/deemoNftAdd";
import DeemoAbiBSC from "./binanceSmartChain/abi/deemoNftAbi";

import CryptoNinja1155AddBSC from "./binanceSmartChain/contractAddress/cryptoNinja1155Add";
import CryptoNinja1155AbiBSC from "./binanceSmartChain/abi/cryptoNinja1155Abi";


//Polygon Chain
import LandAddPOL from "./polygon/contractAddress/landContractAdd";
import LandAbiPOL from "./polygon/abi/landAbi";

import DeemoAddPOL from "./polygon/contractAddress/deemoNftAdd";
import DeemoAbiPOL from "./polygon/abi/deemoNftAbi";

import CryptoNinja1155AddPOL from "./polygon/contractAddress/cryptoNinja1155Add";
import CryptoNinja1155AbiPOL from "./polygon/abi/cryptoNinja1155Abi";


//Ethereum Chain
import LandAddETH from "./ethereum/contractAddress/landContractAdd";
import LandAbiETH from "./ethereum/abi/landAbi";

import breakDownAddETH from "./ethereum/contractAddress/breakDownNftAdd";
import breakDownAbiETH from "./ethereum/abi/breakDownNftAbi";

import DeemoAddETH from "./ethereum/contractAddress/deemoNftAdd";
import DeemoAbiETH from "./ethereum/abi/deemoNftAbi";

import CriptoAddETH from "./ethereum/contractAddress/criptoNinjaAdd";
import CriptoAbiETH from "./ethereum/abi/criptoNinjaAbi";

import CryptoNinja1155AddETH from "./ethereum/contractAddress/cryptoNinja1155Add";
import CryptoNinja1155AbiETH from "./ethereum/abi/cryptoNinja1155Abi";


import LandAddXC from "./xanaChain/contractAddress/landContractAdd";
import LandAbiXC from "./xanaChain/abi/landAbi";

import AstroBoyAddXC from "./xanaChain/contractAddress/astroBoyAdd";
import AstroBoyAbiXC from "./xanaChain/abi/astroBoyAbi";

import CorporateCollectionAddXC from "./xanaChain/contractAddress/corporateCollectionAdd";
import CorporateCollectionAbiXC from "./xanaChain/abi/corporateCollectionAbi";

import CryptoNinja1155AddXC from "./xanaChain/contractAddress/cryptoNinja1155Add";
import CryptoNinja1155AbiXC from "./xanaChain/abi/cryptoNinja1155Abi";


const getRpcUrl = () => {
  const arr = [
    // "https://polygon-mainnet.infura.io/v3/ce70617b31124974a29c2d7c79970142",
    "https://matic-mainnet.chainstacklabs.com",
    // "https://rpc-mainnet.matic.quiknode.pro"
    // "https://polygon-rpc.com/"
  ];

  return arr[Math.floor(Math.random() * 1)];
};

export const blockChainConfig = [
  // {
  //   name: "BinanceNtwk",
  //   key: "binance",
  //   image: `https://ik.imagekit.io/xanalia/Images/binance-chain.svg`,
  //   networkIdTestNet: networkType === "testnet" ? "97" : "56",
  //   networkIdMainNet: networkType === "testnet" ? "97" : "56",

  //   walletName:
  //     networkType === "testnet"
  //       ? "Binance Smart Chain Testnet"
  //       : "Binance Smart Chain Mainnet",
  //   currency: "BNB",
  //   symbol: "bnb",
  //   explorerURL:
  //     networkType === "testnet"
  //       ? "https://testnet.bscscan.com"
  //       : "https://bscscan.com",

  //   providerUrl:
  //     networkType === "testnet"
  //       ? "https://data-seed-prebsc-1-s1.binance.org:8545/"
  //       : "https://bsc-dataseed.binance.org/",
  //   providerUrlTestnet: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  //   providerUrlMainnet: "https://bsc-dataseed.binance.org/",
  //   providerUrlForAliaPrice: "https://bsc-dataseed.binance.org/",
  //   landConConfig: {
  //     add: LandAddBSC,
  //     abi: LandAbiBSC,
  //   },

  //   deemoConConfig: {
  //     add: DeemoAddBSC,
  //     abi: DeemoAbiBSC,
  //   },

  //   breakDownConfig: {
  //     add: breakDownAddETH,
  //     abi: breakDownAbiETH,
  //   },

  //   walletAddressForNonCrypto:
  //     networkType === "testnet"
  //       ? "0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af"
  //       : "0xac940124f5f3b56b0c298cca8e9e098c2cccae2e",
  // },
  // {
  //   name: "polygon",
  //   translationKey: "polygon",
  //   key: "polygon",
  //   image: `https://ik.imagekit.io/xanalia/Images/polygon-chain.png`,
  //   networkIdTestNet: networkType === "testnet" ? "80001" : "137",
  //   networkIdMainNet: networkType === "testnet" ? "80001" : "137",

  //   walletName: networkType === "testnet" ? "Matic Testnet" : "Matic Mainnet",
  //   currency: "MATIC",
  //   symbol: "MATIC",
  //   explorerURL:
  //     networkType === "testnet"
  //       ? "https://matic-mumbai.chainstacklabs.com"
  //       : "https://explorer.matic.network",

  //   providerUrl:
  //     networkType === "testnet"
  //       ? "https://matic-mumbai.chainstacklabs.com"
  //       : getRpcUrl(),
  //   providerUrlTestnet: "https://matic-mumbai.chainstacklabs.com",
  //   providerUrlMainnet: getRpcUrl(),
  //   providerUrlForAliaPrice: getRpcUrl(),

  //   landConConfig: {
  //     add: LandAddPOL,
  //     abi: LandAbiPOL,
  //   },

  // },

  {
    name: "XANAChain",
    translationKey: "xanaChain",
    key: "xanachain",
    // image: `https://xanalia.s3.amazonaws.com/collectionMainData/1648049014980.png?tr=w-86,tr=h-86`,
    image : "https://ik.imagekit.io/xanalia/Images/Logo.png",
    networkIdTestNet: networkType === "testnet" ? "76798" : "8888",
    networkIdMainNet: networkType === "testnet" ? "76798" : "8888",

    walletName:
      networkType === "testnet" ? "XANAChain Testnet" : "XANAChain",
    currency: "XETA",
    symbol: "XETA",
    explorerURL:
      networkType === "testnet"
        ? "https://rinkeby.etherscan.io"
        : "https://xanachain.xana.net",

    providerUrl:
      networkType === "testnet"
        ? "http://39.61.48.164:9653/ext/bc/NkAJMv3F7tjmpX93NZC6feifaBgm2CuDxQsTEHhQxFTYYm16J/rpc"
        : "https://mainnet.xana.net/rpc",
    providerUrlTestnet:
      "http://39.61.48.164:9653/ext/bc/NkAJMv3F7tjmpX93NZC6feifaBgm2CuDxQsTEHhQxFTYYm16J/rpc",
    providerUrlMainnet:
      "https://mainnet.xana.net/rpc",
    providerUrlForAliaPrice:
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",

    landConConfig: {
      add: LandAddXC,
      abi: LandAbiXC,
    },

    deemoConConfig: {
      add: DeemoAddPOL,
      abi: DeemoAbiPOL,
    },

    astroBoyConConfig: {
      add: AstroBoyAddXC,
      abi: AstroBoyAbiXC,
    },

    corporateCollectionConConfig: {
      add: CorporateCollectionAddXC,
      abi: CorporateCollectionAbiXC,
    },

    cryptoNinja1155CollectionConConfig: {
      add: CryptoNinja1155AddXC,
      abi: CryptoNinja1155AbiXC,
    },

    walletAddressForNonCrypto:
      networkType === "testnet"
        ? "0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859"
        : "0xac940124f5f3b56b0c298cca8e9e098c2cccae2e",
  },
  
  // {
  //   name: "ethereum",
  //   translationKey: "ethereum",
  //   key: "ethereum",
  //   image: `https://ik.imagekit.io/xanalia/Images/Ethereum-logo-round.svg`,
  //   networkIdTestNet: networkType === "testnet" ? "5" : "1",
  //   networkIdMainNet: networkType === "testnet" ? "5" : "1",

  //   walletName:
  //     networkType === "testnet" ? "Goerli Test Network" : "Ethereum Mainnet",
  //   currency: "ETH",
  //   symbol: "ETH",
  //   explorerURL:
  //     networkType === "testnet"
  //       ? "https://goerli.etherscan.io"
  //       : "https://etherscan.io",

  //   providerUrl:
  //     networkType === "testnet"
  //       ? "https://goerli.infura.io/v3/e2fddb9deb984ba0b9e9daa116d1702a"
  //       : "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  //   providerUrlTestnet:
  //     "https://goerli.infura.io/v3/e2fddb9deb984ba0b9e9daa116d1702a",
  //   providerUrlMainnet:
  //     "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  //   providerUrlForAliaPrice:
  //     "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",

  //   landConConfig: {
  //     add: LandAddETH,
  //     abi: LandAbiETH,
  //   },

  //   deemoConConfig: {
  //     add: DeemoAddETH,
  //     abi: DeemoAbiETH,
  //   },

  //   criptoNinjaConfig: {
  //     add: CriptoAddETH,
  //     abi: CriptoAbiETH,
  //   },

  //   breakDownConfig: {
  //     add: breakDownAddETH,
  //     abi: breakDownAbiETH,
  //   },

  //   walletAddressForNonCrypto:
  //     networkType === "testnet"
  //       ? "0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859"
  //       : "0xac940124f5f3b56b0c298cca8e9e098c2cccae2e",
  // },
];
