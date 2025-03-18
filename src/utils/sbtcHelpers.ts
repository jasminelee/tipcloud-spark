import { 
  openSTXTransfer,
  openContractCall,
  UserSession,
  AppConfig,
  showConnect
} from '@stacks/connect';
import {
  FungibleConditionCode,
  PostConditionMode
} from '@stacks/transactions';
import { 
  StacksNetwork,
  STACKS_MAINNET,
  STACKS_TESTNET
} from '@stacks/network';

// Constants
const SBTC_CONTRACT_ADDRESS = 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR';
const SBTC_CONTRACT_NAME = 'wrapped-bitcoin';
const SBTC_ASSET_NAME = 'wrapped-bitcoin';
const SBTC_EXPLORER_URL = 'https://explorer.stacks.co/txid';
const SATOSHIS_PER_BTC = 100000000;

// Network configuration - use testnet for development, change to mainnet for production
const network = STACKS_TESTNET;

// AppConfig for Stacks Connect
const appConfig = new AppConfig(['store_write']);

// Initialize the userSession
const userSession = new UserSession({ appConfig });

/**
 * Convert satoshis to sBTC (1 BTC = 100,000,000 satoshis)
 */
export const satoshisToSBTC = (satoshis: number): number => {
  return satoshis / SATOSHIS_PER_BTC;
};

/**
 * Convert sBTC to satoshis
 */
export const sBTCToSatoshis = (sbtc: number): number => {
  return sbtc * SATOSHIS_PER_BTC;
};

/**
 * Format satoshis for display
 */
export const formatSatoshis = (satoshis: number): string => {
  // Format large numbers with commas
  return satoshis.toLocaleString();
};

/**
 * Calculate the approximate USD value of satoshis
 * This is a simplified version - in production, you would use a price API
 */
export const satoshisToUSD = (satoshis: number): string => {
  // This is just an example price - in production, fetch the current BTC price
  const btcPrice = 65000; // Example BTC price in USD
  const sbtcValue = satoshisToSBTC(satoshis);
  const usdValue = sbtcValue * btcPrice;
  
  // Format USD amount
  return usdValue < 1 
    ? `$${usdValue.toFixed(2)}` 
    : `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Connect to the SBTC wallet
 */
export const connectSBTCWallet = async () => {
  return new Promise<{connected: boolean, addresses?: {symbol: string, address: string}[]}>((resolve) => {
    showConnect({
      appDetails: {
        name: 'TipTune',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: (data) => {
        // Handle the data properly, as it doesn't have an 'addresses' property directly
        const userData = userSession.loadUserData();
        resolve({
          connected: true,
          addresses: [
            {
              symbol: 'STX',
              address: userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet
            }
          ]
        });
      },
      onCancel: () => {
        resolve({
          connected: false
        });
      },
      userSession
    });
  });
};

/**
 * Check if wallet is connected
 */
export const isSBTCWalletConnected = async (): Promise<boolean> => {
  return userSession.isUserSignedIn();
};

/**
 * Get wallet address
 */
export const getWalletAddress = async (): Promise<string | null> => {
  if (!userSession.isUserSignedIn()) {
    return null;
  }
  const userData = userSession.loadUserData();
  return userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;
};

/**
 * Send sBTC tip to a recipient
 */
export interface SendSbtcTipOptions {
  recipientAddress: string;
  satoshiAmount: number;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

export const sendSbtcTip = async ({
  recipientAddress,
  satoshiAmount,
  onFinish,
  onCancel
}: SendSbtcTipOptions) => {
  try {
    if (!userSession.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    // For simplicity, using STX for tips as an example
    // In a real implementation, you would use the sBTC token contract
    openSTXTransfer({
      recipient: recipientAddress,
      amount: satoshiAmount.toString(), // Convert to string as required by the API
      memo: 'Tip from TipTune',
      network,
      appDetails: {
        name: 'TipTune',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: (data) => {
        if (onFinish) onFinish(data);
      },
      onCancel: () => {
        if (onCancel) onCancel();
      },
    });
    } catch (error) {
    console.error('Error sending sBTC tip:', error);
    throw error;
  }
};

/**
 * Get transaction explorer URL
 */
export const getTransactionExplorerUrl = (txId: string): string => {
  return `${SBTC_EXPLORER_URL}/${txId}?chain=mainnet`;
};
