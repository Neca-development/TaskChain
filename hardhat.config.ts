import * as dotenv from 'dotenv'

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import "@nomicfoundation/hardhat-chai-matchers";
// import '@nomiclabs/hardhat-ethers'
import "solidity-coverage";

import {chainIds, CURRENT_NETWORK_CONFIGURATION,} from './utils/constants';


dotenv.config()


const config: HardhatUserConfig = {
  solidity: {
	compilers: [
		{
		  version: "0.8.9",
		},
		{
		  version: "0.4.17"
		},
	  ],
		settings: {
			optimizer: {
				enabled: true,
				runs: 1000,
			},
		},
	},
	networks: {
		hardhat: {
			forking: {
				url:process.env.MAINNET_RPC_URL || ''
			},
		},
		mainnet:{
			url:process.env.MAINNET_RPC_URL,
			accounts:[process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY:'']
		},
	},
	gasReporter: {
		enabled: true,
		coinmarketcap: CURRENT_NETWORK_CONFIGURATION.gasReporterConfig.coinmarketcap,
		currency: CURRENT_NETWORK_CONFIGURATION.gasReporterConfig.currency,
		token: CURRENT_NETWORK_CONFIGURATION.gasReporterConfig.token,
		gasPriceApi: CURRENT_NETWORK_CONFIGURATION.gasReporterConfig.gasPriceApi,
		gasPrice: CURRENT_NETWORK_CONFIGURATION.gasReporterConfig.gasPrice,
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHERSCAN_API_KEY as string,
		},
	},
};

export default config;

