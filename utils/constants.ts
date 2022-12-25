import { EnvironmentConfiguration, NETWORK } from "../types";

export const chainIds = {
	// Ethereum
	mainnet: 1,
	ropsten: 3,
	rinkeby: 4,
	kovan: 42,
	goerli: 5,
	// Polygon
	polygon: 1,
	mumbai: 1,
	// Binance
	'bsc-test': 97,
	'bsc-main': 56,
	// Development chains
	ganache: 1337,
	hardhat: 31337,
}


export const ETHERSCAN_API_URL = 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice';


// export const XIL_SUPPORTED_NETWORK = NETWORK.RINKEBY
export const CURRENT_NETWORK = NETWORK.GOERLI;


const NETWORK_CONFIGURATIONS: { [K in NETWORK]: EnvironmentConfiguration } = {
  // * * * * * * * * * * * * * * * * * * *
  // * Rinkeby
  // * * * * * * * * * * * * * * * * * * *
  [NETWORK.GOERLI]: {
    gasReporterConfig:{
	coinmarketcap: process.env.COINMARKETCAP_KEY,
	currency: "ETH",
	token: "ETH",
	gasPriceApi:ETHERSCAN_API_URL,
	gasPrice: 50,
	},
  },

  // * * * * * * * * * * * * * * * * * * *
  // * Mainnet
  // * * * * * * * * * * * * * * * * * * *
  [NETWORK.MAINNET]: {
    gasReporterConfig:{
	coinmarketcap: process.env.COINMARKETCAP_KEY,
	currency: "ETH",
	token: "ETH",
	gasPriceApi:ETHERSCAN_API_URL,
	gasPrice: 50
  },
}
}

// Only export configurations for supported networks
export const CURRENT_NETWORK_CONFIGURATION = NETWORK_CONFIGURATIONS[CURRENT_NETWORK];


