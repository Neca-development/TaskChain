import { EnvironmentConfiguration, NETWORK } from "../types";

export const ETHERSCAN_API_URL = 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice';


export const CURRENT_NETWORK = NETWORK.MAINNET;


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
	},
  },

  // * * * * * * * * * * * * * * * * * * *
  // * Mainnet
  // * * * * * * * * * * * * * * * * * * *
  [NETWORK.MAINNET]: {
    gasReporterConfig:{
	coinmarketcap: 'af8ddfb6-5886-41fe-80b5-19259a3a03be',
	currency: "ETH",
	token: "ETH",
	gasPriceApi:ETHERSCAN_API_URL,
  },
}
}

// Only export configurations for supported networks
export const CURRENT_NETWORK_CONFIGURATION = NETWORK_CONFIGURATIONS[CURRENT_NETWORK];


