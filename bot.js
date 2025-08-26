// -- HANDLE INITIAL SETUP -- //
require("dotenv").config()
require('./helpers/server')
const Database = require('better-sqlite3');
const db = new Database('nonce.db');

const fs = require("fs");

const Big = require('big.js')

const ethers = require("ethers")
const config = require('./config.json')
const { getTokenAndContract, getPoolContract, getPoolLiquidity, getPoolLiquidityAerodrome, calculatePrice, calculateAerodromePrice, getTicknesAerodrome, getPoolAddressAerodrome, getPoolContractAerodrome } = require('./helpers/helpers')
const { provider, uniswap, pancakeswap, arbitrage } = require('./helpers/initialization')

// -- CONFIGURATION VALUES HERE -- //
const ARB_FOR = config.TOKENS.ARB_FOR
const ARB_AGAINST = config.TOKENS.ARB_AGAINST
const POOL_FEE = config.TOKENS.POOL_FEE
const UNITS = config.PROJECT_SETTINGS.PRICE_UNITS
const PRICE_DIFFERENCE = config.PROJECT_SETTINGS.PRICE_DIFFERENCE
const GAS_LIMIT = config.PROJECT_SETTINGS.GAS_LIMIT
const GAS_PRICE = config.PROJECT_SETTINGS.GAS_PRICE
const ETHER_TO_INVEST = config.PROJECT_SETTINGS.ETHER_TO_INVEST
const POOL_FEE_AERODROME = config.TOKENS.POOL_FEE_AERODROME

const POOL_FEE_ETH_BRETT_PANCAKE = 500
const POOL_FEE_ETH_BRETT_AERODROME = false
const POOL_FEE_ETH_DEGEN_AERODROME = false
const POOL_FEE_ETH_DEGEN_PANCAKE = 3000
const POOL_FEE_ETH_AERO_AERODROME = false
const POOL_FEE_ETH_AERO_PANCAKE = 3000
const POOL_FEE_ETH_VIRTUAL_AERODROME = false
const POOL_FEE_ETH_VIRTUAL_PANCAKE = 300
const POOL_FEE_ETH_USDC_AERODROME = false
const POOL_FEE_ETH_USDC_PANCAKE = 100 //
const POOL_FEE_ETH_KTA_AERODROME = false
const POOL_FEE_ETH_cbXRP_AERODROME = false
const POOL_FEE_ETH_cbDOGE_PANCAKE = 2500
const POOL_FEE_ETH_cbDOGE_AERODROME = false
const POOL_FEE_ETH_cbBTC_AERODROME = false
const POOL_FEE_ETH_cbBTC_PANCAKE = 500
const POOL_FEE_ETH_RSC_PANCAKE = 10000
const POOL_FEE_ETH_RSC_AERODROME = false
const POOL_FEE_ETH_uADA_PANCAKE = 3000
const POOL_FEE_ETH_uADA_AERODROME = false
const POOL_FEE_ETH_KEYCAT_PANCAKE = 10000
const POOL_FEE_ETH_KEYCAT_AERODROME = false
const POOL_FEE_ETH_CLUSTR_PANCAKE = 10000
const POOL_FEE_ETH_CLUSTR_AERODROME = false
const POOL_FEE_ETH_SPEC_PANCAKE = 10000
const POOL_FEE_ETH_SPEC_AERODROME = false
const POOL_FEE_ETH_HEURIST_PANCAKE = 10000
const POOL_FEE_ETH_HEURIST_AERODROME = false
const POOL_FEE_ETH_uSOL_PANCAKE = 3000
const POOL_FEE_ETH_uSOL_AERODROME = false
const POOL_FEE_ETH_FLAY_AERODROME = false
const POOL_FEE_ETH_FLAY_PANCAKE = 10000
const POOL_FEE_ETH_FAI_PANCAKE = 10000
const POOL_FEE_ETH_FAI_AERODROME = false
const POOL_FEE_ETH_PEPE_PANCAKE = 10000
const POOL_FEE_ETH_PEPE_AERODROME = false
const POOL_FEE_ETH_KTA_PANCAKE = 10000
const POOL_FEE_ETH_TOSHI_PANCAKE = 10000
const POOL_FEE_ETH_TOSHI_AERODROME = false
const POOL_FEE_ETH_DOGINME_PANCAKE = 10000
const POOL_FEE_ETH_DOGINME_AERODROME = false
const POOL_FEE_ETH_LUM_PANCAKE = 10000
const POOL_FEE_ETH_LUM_AERODROME = false
const POOL_FEE_ETH_HIGHER_PANCAKE = 10000
const POOL_FEE_ETH_HIGHER_AERODROME = false
const POOL_FEE_ETH_TEVA_PANCAKE = 3000
const POOL_FEE_ETH_TEVA_AERODROME = false
const POOL_FEE_ETH_BNKR_PANCAKE = 3000
const POOL_FEE_ETH_BNKR_AERODROME = false
const POOL_FEE_ETH_ZORA_PANCAKE = 10000
const POOL_FEE_ETH_ZORA_AERODROME = false
const POOL_FEE_ETH_WELL_PANCAKE = 10000
const POOL_FEE_ETH_WELL_AERODROME = false
const POOL_FEE_ETH_CLUNKER_PANCAKE = 3000
const POOL_FEE_ETH_CLUNKER_AERODROME = false
const POOL_FEE_ETH_AOT_PANCAKE = 10000
const POOL_FEE_ETH_AOT_AERODROME = false
const POOL_FEE_ETH_ZFI_PANCAKE = 10000
const POOL_FEE_ETH_ZFI_AERODROME = false
const POOL_FEE_ETH_MOG_PANCAKE = 3000
const POOL_FEE_ETH_MOG_AERODROME = false
const POOL_FEE_ETH_SPX_PANCAKE = 10000
const POOL_FEE_ETH_SPX_AERODROME = false
const POOL_FEE_ETH_KAITO_PANCAKE = 3000
const POOL_FEE_ETH_KAITO_AERODROME = false
const POOL_FEE_ETH_MORPHO_PANCAKE = 3000
const POOL_FEE_ETH_MORPHO_AERODROME = false
const POOL_FEE_ETH_OMI_PANCAKE = 3000
const POOL_FEE_ETH_OMI_AERODROME = false
const POOL_FEE_ETH_TOBY_PANCAKE = 10000
const POOL_FEE_ETH_TOBY_AERODROME = false
const POOL_FEE_ETH_AAVE_PANCAKE = 3000
const POOL_FEE_ETH_AAVE_AERODROME = false
const POOL_FEE_ETH_PRIME_PANCAKE = 3000
const POOL_FEE_ETH_PRIME_AERODROME = false
const POOL_FEE_ETH_GIZA_PANCAKE = 10000
const POOL_FEE_ETH_GIZA_AERODROME = false
const POOL_FEE_ETH_VTF_PANCAKE = 3000
const POOL_FEE_ETH_VTF_AERODROME = false
const POOL_FEE_ETH_TYBG_PANCAKE = 10000
const POOL_FEE_ETH_TYBG_AERODROME = false
const POOL_FEE_ETH_RSR_PANCAKE = 10000
const POOL_FEE_ETH_RSR_AERODROME = false
const POOL_FEE_ETH_ANON_PANCAKE = 10000
const POOL_FEE_ETH_ANON_AERODROME = false
const POOL_FEE_ETH_BID_PANCAKE = 10000
const POOL_FEE_ETH_BID_AERODROME = false
const POOL_FEE_ETH_ZRO_PANCAKE = 3000
const POOL_FEE_ETH_ZRO_AERODROME = false
const POOL_FEE_ETH_FLOCK_PANCAKE = 10000
const POOL_FEE_ETH_FLOCK_AERODROME = false
const POOL_FEE_ETH_MIGGLES_PANCAKE = 3000
const POOL_FEE_ETH_MIGGLES_AERODROME = false
const POOL_FEE_ETH_SKI_PANCAKE = 3000
const POOL_FEE_ETH_SKI_AERODROME = false
const POOL_FEE_ETH_LAY_PANCAKE = 10000
const POOL_FEE_ETH_LAY_AERODROME = false
const POOL_FEE_ETH_EMP_PANCAKE = 10000
const POOL_FEE_ETH_EMP_AERODROME = false
//const POOL_FEE_ETH_TOKENSYMBOL_PANCAKE = 10000 
//za aerodrome vnesi false

let run_once = true
let isExecuting = false
let nonce = 0

async function initNonceTable(latestNonce) {
  // 1. Create table if not exists
  db.prepare('CREATE TABLE IF NOT EXISTS nonce (id INTEGER PRIMARY KEY, value INTEGER)').run();  // 2. Insert or update row with the latest nonce
  db.prepare('INSERT INTO nonce (id, value) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET value=?')
      .run(1, latestNonce, latestNonce);
}

async function updateNonceFromProvider() {
  // SETUP ETHERS PROVIDER HERE
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // 1. Get the latest nonce
  const latestNonce = await provider.getTransactionCount(account.address, 'pending');
  console.log("Latest nonce from chain:", latestNonce);

  // 2. Save to SQLite
  await initNonceTable(latestNonce);
  console.log("Nonce saved to DB.");
}

function getNonce() {
    const row = db.prepare('SELECT value FROM nonce WHERE id=1').get();
    return row ? row.value : null;
}

const main = async () => {
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  latestNonce =  await provider.getTransactionCount(account.address, "pending")
  initNonceTable(latestNonce)

  
  const args = process.argv.slice(2); // Ignore first two (node path and script path)

    // Example: parse args like --name=Andonija --age=33
    const parsedArgs = {};
    args.forEach(arg => {
        const [key, value] = arg.split('=');
        if (key.startsWith('--')) {
            parsedArgs[key.slice(2)] = value;
        }
    });

    console.log('Parsed Arguments:', parsedArgs);

    // Access specific values
    if (parsedArgs.token) {
        console.log('Token:', parsedArgs.token);
    }
    // Fetch token0/token1 data
    const { token0, token1 } = await getTokenAndContract(ARB_FOR, parsedArgs.token, provider);

    let uPool 
    let pPool 

    // Get Uniswap and Pancakeswap pool contracts
    if (token1.address == '0x532f27101965dd16442E59d40670FaF5eBB142E4') { //brett
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_BRETT_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_BRETT_AERODROME, provider);
    } else if (token1.address == '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed') { //degen
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_DEGEN_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_DEGEN_AERODROME, provider);
    } else if (token1.address == '0x940181a94A35A4569E4529A3CDfB74e38FD98631') { //aero
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_AERO_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_AERO_AERODROME, provider);
    } else if (token1.address == '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b') { //virtual
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_VIRTUAL_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_VIRTUAL_AERODROME, provider);
    } else if (token1.address == '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913') { //usdc
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_USDC_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_USDC_AERODROME, provider);
    } else if (token1.address == '0xc0634090F2Fe6c6d75e61Be2b949464aBB498973') { //kta
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_KTA_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_KTA_AERODROME, provider);
    } else if (token1.address == '0xcb585250f852C6c6bf90434AB21A00f02833a4af') { //cbXRP
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_cbXRP_AERODROME, provider);
    } else if (token1.address == '0xcbD06E5A2B0C65597161de254AA074E489dEb510') { //cbDOGE
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_cbDOGE_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_cbDOGE_AERODROME, provider);
    } else if (token1.address == '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf') { //cbBTC
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_cbBTC_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_cbBTC_AERODROME, provider);
    } else if (token1.address == '0xFbB75A59193A3525a8825BeBe7D4b56899E2f7e1') { //rsc
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_RSC_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_RSC_AERODROME, provider);
    } else if (token1.address == '0xa3A34A0D9A08CCDDB6Ed422Ac0A28a06731335aA') { //uada
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_uADA_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_uADA_AERODROME, provider);
    } else if (token1.address == '0x9a26F5433671751C3276a065f57e5a02D2817973') { //keycat
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_KEYCAT_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_KEYCAT_AERODROME, provider);
    } else if (token1.address == '0x4b361e60CF256b926bA15f157D69cAc9cD037426') { //clustr
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_CLUSTR_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_CLUSTR_AERODROME, provider);
    } else if (token1.address == '0x96419929d7949D6A801A6909c145C8EEf6A40431') { //spec
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_SPEC_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_SPEC_AERODROME, provider);
    }  else if (token1.address == '0xEF22cb48B8483dF6152e1423b19dF5553BbD818b') { //heurist
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_HEURIST_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_HEURIST_AERODROME, provider);
    }  else if (token1.address == '0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55') { //uSOL
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_uSOL_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_uSOL_AERODROME, provider);
    } else if (token1.address == '0xF1A7000000950C7ad8Aff13118Bb7aB561A448ee') { //flay
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_FLAY_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_FLAY_AERODROME, provider);
    } else if (token1.address == '0xb33Ff54b9F7242EF1593d2C9Bcd8f9df46c77935') { //fai
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_FAI_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_FAI_AERODROME, provider);
    } else if (token1.address == '0x698DC45e4F10966f6D1D98e3bFd7071d8144C233') { //pepe
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_PEPE_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_PEPE_AERODROME, provider);
    } else if (token1.address == '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4') { //toshi
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_TOSHI_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_TOSHI_AERODROME, provider);
    } else if (token1.address == '0x6921B130D297cc43754afba22e5EAc0FBf8Db75b') { //doginme
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_DOGINME_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_DOGINME_AERODROME, provider);
    } else if (token1.address == '0x0fd7a301b51d0a83fcaf6718628174d527b373b6') { //lum
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_LUM_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_LUM_AERODROME, provider);
    } else if (token1.address == '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe') { //higher
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_HIGHER_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_HIGHER_AERODROME, provider);
    } else if (token1.address == '0x00309d634d11541b857f927be91ad2f0bd78894c') { //teva
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_TEVA_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_TEVA_AERODROME, provider);
    } else if (token1.address == '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b') { //bnkr
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_BNKR_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_BNKR_AERODROME, provider);
    } else if (token1.address == '0x1111111111166b7fe7bd91427724b487980afc69') { //zora
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_ZORA_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_ZORA_AERODROME, provider);
    } else if (token1.address == '0xa88594d404727625a9437c3f886c7643872296ae') { //well
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_WELL_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_WELL_AERODROME, provider);
    } else if (token1.address == '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb') { //clunker
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_CLUNKER_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_CLUNKER_AERODROME, provider);
    } else if (token1.address == '0xcc4adb618253ed0d4d8a188fb901d70c54735e03') { //aot
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_AOT_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_AOT_AERODROME, provider);
    } else if (token1.address == '0xd080ed3c74a20250a2c9821885203034acd2d5ae') { //zfi
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_ZFI_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_ZFI_AERODROME, provider);
    } else if (token1.address == '0x2da56acb9ea78330f947bd57c54119debda7af71') { //mog
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_MOG_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_MOG_AERODROME, provider);
    } else if (token1.address == '0x50da645f148798f68ef2d7db7c1cb22a6819bb2c') { //spx
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_SPX_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_SPX_AERODROME, provider);
    } else if (token1.address == '0x98d0baa52b2d063e780de12f615f963fe8537553') { //kaito
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_KAITO_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_KAITO_AERODROME, provider);
    } else if (token1.address == '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842') { //morpho
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_MORPHO_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_MORPHO_AERODROME, provider);
    } else if (token1.address == '0x3792dbdd07e87413247df995e692806aa13d3299') { //omi
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_OMI_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_OMI_AERODROME, provider);
    } else if (token1.address == '0xb8d98a102b0079b69ffbc760c8d857a31653e56e') { //toby
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_TOBY_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_TOBY_AERODROME, provider);
    } else if (token1.address == '0x63706e401c06ac8513145b7687a14804d17f814b') { //aave
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_AAVE_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_AAVE_AERODROME, provider);
    } else if (token1.address == '0xfa980ced6895ac314e7de34ef1bfae90a5add21b') { //prime
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_PRIME_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_PRIME_AERODROME, provider);
    } else if (token1.address == '0x590830dfdf9a3f68afcdde2694773debdf267774') { //giza
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_GIZA_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_GIZA_AERODROME, provider);
    } else if (token1.address == '0x47686106181b3cefe4eaf94c4c10b48ac750370b') { //vtf
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_VTF_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_VTF_AERODROME, provider);
    } else if (token1.address == '0x0d97f261b1e88845184f678e2d1e7a98d9fd38de') { //tybg
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_TYBG_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_TYBG_AERODROME, provider);
    } else if (token1.address == '0xab36452dbac151be02b16ca17d8919826072f64a') { //rsr
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_RSR_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_RSR_AERODROME, provider);
    } else if (token1.address == '0x0db510e79909666d6dec7f5e49370838c16d950f') { //anon
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_ANON_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_ANON_AERODROME, provider);
    } else if (token1.address == '0xa1832f7f4e534ae557f9b5ab76de54b1873e498b') { //bid
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_BID_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_BID_AERODROME, provider);
    } else if (token1.address == '0x6985884c4392d348587b19cb9eaaf157f13271cd') { //zro
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_ZRO_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_ZRO_AERODROME, provider);
    } else if (token1.address == '0x5ab3d4c385b400f3abb49e80de2faf6a88a7b691') { //flock
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_FLOCK_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_FLOCK_AERODROME, provider);
    } else if (token1.address == '0xb1a03eda10342529bbf8eb700a06c60441fef25d') { //miggles
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_MIGGLES_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_MIGGLES_AERODROME, provider);
    } else if (token1.address == '0x768be13e1680b5ebe0024c42c896e3db59ec0149') { //ski
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_SKI_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_SKI_AERODROME, provider);
    } else if (token1.address == '0xb89d354ad1b0d95a48b3de4607f75a8cd710c1ba') { //lay
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_LAY_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_LAY_AERODROME, provider);
    } else if (token1.address == '0x39d5313c3750140e5042887413ba8aa6145a9bd2') { //emp
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_EMP_PANCAKE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_EMP_AERODROME, provider);
    }//NOV TOKEN IZMENI POOL_FEE_ETH_EMP_PANCAKE i POOL_FEE_ETH_EMP_AERODROME
    //} else if (token1.address == '0x39d5313c3750140e5042887413ba8aa6145a9bd2') { //emp
    //   uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE_ETH_EMP_PANCAKE, provider);
    //   pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, POOL_FEE_ETH_EMP_AERODROME, provider);
    //}
    else {
       uPool = await getPoolContract(uniswap, token0.address, token1.address, POOL_FEE, provider);
       pPool = await getPoolContractAerodrome(pancakeswap, token0.address, token1.address, false, provider);
    }

    console.log(`\nUsing ${token1.symbol}/${token0.symbol}`);
    console.log(`Uniswap Pool: ${await uPool.getAddress()}`);
    console.log(`Pancakeswap Pool: ${await pPool.getAddress()}\n`);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

    // Set up event listeners
    uPool.on("Swap", () => eventHandler(uPool, pPool, token0, token1));
    pPool.on("Swap", () => eventHandler(uPool, pPool, token0, token1));

    console.log(`✅ Listening for Swap events on ${token1.symbol}/${token0.symbol}`);
  
  console.log("\nAll listeners set up. Waiting for swap events...\n");

  console.log("Waiting for swap event...\n")
}

const eventHandler = async (_uPool, _pPool, _token0, _token1) => {
    if (!isExecuting) {
      isExecuting = true
    }
    
    console.log(`POOL POOL _uPool=${_uPool.name} _pPool=${_pPool.name} _token0=${_token0.address} _token1=${_token1.address}`)
    console.log('========================DATE=============================')
    console.log('========================DATE=============================')
    console.log('========================DATE=============================')
    console.log('========================DATE=============================')
    const now = new Date()
    console.log(now.toLocaleString())
    console.log('========================DATE=============================')
    console.log('========================DATE=============================')
    console.log('========================DATE=============================')
    console.log(_pPool)

    const priceDifference = await checkPrice([_uPool, _pPool], _token0, _token1)
    const exchangePath = await determineDirection(priceDifference)

    if (!exchangePath) {
      console.log(`No Arbitrage Currently Available\n`)
      console.log(`-----------------------------------------\n`)
      isExecuting = false
      return
    }

    console.log(`Checking Profitability - Potential Arbitrage Currently Available\n`)

    const { isProfitable, amount, pool_fee, token1_needed } = await determineProfitability(exchangePath, _token0, _token1)
    if (!isProfitable) {
      console.log(`No Arbitrage Currently Available\n`)
      console.log(`-----------------------------------------\n`)
      isExecuting = false
      return
    }

    const receipt = await executeTrade(exchangePath, _token0, _token1, ethers.parseEther(amount).toString(), pool_fee, token1_needed)

    isExecuting = false

    console.log("\nWaiting for swap event...\n")

}


const checkPrice = async (_pools, _token0, _token1) => {
  isExecuting = true

  console.log(`Swap Detected, Checking Price...\n`)

  const currentBlock = await provider.getBlockNumber()

  const uPrice = await calculatePrice(_pools[0], _token0, _token1)
  const pPrice = await calculateAerodromePrice(_pools[1], _token0, _token1)
  console.log('uFPrice')
  console.log(uPrice)
  console.log('pPrice')
  console.log(pPrice)
  const uFPrice = Number(uPrice).toString()
  const pFPrice = Number(pPrice).toString()
  const priceDifference = (((uFPrice - pFPrice) / pFPrice) * 100).toString()

  console.log(`Current Block: ${currentBlock}`)
  console.log(`-----------------------------------------`)
  console.log(`UNISWAP     | ${_token1.symbol}/${_token0.symbol}\t | ${uFPrice}`)
  console.log(`PANCAKESWAP | ${_token1.symbol}/${_token0.symbol}\t | ${pFPrice}\n`)
  console.log(`Percentage Difference: ${priceDifference}%\n`)

  return priceDifference
}

const determineDirection = async (_priceDifference) => {
  console.log(`Determining Direction... _priceDifference=${_priceDifference}\n`)

  if (_priceDifference > PRICE_DIFFERENCE) {

    console.log(`Potential Arbitrage Direction:\n`)
    console.log(`Buy\t -->\t ${uniswap.name}`)
    console.log(`Sell\t -->\t ${pancakeswap.name}\n`)
    return [uniswap, pancakeswap]

  } else if (_priceDifference < -(PRICE_DIFFERENCE)) {

    console.log(`Potential Arbitrage Direction:\n`)
    console.log(`Buy\t -->\t ${pancakeswap.name}`)
    console.log(`Sell\t -->\t ${uniswap.name}\n`)
    return [pancakeswap, uniswap]

  } else {
    return null
  }
}

const determineProfitability = async (_exchangePath, _token0, _token1) => {
  console.log(`Determining Profitability...\n`)

  // This is where you can customize your conditions on whether a profitable trade is possible...

  /**
   * The helper file has quite a few functions that come in handy
   * for performing specifc tasks.
   */

  try {
    let pool_fee1 = POOL_FEE
    let pool_fee2 = POOL_FEE
    let minAmountToInvest = 0
    if (_token1.address == '0x532f27101965dd16442E59d40670FaF5eBB142E4') { //brett
      //minAmountToInvest = "2"
      if (_exchangePath[0].name == 'Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_BRETT_PANCAKE
        pool_fee2 = POOL_FEE_ETH_BRETT_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_BRETT_AERODROME
        pool_fee2 = POOL_FEE_ETH_BRETT_PANCAKE
      }
    } else if (_token1.address == '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed') { //degen
      //minAmountToInvest = "0.05"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_DEGEN_PANCAKE
        pool_fee2 = POOL_FEE_ETH_DEGEN_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_DEGEN_AERODROME
        pool_fee2 = POOL_FEE_ETH_DEGEN_PANCAKE
      }
    } else if (_token1.address == '0x940181a94A35A4569E4529A3CDfB74e38FD98631') { //aero
      //minAmountToInvest = "2"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_AERO_PANCAKE
        pool_fee2 = POOL_FEE_ETH_AERO_AERODROME
      } else {
        pool_fee1= POOL_FEE_ETH_AERO_AERODROME
        pool_fee2 = POOL_FEE_ETH_AERO_PANCAKE
      }
    } else if (_token1.address == '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b') { //VIRTUAL
      //minAmountToInvest = "1"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_VIRTUAL_PANCAKE
        pool_fee2 = POOL_FEE_ETH_VIRTUAL_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_VIRTUAL_AERODROME
        pool_fee2 = POOL_FEE_ETH_VIRTUAL_PANCAKE
      }
    } else if (_token1.address == '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913') { //usdc
      //minAmountToInvest = "8"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_USDC_PANCAKE
        pool_fee2 = POOL_FEE_ETH_USDC_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_USDC_AERODROME
        pool_fee2 = POOL_FEE_ETH_USDC_PANCAKE
      }
    } else if (_token1.address == '0xc0634090F2Fe6c6d75e61Be2b949464aBB498973') { //kta
      //minAmountToInvest = "0.05"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_KTA_PANCAKE
        pool_fee2 = POOL_FEE_ETH_KTA_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_KTA_AERODROME
        pool_fee2 = POOL_FEE_ETH_KTA_PANCAKE
      }
    } else if (_token1.address == '0xcb585250f852C6c6bf90434AB21A00f02833a4af') { //cbXRP
      //minAmountToInvest = "0.1"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee2 = POOL_FEE_ETH_cbXRP_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_cbXRP_AERODROME
      }
    } else if (_token1.address == '0xcbD06E5A2B0C65597161de254AA074E489dEb510') { //cbDOGE
      //minAmountToInvest = "0.1"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_cbDOGE_PANCAKE
        pool_fee2 = POOL_FEE_ETH_cbDOGE_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_cbDOGE_AERODROME
        pool_fee2 = POOL_FEE_ETH_cbDOGE_PANCAKE
      }
    } else if (_token1.address == '0x63706e401c06ac8513145b7687A14804d17f814b') { //aave
      //minAmountToInvest = "0.3"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee2 = POOL_FEE_ETH_AAVE_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_AAVE_AERODROME
      }
    } else if (_token1.address == '0x6985884C4392D348587B19cb9eAAf157F13271cd') { //zro
      //minAmountToInvest = "0.3"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_ZRO_PANCAKE
        pool_fee2 = POOL_FEE_ETH_ZRO_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_ZRO_AERODROME
        pool_fee2 = POOL_FEE_ETH_ZRO_PANCAKE
      }
    } else if (_token1.address == '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf') { //cbBTC
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_cbBTC_PANCAKE
        pool_fee2 = POOL_FEE_ETH_cbBTC_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_cbBTC_AERODROME
        pool_fee2 = POOL_FEE_ETH_cbBTC_PANCAKE
      }
    } else if (_token1.address == '0xFbB75A59193A3525a8825BeBe7D4b56899E2f7e1') { //rsc
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_RSC_PANCAKE
        pool_fee2 = POOL_FEE_ETH_RSC_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_RSC_AERODROME
        pool_fee2 = POOL_FEE_ETH_RSC_PANCAKE
      }
    } else if (_token1.address == '0xa3A34A0D9A08CCDDB6Ed422Ac0A28a06731335aA') { //uada
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_uADA_PANCAKE
        pool_fee2 = POOL_FEE_ETH_uADA_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_uADA_AERODROME
        pool_fee2 = POOL_FEE_ETH_uADA_PANCAKE
      }
    } else if (_token1.address == '0x9a26F5433671751C3276a065f57e5a02D2817973') { //keycat
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_KEYCAT_PANCAKE
        pool_fee2 = POOL_FEE_ETH_KEYCAT_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_KEYCAT_AERODROME
        pool_fee2 = POOL_FEE_ETH_KEYCAT_PANCAKE
      }
    } else if (_token1.address == '0x4b361e60CF256b926bA15f157D69cAc9cD037426') { //clustr
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_CLUSTR_PANCAKE
        pool_fee2 = POOL_FEE_ETH_CLUSTR_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_CLUSTR_AERODROME
        pool_fee2 = POOL_FEE_ETH_CLUSTR_PANCAKE
      }
    } else if (_token1.address == '0x96419929d7949D6A801A6909c145C8EEf6A40431') { //spec 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_SPEC_PANCAKE
        pool_fee2 = POOL_FEE_ETH_SPEC_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_SPEC_AERODROME
        pool_fee2 = POOL_FEE_ETH_SPEC_PANCAKE
      }
    } else if (_token1.address == '0xEF22cb48B8483dF6152e1423b19dF5553BbD818b') { //spec 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_HEURIST_PANCAKE
        pool_fee2 = POOL_FEE_ETH_HEURIST_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_HEURIST_AERODROME
        pool_fee2 = POOL_FEE_ETH_HEURIST_PANCAKE
      }
    } else if (_token1.address == '0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55') { //uSOL 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_uSOL_PANCAKE
        pool_fee2 = POOL_FEE_ETH_uSOL_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_uSOL_AERODROME
        pool_fee2 = POOL_FEE_ETH_uSOL_PANCAKE
      }
    } else if (_token1.address == '0xF1A7000000950C7ad8Aff13118Bb7aB561A448ee') { //flay 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_FLAY_PANCAKE
        pool_fee2 = POOL_FEE_ETH_FLAY_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_FLAY_AERODROME
        pool_fee2 = POOL_FEE_ETH_FLAY_PANCAKE
      }
    } else if (_token1.address == '0xb33Ff54b9F7242EF1593d2C9Bcd8f9df46c77935') { //fai 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_FAI_PANCAKE
        pool_fee2 = POOL_FEE_ETH_FAI_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_FAI_AERODROME
        pool_fee2 = POOL_FEE_ETH_FAI_PANCAKE
      }
    } else if (_token1.address == '0x698DC45e4F10966f6D1D98e3bFd7071d8144C233') { //pepe 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_PEPE_PANCAKE
        pool_fee2 = POOL_FEE_ETH_PEPE_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_PEPE_AERODROME
        pool_fee2 = POOL_FEE_ETH_PEPE_PANCAKE
      }
    } else if (_token1.address == '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4') { //toshi 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_TOSHI_PANCAKE
        pool_fee2 = POOL_FEE_ETH_TOSHI_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_TOSHI_AERODROME
        pool_fee2 = POOL_FEE_ETH_TOSHI_PANCAKE
      }
    } else if (_token1.address == '0x6921B130D297cc43754afba22e5EAc0FBf8Db75b') { //doginme 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_DOGINME_PANCAKE
        pool_fee2 = POOL_FEE_ETH_DOGINME_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_DOGINME_AERODROME
        pool_fee2 = POOL_FEE_ETH_DOGINME_PANCAKE
      }
    } else if (_token1.address == '0x0fd7a301b51d0a83fcaf6718628174d527b373b6') { //lum 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_LUM_PANCAKE
        pool_fee2 = POOL_FEE_ETH_LUM_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_LUM_AERODROME
        pool_fee2 = POOL_FEE_ETH_LUM_PANCAKE
      }
    } else if (_token1.address == '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe') { //higher 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_HIGHER_PANCAKE
        pool_fee2 = POOL_FEE_ETH_HIGHER_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_HIGHER_AERODROME
        pool_fee2 = POOL_FEE_ETH_HIGHER_PANCAKE
      }
    } else if (_token1.address == '0x00309d634d11541b857f927be91ad2f0bd78894c') { //teva 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_TEVA_PANCAKE
        pool_fee2 = POOL_FEE_ETH_TEVA_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_TEVA_AERODROME
        pool_fee2 = POOL_FEE_ETH_TEVA_PANCAKE
      }
    } else if (_token1.address == '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b') { //bnkr 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_BNKR_PANCAKE
        pool_fee2 = POOL_FEE_ETH_BNKR_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_BNKR_AERODROME
        pool_fee2 = POOL_FEE_ETH_BNKR_PANCAKE
      }
    } else if (_token1.address == '0x1111111111166b7fe7bd91427724b487980afc69') { //zora 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_ZORA_PANCAKE
        pool_fee2 = POOL_FEE_ETH_ZORA_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_ZORA_AERODROME
        pool_fee2 = POOL_FEE_ETH_ZORA_PANCAKE
      }
    } else if (_token1.address == '0xa88594d404727625a9437c3f886c7643872296ae') { //well 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_WELL_PANCAKE
        pool_fee2 = POOL_FEE_ETH_WELL_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_WELL_AERODROME
        pool_fee2 = POOL_FEE_ETH_WELL_PANCAKE
      }
    } else if (_token1.address == '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb') { //clunker 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_CLUNKER_PANCAKE
        pool_fee2 = POOL_FEE_ETH_CLUNKER_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_CLUNKER_AERODROME
        pool_fee2 = POOL_FEE_ETH_CLUNKER_PANCAKE
      }
    } else if (_token1.address == '0xcc4adb618253ed0d4d8a188fb901d70c54735e03') { //aot 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_AOT_PANCAKE
        pool_fee2 = POOL_FEE_ETH_AOT_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_AOT_AERODROME
        pool_fee2 = POOL_FEE_ETH_AOT_PANCAKE
      }
    } else if (_token1.address == '0xd080ed3c74a20250a2c9821885203034acd2d5ae') { //zfi 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_ZFI_PANCAKE
        pool_fee2 = POOL_FEE_ETH_ZFI_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_ZFI_AERODROME
        pool_fee2 = POOL_FEE_ETH_ZFI_PANCAKE
      }
    } else if (_token1.address == '0x2da56acb9ea78330f947bd57c54119debda7af71') { //mog 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_MOG_PANCAKE
        pool_fee2 = POOL_FEE_ETH_MOG_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_MOG_AERODROME
        pool_fee2 = POOL_FEE_ETH_MOG_PANCAKE
      }
    } else if (_token1.address == '0x50da645f148798f68ef2d7db7c1cb22a6819bb2c') { //spx 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_SPX_PANCAKE
        pool_fee2 = POOL_FEE_ETH_SPX_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_SPX_AERODROME
        pool_fee2 = POOL_FEE_ETH_SPX_PANCAKE
      }
    } else if (_token1.address == '0x98d0baa52b2d063e780de12f615f963fe8537553') { //kaito 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_KAITO_PANCAKE
        pool_fee2 = POOL_FEE_ETH_KAITO_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_KAITO_AERODROME
        pool_fee2 = POOL_FEE_ETH_KAITO_PANCAKE
      }
    } else if (_token1.address == '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842') { //morpho 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_MORPHO_PANCAKE
        pool_fee2 = POOL_FEE_ETH_MORPHO_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_MORPHO_AERODROME
        pool_fee2 = POOL_FEE_ETH_MORPHO_PANCAKE
      }
    } else if (_token1.address == '0x3792dbdd07e87413247df995e692806aa13d3299') { //omi 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_OMI_PANCAKE
        pool_fee2 = POOL_FEE_ETH_OMI_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_OMI_AERODROME
        pool_fee2 = POOL_FEE_ETH_OMI_PANCAKE
      }
    } else if (_token1.address == '0xb8d98a102b0079b69ffbc760c8d857a31653e56e') { //toby 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_TOBY_PANCAKE
        pool_fee2 = POOL_FEE_ETH_TOBY_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_TOBY_AERODROME
        pool_fee2 = POOL_FEE_ETH_TOBY_PANCAKE
      }
    } else if (_token1.address == '0x63706e401c06ac8513145b7687a14804d17f814b') { //aave 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_AAVE_PANCAKE
        pool_fee2 = POOL_FEE_ETH_AAVE_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_AAVE_AERODROME
        pool_fee2 = POOL_FEE_ETH_AAVE_PANCAKE
      }
    } else if (_token1.address == '0xfa980ced6895ac314e7de34ef1bfae90a5add21b') { //prime 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_PRIME_PANCAKE
        pool_fee2 = POOL_FEE_ETH_PRIME_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_PRIME_AERODROME
        pool_fee2 = POOL_FEE_ETH_PRIME_PANCAKE
      }
    } else if (_token1.address == '0x590830dfdf9a3f68afcdde2694773debdf267774') { //giza 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_GIZA_PANCAKE
        pool_fee2 = POOL_FEE_ETH_GIZA_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_GIZA_AERODROME
        pool_fee2 = POOL_FEE_ETH_GIZA_PANCAKE
      }
    } else if (_token1.address == '0x47686106181b3cefe4eaf94c4c10b48ac750370b') { //vtf 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_VTF_PANCAKE
        pool_fee2 = POOL_FEE_ETH_VTF_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_VTF_AERODROME
        pool_fee2 = POOL_FEE_ETH_VTF_PANCAKE
      }
    } else if (_token1.address == '0x0d97f261b1e88845184f678e2d1e7a98d9fd38de') { //tybg 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_TYBG_PANCAKE
        pool_fee2 = POOL_FEE_ETH_TYBG_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_TYBG_AERODROME
        pool_fee2 = POOL_FEE_ETH_TYBG_PANCAKE
      }
    } else if (_token1.address == '0xab36452dbac151be02b16ca17d8919826072f64a') { //rsr 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_RSR_PANCAKE
        pool_fee2 = POOL_FEE_ETH_RSR_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_RSR_AERODROME
        pool_fee2 = POOL_FEE_ETH_RSR_PANCAKE
      }
    } else if (_token1.address == '0x0db510e79909666d6dec7f5e49370838c16d950f') { //anon 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_ANON_PANCAKE
        pool_fee2 = POOL_FEE_ETH_ANON_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_ANON_AERODROME
        pool_fee2 = POOL_FEE_ETH_ANON_PANCAKE
      }
    } else if (_token1.address == '0xa1832f7f4e534ae557f9b5ab76de54b1873e498b') { //bid 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_BID_PANCAKE
        pool_fee2 = POOL_FEE_ETH_BID_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_BID_AERODROME
        pool_fee2 = POOL_FEE_ETH_BID_PANCAKE
      }
    } else if (_token1.address == '0x6985884c4392d348587b19cb9eaaf157f13271cd') { //zro 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_ZRO_PANCAKE
        pool_fee2 = POOL_FEE_ETH_ZRO_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_ZRO_AERODROME
        pool_fee2 = POOL_FEE_ETH_ZRO_PANCAKE
      }
    } else if (_token1.address == '0x5ab3d4c385b400f3abb49e80de2faf6a88a7b691') { //flock 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_FLOCK_PANCAKE
        pool_fee2 = POOL_FEE_ETH_FLOCK_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_FLOCK_AERODROME
        pool_fee2 = POOL_FEE_ETH_FLOCK_PANCAKE
      }
    } else if (_token1.address == '0xb1a03eda10342529bbf8eb700a06c60441fef25d') { //miggles 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_MIGGLES_PANCAKE
        pool_fee2 = POOL_FEE_ETH_MIGGLES_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_MIGGLES_AERODROME
        pool_fee2 = POOL_FEE_ETH_MIGGLES_PANCAKE
      }
    } else if (_token1.address == '0x768be13e1680b5ebe0024c42c896e3db59ec0149') { //ski 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_SKI_PANCAKE
        pool_fee2 = POOL_FEE_ETH_SKI_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_SKI_AERODROME
        pool_fee2 = POOL_FEE_ETH_SKI_PANCAKE
      }
    } else if (_token1.address == '0xb89d354ad1b0d95a48b3de4607f75a8cd710c1ba') { //lay 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_LAY_PANCAKE
        pool_fee2 = POOL_FEE_ETH_LAY_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_LAY_AERODROME
        pool_fee2 = POOL_FEE_ETH_LAY_PANCAKE
      }
    } else if (_token1.address == '0x39d5313c3750140e5042887413ba8aa6145a9bd2') { //emp 
      //minAmountToInvest = "10"
      if (_exchangePath[0].name =='Uniswap V3') {
        pool_fee1 = POOL_FEE_ETH_EMP_PANCAKE
        pool_fee2 = POOL_FEE_ETH_EMP_AERODROME
      } else {
        pool_fee1 = POOL_FEE_ETH_EMP_AERODROME
        pool_fee2 = POOL_FEE_ETH_EMP_PANCAKE
      }
    }
    

    // Fetch liquidity off of the exchange to buy token1 from
    let liquidity
    let liquidityToFindMinAmount
    let secondAerodrome = false
    if (_exchangePath[0].name =='Uniswap V3')
    {
      console.log('liquidity')
      liquidity = await getPoolLiquidity(_exchangePath[0].factory, _token0, _token1, pool_fee1, provider)
      console.log('liquidity')
      liquidityToFindMinAmount = await getPoolLiquidityAerodrome(_exchangePath[1].factory, _token1, _token0, false, provider)
      console.log('liquidityToFindMinAmount')
      secondAerodrome = true
    } else {
      console.log('liquidityToFindMinAmount==========================')
      liquidityToFindMinAmount = await getPoolLiquidityAerodrome(_exchangePath[0].factory, _token0, _token1, false, provider)
      console.log('liquidityToFindMinAmount===============================')
      liquidity = await getPoolLiquidity(_exchangePath[1].factory, _token1, _token0, pool_fee2, provider)
      console.log('liquidity============================')
    }
    
    // An example of using a percentage of the liquidity
    // BigInt doesn't like decimals, so we use Big.js here
    const percentage = Big(0.005)
    let minAmount = 0
    console.log(`liquidity[0]=${liquidity[0]} liquidity[1]=${liquidity[1]} liquidityToFindMinAmount[0]=${liquidityToFindMinAmount[0]} liquidityToFindMinAmount[1]=${liquidityToFindMinAmount[1]}`)
    if (liquidity[1] < liquidityToFindMinAmount[0]) {
      minAmount = Big(liquidity[1]).mul(percentage)
    } else {
      minAmount = Big(liquidityToFindMinAmount[0]).mul(percentage)
    }
    
    
    if(secondAerodrome == true){
      if (liquidity[0] < liquidityToFindMinAmount[1]) {
        minAmountToInvest = Big(liquidity[0]).mul(percentage)
      } else {
        minAmountToInvest = Big(liquidityToFindMinAmount[1]).mul(percentage)
      }
    } else {
      if (liquidity[1] < liquidityToFindMinAmount[0]) {
        minAmountToInvest = Big(liquidity[1]).mul(percentage)
      } else {
        minAmountToInvest = Big(liquidityToFindMinAmount[0]).mul(percentage)
      }
    }
    console.log(`minAmountToInvest=${minAmountToInvest} liquidity[1]=${liquidity[1]} liquidityToFindMinAmount[0]=${liquidityToFindMinAmount[0]} liquidityToFindMinAmount[1]=${liquidityToFindMinAmount[1]}`)
    const decimals = _token1.decimals; // e.g., 18
    

    minAmount = Big(minAmount)
    minAmount = BigInt(minAmount.round().toFixed(0))

    minAmountToInvest = Big(minAmountToInvest)
    minAmountToInvest = BigInt(minAmountToInvest.round().toFixed(0))
    console.log(`minAmountToInvest=${minAmountToInvest} liquidity[1]=${liquidity[1]} liquidityToFindMinAmount[0]=${liquidityToFindMinAmount[0]} liquidityToFindMinAmount[1]=${liquidityToFindMinAmount[1]}`)
    console.log(`${pool_fee1} ${pool_fee2}Minimum Amount Of Token1 We Like minAmount=${minAmount} - BigInt(minAmount.round().toFixed(0))=${minAmount}`)
    // Figure out how much token0 needed for X amount of token1...
    let token1Needed
    let token0Returned
    //const amountIn = minAmountToInvest.toString()
    const amountIn = ethers.parseEther('0.00001').toString()

     const quoteExactInputSingleParamsIn = {
          tokenIn: _token0.address,
          tokenOut: _token1.address,
          fee: pool_fee1,
          amountIn: amountIn,
          sqrtPriceLimitX96: 0
        }
    if (_exchangePath[0].name === "Pancakeswap V3") {
      const QuoteExactInputSingleParamsAerodrome =  {
          tokenIn: _token0.address,
          tokenOut: _token1.address,
          stable: false,
          amountIn: amountIn,
      }
      const amountOut = await _exchangePath[0].quoter.quoteExactInputSingleV2.staticCall(
        QuoteExactInputSingleParamsAerodrome
      )
      token1Needed = amountOut
      } else {
      [token1Needed] = await _exchangePath[0].quoter.quoteExactInputSingle.staticCall(
        quoteExactInputSingleParamsIn
      )
    }
    const quoteExactInputSingleParams = {
        tokenIn: _token1.address,
        tokenOut: _token0.address,
        fee: pool_fee2,
        amountIn: token1Needed,
        sqrtPriceLimitX96: 0
      }
    console.log(`Estimated amount of ${_token0.symbol} needed to buy ${_token1.symbol} on ${_exchangePath[0].name}: ${token1Needed}`)
    if (_exchangePath[1].name === "Pancakeswap V3") {
      const QuoteExactInputSingleParamsAeroDrome = {
          tokenIn: _token1.address,
          tokenOut: _token0.address,
          stable: false,
          amountIn: token1Needed,
      }
      const amountOut = await _exchangePath[1].quoter.quoteExactInputSingleV2.staticCall(
        QuoteExactInputSingleParamsAeroDrome
      )
      token0Returned = amountOut
    } else {
      // Figure out how much token0 returned after swapping X amount of token1
      [token0Returned] = await _exchangePath[1].quoter.quoteExactInputSingle.staticCall(
        quoteExactInputSingleParams
      )
    }
    const ethIn = ethers.formatUnits(amountIn, _token0.decimals)
    const amountOut = ethers.formatUnits(token0Returned, _token0.decimals)

    console.log(`Estimated amount of ${_token0.symbol} needed to buy ${_token1.symbol} on ${_exchangePath[0].name}: ${ethIn}`)
    console.log(`Estimated amount of ${_token0.symbol} returned after swapping ${_token1.symbol} on ${_exchangePath[1].name}: ${amountOut}\n`)

    const amountDifference = amountOut - ethIn
    const estimatedGasCost = GAS_LIMIT * GAS_PRICE

    let pool_fee
    if (pool_fee1 == false) {
      pool_fee = pool_fee2
    } else {
      pool_fee = pool_fee1
    }

    // Fetch account
    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const ethBalanceBefore = ethers.formatUnits(await provider.getBalance(account.address), 18)
    const ethBalanceAfter = ethBalanceBefore - estimatedGasCost

    const wethBalanceBefore = Number(ethers.formatUnits(await _token0.contract.balanceOf(account.address), _token0.decimals))
    const wethBalanceAfter = amountDifference + wethBalanceBefore
    const wethBalanceDifference = wethBalanceAfter - wethBalanceBefore

    const data = {
      'ETH Balance Before': ethBalanceBefore,
      'ETH Balance After': ethBalanceAfter,
      'ETH Spent (gas)': estimatedGasCost,
      '-': {},
      'WETH Balance BEFORE': wethBalanceBefore,
      'WETH Balance AFTER': wethBalanceAfter,
      'WETH Gained/Lost': wethBalanceDifference,
      '-': {},
      'Total Gained/Lost': wethBalanceDifference - estimatedGasCost
    }

    console.table(data)
    console.log()

    // Setup conditions...

    if (Number(amountOut) < Number(ethIn)) {
      updateNonceFromProvider()
      throw new Error("Not enough to pay back flash loan")
    }

    //if (Number(ethBalanceAfter) < 0) {
    //  throw new Error("Not enough ETH for gas fee")
    //}
    return { isProfitable: true, amount: amountIn, pool_fee: pool_fee, token1_needed: token1Needed.toString() }

  } catch (error) {
    console.log(error)
    console.log("")
    return { isProfitable: false, amount: 0, pool_fee: 0, token1_needed: 0 }
  }
}

function estimateAmountOutMin(amountOutMin_known, input_known, input_new, decimalsIn, decimalsOut) {
    if (decimalsIn === decimalsOut) {
        return amountOutMin_known * input_new / input_known;
    } else if (decimalsOut > decimalsIn) {
        const scaleFactor = BigInt(10) ** BigInt(decimalsOut - decimalsIn);
        return amountOutMin_known * input_new * scaleFactor / input_known;
    } else {
        const scaleFactor = BigInt(10) ** BigInt(decimalsIn - decimalsOut);
        return amountOutMin_known * input_new / (input_known * scaleFactor);
    }
}

const executeTrade = async (_exchangePath, _token0, _token1, _amount, pool_fee, token1_needed) => {
  console.log(`Attempting Arbitrage...\n`)

  const routerPath = [
    await _exchangePath[0].router.getAddress(),
    await _exchangePath[1].router.getAddress()
  ]

  const tokenPath = [
    _token0.address,
    _token1.address
  ]

  // Create Signer
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // Fetch token balances before
  const tokenBalanceBefore = await _token0.contract.balanceOf(account.address)
  const ethBalanceBefore = await provider.getBalance(account.address)

  let firstUni
  if ( _exchangePath[0].name == "Uniswap V3" ) {
    firstUni = true
  } else {
    firstUni = false
  }
  const amounts = ['0.00001', '0.0001', '0.001', '0.00002']
  
  for(i = 0; i < amounts.length; i++) {
    try {
  if (config.PROJECT_SETTINGS.isDeployed) {
    run_once = false
    const input_known = ethers.parseUnits(amounts[0], _token0.decimals)
    const amountOutMin_known = BigInt(token1_needed) // replace with your quoter result
    const input_new = ethers.parseUnits(amounts[i], _token0.decimals)
    const estimatedAmountOutMins = estimateAmountOutMin(amountOutMin_known, input_known, input_new, _token0.decimals, _token1.decimals)
    console.log(estimatedAmountOutMins)

    const feeData = await provider.getFeeData();

    console.log("gasPrice:",         feeData.gasPrice.toString());          // Legacy style (wei, BigInt)
    console.log("maxFeePerGas:",     feeData.maxFeePerGas.toString());      // EIP-1559 (wei, BigInt)
    console.log("maxPriorityFeePerGas:", feeData.maxPriorityFeePerGas.toString()); // EIP-1559 (wei, BigInt)

  const gasLimitWithBuffer = BigInt(50000);

// Read
let nonce = getNonce()

    const transaction = await arbitrage.connect(account).executeTrade(
      routerPath,
      tokenPath,
      pool_fee,
      estimatedAmountOutMins,
      ethers.parseEther(amounts[i]),
      firstUni,
      /*{
        gasLimit: gasLimitWithBuffer,
        maxFeePerGas: ethers.parseUnits("5", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"), // tip to miner  
        nonce: await provider.getTransactionCount(account.address, "pending")
      } */
     {
     gasLimit: gasLimitWithBuffer,
        maxFeePerGas: ethers.parseUnits("0.02", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("0.000333", "gwei"), // tip to miner  
        nonce: nonce
     }
    )
    nonce = nonce + 1;
    initNonceTable(nonce);
    console.log("TX Hash:", transaction.hash);
    const receipt = await transaction.wait(0)
    // After sending a tx, increment and update
   }
  } catch (error) {
    console.log(error)
  }
  }
  
  console.log(`Trade Complete:\n`)

  // Fetch token balances after
  const tokenBalanceAfter = await _token0.contract.balanceOf(account.address)
  const ethBalanceAfter = await provider.getBalance(account.address)

  const tokenBalanceDifference = tokenBalanceAfter - tokenBalanceBefore
  const ethBalanceDifference = ethBalanceBefore - ethBalanceAfter

  const data = {
    'ETH Balance Before': ethers.formatUnits(ethBalanceBefore, 18),
    'ETH Balance After': ethers.formatUnits(ethBalanceAfter, 18),
    'ETH Spent (gas)': ethers.formatUnits(ethBalanceDifference.toString(), 18),
    '-': {},
    'WETH Balance BEFORE': ethers.formatUnits(tokenBalanceBefore, _token0.decimals),
    'WETH Balance AFTER': ethers.formatUnits(tokenBalanceAfter, _token0.decimals),
    'WETH Gained/Lost': ethers.formatUnits(tokenBalanceDifference.toString(), _token0.decimals),
    '-': {},
    'Total Gained/Lost': `${ethers.formatUnits((tokenBalanceDifference - ethBalanceDifference).toString(), _token0.decimals)}`
  }

  console.table(data)
  updateNonceFromProvider() 
}


main()