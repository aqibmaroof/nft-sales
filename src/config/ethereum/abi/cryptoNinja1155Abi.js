import { networkType } from "../../networkType.js";

let abi = "";
if (networkType === "testnet") {
  abi = [
    {
      type: "event",
      name: "ClaimNFT",
      inputs: [
        {
          type: "uint256[]",
          name: "tokenIds",
          internalType: "uint256[]",
          indexed: false,
        },
        {
          type: "address",
          name: "buyer",
          internalType: "address",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Initialized",
      inputs: [
        {
          type: "uint8",
          name: "version",
          internalType: "uint8",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          type: "address",
          name: "previousOwner",
          internalType: "address",
          indexed: true,
        },
        {
          type: "address",
          name: "newOwner",
          internalType: "address",
          indexed: true,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "PurchaseNFT",
      inputs: [
        {
          type: "uint256[]",
          name: "tokenIds",
          internalType: "uint256[]",
          indexed: false,
        },
        {
          type: "uint256",
          name: "price",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "paid",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "address",
          name: "seller",
          internalType: "address",
          indexed: false,
        },
        {
          type: "address",
          name: "buyer",
          internalType: "address",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ReserverNFT",
      inputs: [
        {
          type: "uint256",
          name: "price",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "paid",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "address",
          name: "seller",
          internalType: "address",
          indexed: false,
        },
        {
          type: "address",
          name: "buyer",
          internalType: "address",
          indexed: false,
        },
        {
          type: "uint256",
          name: "limit",
          internalType: "uint256",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    { type: "fallback", stateMutability: "payable" },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "_allowAddress",
      inputs: [{ type: "address", name: "", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "pure",
      outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
      name: "_leaf",
      inputs: [
        { type: "address", name: "account", internalType: "address" },
        { type: "uint256", name: "quantity", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "bundleId",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "buy",
      inputs: [
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "uint256", name: "limit", internalType: "uint256" },
        { type: "bool", name: "isLimit", internalType: "bool" },
        { type: "uint256", name: "whiteListType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "claim",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "erc1155Address",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "getAuthor",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "getCreator",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "getMaxSupply",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "getPrice",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
      name: "getRootHash",
      inputs: [
        { type: "uint256", name: "whitelisType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        { type: "uint256", name: "_startTime", internalType: "uint256" },
        { type: "uint256", name: "_endTime", internalType: "uint256" },
      ],
      name: "getSaleDetails",
      inputs: [
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "getUserBoughtCount",
      inputs: [
        { type: "address", name: "_add", internalType: "address" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "initialize",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "isWhitelisted",
      inputs: [
        { type: "address", name: "account", internalType: "address" },
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "uint256", name: "quantity", internalType: "uint256" },
        { type: "uint256", name: "whiteListType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "owner",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "perPurchaseNFTToMint",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "perTransactionLimit",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "preOrder",
      inputs: [
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "uint256", name: "limit", internalType: "uint256" },
        { type: "uint256", name: "whiteListType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "renounceOwnership",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "reservedNFT",
      inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setAuthor",
      inputs: [{ type: "address", name: "_add", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setMaxSupply",
      inputs: [{ type: "uint256", name: "supply", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPerBundleNFTToMint",
      inputs: [{ type: "uint256", name: "nftTomint", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPerTransactionLimit",
      inputs: [{ type: "uint256", name: "nftTomint", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPrice",
      inputs: [{ type: "uint256", name: "price", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setSaleDetails",
      inputs: [
        { type: "uint256", name: "_startTime", internalType: "uint256" },
        { type: "uint256", name: "_endTime", internalType: "uint256" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setStatus",
      inputs: [{ type: "uint256", name: "_status", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setWhitelistRoot",
      inputs: [
        { type: "bytes32", name: "_root", internalType: "bytes32" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
        { type: "bool", name: "isReserve", internalType: "bool" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "status",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "totalSupply",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "transferOwnership",
      inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
    },
    { type: "receive", stateMutability: "payable" },
  ];
} else if (networkType === "mainnet") {
  abi = [
    {
      type: "event",
      name: "ClaimNFT",
      inputs: [
        {
          type: "uint256[]",
          name: "tokenIds",
          internalType: "uint256[]",
          indexed: false,
        },
        {
          type: "address",
          name: "buyer",
          internalType: "address",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Initialized",
      inputs: [
        {
          type: "uint8",
          name: "version",
          internalType: "uint8",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          type: "address",
          name: "previousOwner",
          internalType: "address",
          indexed: true,
        },
        {
          type: "address",
          name: "newOwner",
          internalType: "address",
          indexed: true,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "PurchaseNFT",
      inputs: [
        {
          type: "uint256[]",
          name: "tokenIds",
          internalType: "uint256[]",
          indexed: false,
        },
        {
          type: "uint256",
          name: "price",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "paid",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "address",
          name: "seller",
          internalType: "address",
          indexed: false,
        },
        {
          type: "address",
          name: "buyer",
          internalType: "address",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ReserverNFT",
      inputs: [
        {
          type: "uint256",
          name: "price",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "paid",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "address",
          name: "seller",
          internalType: "address",
          indexed: false,
        },
        {
          type: "address",
          name: "buyer",
          internalType: "address",
          indexed: false,
        },
        {
          type: "uint256",
          name: "limit",
          internalType: "uint256",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    { type: "fallback", stateMutability: "payable" },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "_allowAddress",
      inputs: [{ type: "address", name: "", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "pure",
      outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
      name: "_leaf",
      inputs: [
        { type: "address", name: "account", internalType: "address" },
        { type: "uint256", name: "quantity", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "bundleId",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "buy",
      inputs: [
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "uint256", name: "limit", internalType: "uint256" },
        { type: "bool", name: "isLimit", internalType: "bool" },
        { type: "uint256", name: "whiteListType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "claim",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "erc1155Address",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "getAuthor",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "getCreator",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "getMaxSupply",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "getPrice",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
      name: "getRootHash",
      inputs: [
        { type: "uint256", name: "whitelisType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        { type: "uint256", name: "_startTime", internalType: "uint256" },
        { type: "uint256", name: "_endTime", internalType: "uint256" },
      ],
      name: "getSaleDetails",
      inputs: [
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "getUserBoughtCount",
      inputs: [
        { type: "address", name: "_add", internalType: "address" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "initialize",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "isWhitelisted",
      inputs: [
        { type: "address", name: "account", internalType: "address" },
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "uint256", name: "quantity", internalType: "uint256" },
        { type: "uint256", name: "whiteListType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "owner",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "perPurchaseNFTToMint",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "perTransactionLimit",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "preOrder",
      inputs: [
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "uint256", name: "limit", internalType: "uint256" },
        { type: "uint256", name: "whiteListType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "renounceOwnership",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "reservedNFT",
      inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setAuthor",
      inputs: [{ type: "address", name: "_add", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setMaxSupply",
      inputs: [{ type: "uint256", name: "supply", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPerBundleNFTToMint",
      inputs: [{ type: "uint256", name: "nftTomint", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPerTransactionLimit",
      inputs: [{ type: "uint256", name: "nftTomint", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPrice",
      inputs: [{ type: "uint256", name: "price", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setSaleDetails",
      inputs: [
        { type: "uint256", name: "_startTime", internalType: "uint256" },
        { type: "uint256", name: "_endTime", internalType: "uint256" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setStatus",
      inputs: [{ type: "uint256", name: "_status", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setWhitelistRoot",
      inputs: [
        { type: "bytes32", name: "_root", internalType: "bytes32" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
        { type: "bool", name: "isReserve", internalType: "bool" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "status",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "totalSupply",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "transferOwnership",
      inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
    },
    { type: "receive", stateMutability: "payable" },
  ];
}

export default abi;
