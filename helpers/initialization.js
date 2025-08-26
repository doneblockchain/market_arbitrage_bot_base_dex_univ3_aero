require("dotenv").config()
const ethers = require('ethers')

/**
 * This file could be used for initializing some
 * of the main contracts such as the V3 router & 
 * factory. This is also where we initialize the
 * main Arbitrage contract.
 */

const config = require('../config.json')
const IUniswapV3Factory = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json')
const IQuoter = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json')
const ISwapRouter = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
]


const IAerodromeFactory = [
  "function allPoolsLength() external view returns (uint256)",
  "function getPool(address tokenA, address tokenB, bool stable) external view returns (address)",
  "function isPool(address pool) external view returns (bool)",
  "function stableFee() external view returns (uint256)",
  "function volatileFee() external view returns (uint256)",
  "function getFee(address pool, bool _stable) external view returns (uint256)",
  "event PoolCreated(address indexed token0, address indexed token1, bool indexed stable, address pool, uint256)"
]
const IAerodromeQuoter = [
  {
    "type": "constructor",
    "inputs": [
      { "internalType": "address", "name": "_factory", "type": "address" },
      { "internalType": "address", "name": "_factoryV2", "type": "address" },
      { "internalType": "address", "name": "_WETH9", "type": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "WETH9",
    "inputs": [],
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "factory",
    "inputs": [],
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "factoryV2",
    "inputs": [],
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "quoteExactInput",
    "inputs": [
      { "internalType": "bytes", "name": "path", "type": "bytes" },
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" }
    ],
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "uint160[]", "name": "v3SqrtPriceX96AfterList", "type": "uint160[]" },
      { "internalType": "uint32[]", "name": "v3InitializedTicksCrossedList", "type": "uint32[]" },
      { "internalType": "uint256", "name": "v3SwapGasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "quoteExactInputSingleV2",
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenIn", "type": "address" },
          { "internalType": "address", "name": "tokenOut", "type": "address" },
          { "internalType": "bool", "name": "stable", "type": "bool" },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" }
        ],
        "internalType": "struct IMixedRouteQuoterV1.QuoteExactInputSingleV2Params",
        "name": "params",
        "type": "tuple"
      }
    ],
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "quoteExactInputSingleV3",
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenIn", "type": "address" },
          { "internalType": "address", "name": "tokenOut", "type": "address" },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct IMixedRouteQuoterV1.QuoteExactInputSingleV3Params",
        "name": "params",
        "type": "tuple"
      }
    ],
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "uint160", "name": "sqrtPriceX96After", "type": "uint160" },
      { "internalType": "uint32", "name": "initializedTicksCrossed", "type": "uint32" },
      { "internalType": "uint256", "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "uniswapV3SwapCallback",
    "inputs": [
      { "internalType": "int256", "name": "amount0Delta", "type": "int256" },
      { "internalType": "int256", "name": "amount1Delta", "type": "int256" },
      { "internalType": "bytes", "name": "path", "type": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "view"
  }
]



const IAerodromeRouter = [
  {
    "name": "swapExactTokensForTokens",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "amountOutMin", "type": "uint256" },
      { 
        "name": "routes",
        "type": "tuple[]",
        "components": [
          { "name": "from", "type": "address" },
          { "name": "to", "type": "address" },
          { "name": "stable", "type": "bool" },
          { "name": "factory", "type": "address" }
        ]
      },
      { "name": "to", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "outputs": [
      { "name": "amounts", "type": "uint256[]" }
    ]
  },
  {
    "name": "swapExactTokensForETH",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "amountOutMin", "type": "uint256" },
      { 
        "name": "routes",
        "type": "tuple[]",
        "components": [
          { "name": "from", "type": "address" },
          { "name": "to", "type": "address" },
          { "name": "stable", "type": "bool" },
          { "name": "factory", "type": "address" }
        ]
      },
      { "name": "to", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "outputs": [
      { "name": "amounts", "type": "uint256[]" }
    ]
  },
  {
    "name": "swapExactETHForTokens",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "amountOutMin", "type": "uint256" },
      { 
        "name": "routes",
        "type": "tuple[]",
        "components": [
          { "name": "from", "type": "address" },
          { "name": "to", "type": "address" },
          { "name": "stable", "type": "bool" },
          { "name": "factory", "type": "address" }
        ]
      },
      { "name": "to", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "outputs": [
      { "name": "amounts", "type": "uint256[]" }
    ]
  },
  {
    "name": "getAmountsOut",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { 
        "name": "routes",
        "type": "tuple[]",
        "components": [
          { "name": "from", "type": "address" },
          { "name": "to", "type": "address" },
          { "name": "stable", "type": "bool" },
          { "name": "factory", "type": "address" }
        ]
      }
    ],
    "outputs": [
      { "name": "amounts", "type": "uint256[]" }
    ]
  },
  {
    "name": "addLiquidity",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "stable", "type": "bool" },
      { "name": "amountADesired", "type": "uint256" },
      { "name": "amountBDesired", "type": "uint256" },
      { "name": "amountAMin", "type": "uint256" },
      { "name": "amountBMin", "type": "uint256" },
      { "name": "to", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "outputs": [
      { "name": "amountA", "type": "uint256" },
      { "name": "amountB", "type": "uint256" },
      { "name": "liquidity", "type": "uint256" }
    ]
  },
  {
    "name": "removeLiquidity",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "stable", "type": "bool" },
      { "name": "liquidity", "type": "uint256" },
      { "name": "amountAMin", "type": "uint256" },
      { "name": "amountBMin", "type": "uint256" },
      { "name": "to", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "outputs": [
      { "name": "amountA", "type": "uint256" },
      { "name": "amountB", "type": "uint256" }
    ]
  },
  {
    "name": "poolFor",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "stable", "type": "bool" },
      { "name": "_factory", "type": "address" }
    ],
    "outputs": [
      { "name": "pool", "type": "address" }
    ]
  }
]





let provider

if (config.PROJECT_SETTINGS.isLocal) {
  provider = new ethers.WebSocketProvider(`ws://127.0.0.1:8545/`)
} else {
  provider = new ethers.WebSocketProvider(`wss://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
}

// -- SETUP UNISWAP/PANCAKESWAP CONTRACTS -- //
const uniswap = {
  name: "Uniswap V3",
  factory: new ethers.Contract(config.UNISWAP.FACTORY_V3, IUniswapV3Factory.abi, provider),
  quoter: new ethers.Contract(config.UNISWAP.QUOTER_V3, IQuoter.abi, provider),
  router: new ethers.Contract(config.UNISWAP.ROUTER_V3, ISwapRouter, provider)
}

const pancakeswap = {
  name: "Pancakeswap V3",
  factory: new ethers.Contract(config.PANCAKESWAP.FACTORY_V3, IAerodromeFactory, provider),
  quoter: new ethers.Contract(config.PANCAKESWAP.QUOTER_V3, IAerodromeQuoter, provider),
  router: new ethers.Contract(config.PANCAKESWAP.ROUTER_V3, IAerodromeRouter, provider)
}

const IArbitrage = require('../artifacts/contracts/Arbitrage.sol/Arbitrage.json')
const arbitrage = new ethers.Contract(config.PROJECT_SETTINGS.ARBITRAGE_ADDRESS, IArbitrage.abi, provider)

module.exports = {
  provider,
  uniswap,
  pancakeswap,
  arbitrage
}