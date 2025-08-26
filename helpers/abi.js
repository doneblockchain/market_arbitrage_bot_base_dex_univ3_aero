// Helpers for exporting ABIs

// Uniswap V3
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")


// Pancakeswap V3
// We use a custom ABI here as Pancakeswap V3 pools has a different swap event emitted
const IPancakeswapV3Pool = [
  {
    "inputs": [],
    "name": "slot0",
    "outputs": [
      { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
      { "internalType": "int24", "name": "tick", "type": "int24" },
      { "internalType": "uint16", "name": "observationIndex", "type": "uint16" },
      { "internalType": "uint16", "name": "observationCardinality", "type": "uint16" },
      { "internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16" },
      { "internalType": "bool", "name": "unlocked", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token0",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "bool", "name": "zeroForOne", "type": "bool" },
      { "internalType": "int256", "name": "amountSpecified", "type": "int256" },
      { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "swap",
    "outputs": [
      { "internalType": "int256", "name": "amount0", "type": "int256" },
      { "internalType": "int256", "name": "amount1", "type": "int256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "int256", "name": "amount0", "type": "int256" },
      { "indexed": false, "internalType": "int256", "name": "amount1", "type": "int256" },
      { "indexed": false, "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
      { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" },
      { "indexed": false, "internalType": "int24", "name": "tick", "type": "int24" }
    ],
    "name": "Swap",
    "type": "event"
  },
  {
  "inputs": [],
  "name": "metadata",
  "outputs": [
    { "internalType": "uint256", "name": "dec0", "type": "uint256" },
    { "internalType": "uint256", "name": "dec1", "type": "uint256" },
    { "internalType": "uint256", "name": "reserve0", "type": "uint256" },
    { "internalType": "uint256", "name": "reserve1", "type": "uint256" },
    { "internalType": "bool", "name": "stable", "type": "bool" },
    { "internalType": "address", "name": "token0", "type": "address" },
    { "internalType": "address", "name": "token1", "type": "address" }
  ],
  "stateMutability": "view",
  "type": "function"
  }

]


module.exports = {
  IUniswapV3Pool: IUniswapV3Pool.abi, // ovoj e uniswapv3
  IPancakeswapV3Pool //vsusnost e aerodrome
}