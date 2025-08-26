const ethers = require("ethers")
const Big = require('big.js')

/**
 * This file could be used for adding functions you
 * may need to call multiple times or as a way to
 * abstract logic from bot.js. Feel free to add
 * in your own functions you desire here!
 */

const { IUniswapV3Pool, IPancakeswapV3Pool } = require('./abi')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

async function getTokenAndContract(_token0Address, _token1Address, _provider) {
  const token0Contract = new ethers.Contract(_token0Address, IERC20.abi, _provider)
  const token1Contract = new ethers.Contract(_token1Address, IERC20.abi, _provider)

  const token0 = {
    contract: token0Contract,
    address: _token0Address,
    symbol: await token0Contract.symbol(),
    decimals: await token0Contract.decimals(),
  }

  const token1 = {
    contract: token1Contract,
    address: _token1Address,
    symbol: await token1Contract.symbol(),
    decimals: await token1Contract.decimals(),
  }

  return { token0, token1 }
}

async function getPoolAddress(_factory, _token0, _token1, _fee) {
  console.log('1const poolAddress = await _factory.getPool(_token0, _token1, _fee)')
  console.log(`${_factory} ${_token0} ${_token1} ${_fee}`)
  console.log(`${_factory}`)
  const poolAddress = await _factory.getPool(_token0, _token1, _fee)
  console.log('c2onst poolAddress = await _factory.getPool(_token0, _token1, _fee)')
  return poolAddress
}

async function getPoolAddressAerodrome(_factory, _token0, _token1, _isStable) {
  console.log('1const poolAddress = await _factory.getPool(_token0, _token1, _fee)')
  console.log(`${_factory} ${_token0} ${_token1} ${_isStable}`)
  console.log(`${_factory}`)
  const poolAddress = await _factory.getPool(_token0, _token1, _isStable)
  console.log('c2onst poolAddress = await _factory.getPool(_token0, _token1, _isStable)')
  return poolAddress
}

async function getPoolContract(_exchange, _token0, _token1, _fee, _provider) {
  const poolAddress = await getPoolAddress(_exchange.factory, _token0, _token1, _fee)
  const poolABI = _exchange.name === "Uniswap V3" ? IUniswapV3Pool : IPancakeswapV3Pool
  const pool = new ethers.Contract(poolAddress, poolABI, _provider)
  console.log(`Creating pool contract for: ${_exchange.name}`)
  console.log(`Using ABI: ${poolABI === IUniswapV3Pool ? "UniswapV3 ABI" : "Aerodrome Slipstream ABI"}`)
  console.log(`Pool Address: ${poolAddress}`)

  return pool
}

async function getPoolContractAerodrome(_exchange, _token0, _token1, _isStable, _provider) {
  const poolAddress = await getPoolAddressAerodrome(_exchange.factory, _token0, _token1, _isStable)
  const poolABI = IPancakeswapV3Pool
  const pool = new ethers.Contract(poolAddress, poolABI, _provider)
  console.log(`Creating pool contract for: ${_exchange.name}`)
  console.log(`Using ABI: ${poolABI === IUniswapV3Pool ? "UniswapV3 ABI" : "Aerodrome Slipstream ABI"}`)
  console.log(`Pool Address: ${poolAddress}`)

  return pool
}

async function getPoolLiquidity(_factory, _token0, _token1, _fee, _provider) {
  const poolAddress = await getPoolAddress(_factory, _token0.address, _token1.address, _fee)

  const token0Balance = await _token0.contract.balanceOf(poolAddress)
  const token1Balance = await _token1.contract.balanceOf(poolAddress)

  return [token0Balance, token1Balance]
}

async function getPoolLiquidityAerodrome(_factory, _token0, _token1, _isStable, _provider) {
  const poolAddress = await getPoolAddressAerodrome(_factory, _token0.address, _token1.address, _isStable)
  const poolABI = IPancakeswapV3Pool
  const _pool = new ethers.Contract(poolAddress, poolABI, _provider)

  console.log(`Calling metadata on: ${await _pool.getAddress()}`);

  const [dec0, dec1, reserve0, reserve1] = await _pool.metadata();

  console.log(`Reserve0: ${reserve0}, Reserve1: ${reserve1}, Decimals0: ${dec0}, Decimals1: ${dec1}`);

  return [reserve0, reserve1]
}

async function calculatePrice(_pool, _token0, _token1) {
  // Understanding Uniswap V3 prices
  // --> https://blog.uniswap.org/uniswap-v3-math-primer
  console.log(`Calling slot0 on: ${await _pool.getAddress()}`);
  console.log(`ABI is Aerodrome? ${JSON.stringify(_pool.interface.fragments).includes("unlocked")}`);

  // Get sqrtPriceX96...
  const [sqrtPriceX96] = await _pool.slot0()
  console.log(`Calling slot0 on: ${await _pool.getAddress()}`);

  // Get decimalDifference if there is a difference...
  const decimalDifference = Number(Big(_token0.decimals - _token1.decimals).abs())
  const conversion = Big(10).pow(decimalDifference)
  // Calculate rate and price...
  const rate = Big((Big(sqrtPriceX96).div(Big(2 ** 96))) ** Big(2))
  const price = Big(rate).div(Big(conversion)).toString()
  if (price == 0) {
    return Big(rate).mul(Big(conversion)).toString()
  } else {
    return price
  }
}

async function calculateAerodromePrice(_pool, _token0, _token1) {
  console.log(`Calling metadata on: ${await _pool.getAddress()}`);

  const [dec0, dec1, reserve0, reserve1] = await _pool.metadata();

  console.log(`Reserve0: ${reserve0}, Reserve1: ${reserve1}, Decimals0: ${dec0}, Decimals1: ${dec1}`);

  const adjustedReserve0 = Number(reserve0) / Number(dec0);
  const adjustedReserve1 = Number(reserve1) / Number(dec1);

  const price = adjustedReserve1 / adjustedReserve0;

  return price.toString();
}

async function calculateDifference(_uPrice, _sPrice) {
  return (((_uPrice - _sPrice) / _sPrice) * 100).toFixed(2)
}

async function getTicknesAerodrome(_factory, _token0, _token1, _provider) {
  poolAddress = await _factory.getFunction("getPool(address,address,uint24)").staticCall(_token0.address, _token1.address, 0)
  let aerodromePoolABI = IPancakeswapV3Pool
  let pool = new ethers.Contract(poolAddress, aerodromePoolABI, _provider);
  let tickSpacing = await pool.tickSpacing();
  return 0
}

module.exports = {
  getTokenAndContract,
  getPoolAddress,
  getPoolContract,
  getPoolLiquidity,
  getPoolLiquidityAerodrome,
  calculatePrice,
  calculateAerodromePrice,
  calculateDifference,
  getTicknesAerodrome,
  getPoolAddressAerodrome,
  getPoolContractAerodrome
}