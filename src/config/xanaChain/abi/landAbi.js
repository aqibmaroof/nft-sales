import { networkType } from "../../networkType.js";

let abi = "";
if (networkType === "testnet") {
  abi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_symbol",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ApprovalCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalToCurrentOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "ApproveToCaller",
      type: "error",
    },
    {
      inputs: [],
      name: "BalanceQueryForZeroAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_mintAmount",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
      ],
      name: "claimRooster",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "InvalidQueryRange",
      type: "error",
    },
    {
      inputs: [],
      name: "MintToZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "MintZeroQuantity",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnerQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFromIncorrectOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToNonERC721ReceiverImplementer",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToZeroAddress",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "collection",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "minter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "tokenURI",
          type: "string",
        },
      ],
      name: "MintWithTokenURI",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "userAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "rarity",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "size",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "end",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isDiscount",
          type: "bool",
        },
      ],
      name: "_mintCommon",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "userAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "rarity",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "size",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "end",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isDiscount",
          type: "bool",
        },
      ],
      name: "_mintLand",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_mintAmount",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
      ],
      name: "freeMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "countNFTs_",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_size",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "rarity",
          type: "string",
        },
      ],
      name: "mintAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_mintAmount",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
      ],
      name: "mintDiscountCommon",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "rarity",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_mintAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_size",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
        {
          internalType: "bool",
          name: "isLimit",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "whitelistType",
          type: "uint256",
        },
      ],
      name: "mintLand",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "typeWhitelist",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "rarity",
          type: "string",
        },
      ],
      name: "removeWhiteList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_newBaseURI",
          type: "string",
        },
      ],
      name: "setBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "percentage",
          type: "uint256",
        },
      ],
      name: "setDiscount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "_nftIds",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "_timestamps",
          type: "uint256[]",
        },
      ],
      name: "setLockUp",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newMaxMintAmount",
          type: "uint256",
        },
      ],
      name: "setMaxMintAmount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "limit",
          type: "uint256",
        },
      ],
      name: "setPerTransactionLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_size",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_cost",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_total",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_rarity",
          type: "string",
        },
      ],
      name: "setRate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_status",
          type: "uint256",
        },
      ],
      name: "setSaleStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_add",
          type: "address",
        },
        {
          internalType: "bool",
          name: "status",
          type: "bool",
        },
      ],
      name: "setTransferAllowed",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "newWhitelistroot",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "typeWhitelist",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "supply",
          type: "uint256",
        },
        {
          internalType: "string[]",
          name: "rarties",
          type: "string[]",
        },
      ],
      name: "setWhitelistRoot",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
      ],
      name: "_leaf",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "_nftLockup",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "_userBought",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "baseURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_size",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "rarity",
          type: "string",
        },
      ],
      name: "calculateDiscount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
      name: "delegates",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "discount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "explicitOwnershipOf",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "startTimestamp",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "burned",
              type: "bool",
            },
          ],
          internalType: "struct ERC721A.TokenOwnership",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]",
        },
      ],
      name: "explicitOwnershipsOf",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "startTimestamp",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "burned",
              type: "bool",
            },
          ],
          internalType: "struct ERC721A.TokenOwnership[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "funcSignatures",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "isTransferAllowed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "typeWhitelist",
          type: "uint256",
        },
      ],
      name: "isWhitelisted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "isWhitelistFor",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxMint",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "perTransactionLimit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "rates",
      outputs: [
        {
          internalType: "uint256",
          name: "cost",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "total",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "sold",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "valid",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "status",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "tokensOfOwner",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "stop",
          type: "uint256",
        },
      ],
      name: "tokensOfOwnerIn",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "whitelistRoot",
      outputs: [
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "supply",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "sold",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "root",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
} else if (networkType === "mainnet") {
  abi = [
    {
      type: "constructor",
      stateMutability: "nonpayable",
      inputs: [
        { type: "string", name: "_name", internalType: "string" },
        { type: "string", name: "_symbol", internalType: "string" },
      ],
    },
    { type: "error", name: "ApprovalCallerNotOwnerNorApproved", inputs: [] },
    { type: "error", name: "ApprovalQueryForNonexistentToken", inputs: [] },
    { type: "error", name: "ApprovalToCurrentOwner", inputs: [] },
    { type: "error", name: "ApproveToCaller", inputs: [] },
    { type: "error", name: "BalanceQueryForZeroAddress", inputs: [] },
    { type: "error", name: "InvalidQueryRange", inputs: [] },
    { type: "error", name: "MintToZeroAddress", inputs: [] },
    { type: "error", name: "MintZeroQuantity", inputs: [] },
    { type: "error", name: "OwnerQueryForNonexistentToken", inputs: [] },
    { type: "error", name: "TransferCallerNotOwnerNorApproved", inputs: [] },
    { type: "error", name: "TransferFromIncorrectOwner", inputs: [] },
    {
      type: "error",
      name: "TransferToNonERC721ReceiverImplementer",
      inputs: [],
    },
    { type: "error", name: "TransferToZeroAddress", inputs: [] },
    {
      type: "event",
      name: "Approval",
      inputs: [
        {
          type: "address",
          name: "owner",
          internalType: "address",
          indexed: true,
        },
        {
          type: "address",
          name: "approved",
          internalType: "address",
          indexed: true,
        },
        {
          type: "uint256",
          name: "tokenId",
          internalType: "uint256",
          indexed: true,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ApprovalForAll",
      inputs: [
        {
          type: "address",
          name: "owner",
          internalType: "address",
          indexed: true,
        },
        {
          type: "address",
          name: "operator",
          internalType: "address",
          indexed: true,
        },
        {
          type: "bool",
          name: "approved",
          internalType: "bool",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "MintWithTokenURI",
      inputs: [
        {
          type: "address",
          name: "collection",
          internalType: "address",
          indexed: true,
        },
        {
          type: "uint256",
          name: "tokenId",
          internalType: "uint256",
          indexed: true,
        },
        {
          type: "address",
          name: "minter",
          internalType: "address",
          indexed: false,
        },
        {
          type: "string",
          name: "tokenURI",
          internalType: "string",
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
      name: "Transfer",
      inputs: [
        {
          type: "address",
          name: "from",
          internalType: "address",
          indexed: true,
        },
        { type: "address", name: "to", internalType: "address", indexed: true },
        {
          type: "uint256",
          name: "tokenId",
          internalType: "uint256",
          indexed: true,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "_mintCommon",
      inputs: [
        {
          type: "address",
          name: "userAddress",
          internalType: "address",
          indexed: false,
        },
        {
          type: "string",
          name: "rarity",
          internalType: "string",
          indexed: false,
        },
        {
          type: "uint256",
          name: "size",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "start",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "end",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "amount",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "price",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "bool",
          name: "isDiscount",
          internalType: "bool",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "_mintLand",
      inputs: [
        {
          type: "address",
          name: "userAddress",
          internalType: "address",
          indexed: false,
        },
        {
          type: "string",
          name: "rarity",
          internalType: "string",
          indexed: false,
        },
        {
          type: "uint256",
          name: "size",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "start",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "end",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "amount",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "uint256",
          name: "price",
          internalType: "uint256",
          indexed: false,
        },
        {
          type: "bool",
          name: "isDiscount",
          internalType: "bool",
          indexed: false,
        },
      ],
      anonymous: false,
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
      name: "_nftLockup",
      inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "_userBought",
      inputs: [
        { type: "uint256", name: "", internalType: "uint256" },
        { type: "address", name: "", internalType: "address" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "approve",
      inputs: [
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "tokenId", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "balanceOf",
      inputs: [{ type: "address", name: "owner", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "string", name: "", internalType: "string" }],
      name: "baseURI",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "calculateDiscount",
      inputs: [
        { type: "uint256", name: "_size", internalType: "uint256" },
        { type: "string", name: "rarity", internalType: "string" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "claimRooster",
      inputs: [
        { type: "uint256", name: "_mintAmount", internalType: "uint256" },
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "delegates",
      inputs: [{ type: "bytes4", name: "", internalType: "bytes4" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "discount",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        {
          type: "tuple",
          name: "",
          internalType: "struct ERC721A.TokenOwnership",
          components: [
            { type: "address", name: "addr", internalType: "address" },
            { type: "uint64", name: "startTimestamp", internalType: "uint64" },
            { type: "bool", name: "burned", internalType: "bool" },
          ],
        },
      ],
      name: "explicitOwnershipOf",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        {
          type: "tuple[]",
          name: "",
          internalType: "struct ERC721A.TokenOwnership[]",
          components: [
            { type: "address", name: "addr", internalType: "address" },
            { type: "uint64", name: "startTimestamp", internalType: "uint64" },
            { type: "bool", name: "burned", internalType: "bool" },
          ],
        },
      ],
      name: "explicitOwnershipsOf",
      inputs: [
        { type: "uint256[]", name: "tokenIds", internalType: "uint256[]" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "freeMint",
      inputs: [
        { type: "uint256", name: "_mintAmount", internalType: "uint256" },
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bytes", name: "", internalType: "bytes" }],
      name: "funcSignatures",
      inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "getApproved",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "isApprovedForAll",
      inputs: [
        { type: "address", name: "owner", internalType: "address" },
        { type: "address", name: "operator", internalType: "address" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "isTransferAllowed",
      inputs: [{ type: "address", name: "", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "isWhitelistFor",
      inputs: [
        { type: "uint256", name: "", internalType: "uint256" },
        { type: "string", name: "", internalType: "string" },
      ],
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
        { type: "uint256", name: "typeWhitelist", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "maxMint",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "mintAdmin",
      inputs: [
        { type: "address", name: "to_", internalType: "address" },
        { type: "uint256", name: "countNFTs_", internalType: "uint256" },
        { type: "uint256", name: "_size", internalType: "uint256" },
        { type: "string", name: "rarity", internalType: "string" },
      ],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "mintDiscountCommon",
      inputs: [
        { type: "uint256", name: "_mintAmount", internalType: "uint256" },
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
      ],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "mintLand",
      inputs: [
        { type: "string", name: "rarity", internalType: "string" },
        { type: "uint256", name: "_mintAmount", internalType: "uint256" },
        { type: "uint256", name: "_size", internalType: "uint256" },
        { type: "bytes32[]", name: "proof", internalType: "bytes32[]" },
        { type: "bool", name: "isLimit", internalType: "bool" },
        { type: "uint256", name: "whitelistType", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "string", name: "", internalType: "string" }],
      name: "name",
      inputs: [],
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
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "ownerOf",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
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
      stateMutability: "view",
      outputs: [
        { type: "uint256", name: "cost", internalType: "uint256" },
        { type: "uint256", name: "total", internalType: "uint256" },
        { type: "uint256", name: "sold", internalType: "uint256" },
        { type: "bool", name: "valid", internalType: "bool" },
      ],
      name: "rates",
      inputs: [
        { type: "uint256", name: "", internalType: "uint256" },
        { type: "string", name: "", internalType: "string" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "removeWhiteList",
      inputs: [
        { type: "uint256", name: "typeWhitelist", internalType: "uint256" },
        { type: "string", name: "rarity", internalType: "string" },
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
      stateMutability: "nonpayable",
      outputs: [],
      name: "safeTransferFrom",
      inputs: [
        { type: "address", name: "from", internalType: "address" },
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "tokenId", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "safeTransferFrom",
      inputs: [
        { type: "address", name: "from", internalType: "address" },
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "tokenId", internalType: "uint256" },
        { type: "bytes", name: "_data", internalType: "bytes" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setApprovalForAll",
      inputs: [
        { type: "address", name: "operator", internalType: "address" },
        { type: "bool", name: "approved", internalType: "bool" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setBaseURI",
      inputs: [{ type: "string", name: "_newBaseURI", internalType: "string" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setDiscount",
      inputs: [
        { type: "uint256", name: "percentage", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setLockUp",
      inputs: [
        { type: "uint256[]", name: "_nftIds", internalType: "uint256[]" },
        { type: "uint256[]", name: "_timestamps", internalType: "uint256[]" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setMaxMintAmount",
      inputs: [
        { type: "uint256", name: "_newMaxMintAmount", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setPerTransactionLimit",
      inputs: [{ type: "uint256", name: "limit", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setRate",
      inputs: [
        { type: "uint256", name: "_size", internalType: "uint256" },
        { type: "uint256", name: "_cost", internalType: "uint256" },
        { type: "uint256", name: "_total", internalType: "uint256" },
        { type: "string", name: "_rarity", internalType: "string" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setSaleStatus",
      inputs: [{ type: "uint256", name: "_status", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setTransferAllowed",
      inputs: [
        { type: "address", name: "_add", internalType: "address" },
        { type: "bool", name: "status", internalType: "bool" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "setWhitelistRoot",
      inputs: [
        { type: "bytes32", name: "newWhitelistroot", internalType: "bytes32" },
        { type: "uint256", name: "typeWhitelist", internalType: "uint256" },
        { type: "uint256", name: "startTime", internalType: "uint256" },
        { type: "uint256", name: "endTime", internalType: "uint256" },
        { type: "uint256", name: "supply", internalType: "uint256" },
        { type: "string[]", name: "rarties", internalType: "string[]" },
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
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "supportsInterface",
      inputs: [{ type: "bytes4", name: "interfaceId", internalType: "bytes4" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "string", name: "", internalType: "string" }],
      name: "symbol",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "string", name: "", internalType: "string" }],
      name: "tokenURI",
      inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256[]", name: "", internalType: "uint256[]" }],
      name: "tokensOfOwner",
      inputs: [{ type: "address", name: "owner", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256[]", name: "", internalType: "uint256[]" }],
      name: "tokensOfOwnerIn",
      inputs: [
        { type: "address", name: "owner", internalType: "address" },
        { type: "uint256", name: "start", internalType: "uint256" },
        { type: "uint256", name: "stop", internalType: "uint256" },
      ],
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
      name: "transferFrom",
      inputs: [
        { type: "address", name: "from", internalType: "address" },
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "tokenId", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "transferOwnership",
      inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        { type: "uint256", name: "startTime", internalType: "uint256" },
        { type: "uint256", name: "endTime", internalType: "uint256" },
        { type: "uint256", name: "supply", internalType: "uint256" },
        { type: "uint256", name: "sold", internalType: "uint256" },
        { type: "bytes32", name: "root", internalType: "bytes32" },
      ],
      name: "whitelistRoot",
      inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "withdraw",
      inputs: [],
    },
  ];
}

export default abi;