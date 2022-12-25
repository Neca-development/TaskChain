/**
 *  
 */
 export interface IGasReporterConfig {
    coinmarketcap?: string,
	currency: string,
	token: string,
	gasPriceApi:string,
	gasPrice: number,
}


export interface EnvironmentConfiguration {
  gasReporterConfig:IGasReporterConfig
}


export enum NETWORK {
	MAINNET = 1,
  GOERLI = 5
}

