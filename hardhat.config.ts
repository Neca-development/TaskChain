import "@nomicfoundation/hardhat-toolbox";


import { NetworkUserConfig } from 'hardhat/types';
import * as dotenv from 'dotenv'

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import "@nomicfoundation/hardhat-chai-matchers";
import '@nomiclabs/hardhat-ethers'
import "solidity-coverage";

import {chainIds, CURRENT_NETWORK_CONFIGURATION,} from './utils/constants';


dotenv.config()


const config: HardhatUserConfig = {
  solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 100,
			},
		},
	},
	networks: {
		hardhat: {},
		mainnet: createEthereumNetworkConfig('mainnet'),
		ropsten: createEthereumNetworkConfig('ropsten'),
		rinkeby: createEthereumNetworkConfig('rinkeby'),
		goerli:{
			url:process.env.GOERLY_RPC_URL,
			accounts:[process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY:'']
		}
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
			rinkeby: process.env.ETHERSCAN_API_KEY as string,
			goerli: process.env.ETHERSCAN_API_KEY as string,
			polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
			polygon: process.env.POLYGONSCAN_API_KEY as string,
		},
	},
};

export default config;


export function getDeploymentAccount(): string[] {
	return process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
}



export function createEthereumNetworkConfig(networkName: keyof typeof chainIds = 'rinkeby'): NetworkUserConfig {
	return {
		url: 'https://' + networkName + '.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
		chainId: chainIds[networkName],
		accounts: getDeploymentAccount(),
	}
}
