import { 
  openSTXTransfer,
  openContractCall,
  UserSession,
  AppConfig,
  showConnect,
  request,
  getLocalStorage,
  isConnected
} from '@stacks/connect';
import {
  FungibleConditionCode,
  PostConditionMode,
  Cl
} from '@stacks/transactions';
import { 
  StacksNetwork,
  STACKS_MAINNET,
  STACKS_TESTNET
} from '@stacks/network';

// Constants
const SBTC_CONTRACT_ADDRESS = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4';
const SBTC_CONTRACT_NAME = 'sbtc-token';
const SBTC_FULL_CONTRACT = `${SBTC_CONTRACT_ADDRESS}.${SBTC_CONTRACT_NAME}`;
const SBTC_EXPLORER_URL = 'https://explorer.stacks.co/txid';
const SATOSHIS_PER_BTC = 100000000;

// Network configuration - use testnet for development, change to mainnet for production
const network = 'mainnet';

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
  return Math.floor(sbtc * SATOSHIS_PER_BTC);
};

/**
 * Format satoshis for display
 */
export const formatSatoshis = (satoshis: number): string => {
  return `${satoshis.toLocaleString()} sats`;
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
  try {
    const response = await request({ forceWalletSelect: true }, 'getAddresses');
    return {
      connected: true,
      addresses: response.addresses
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return { connected: false };
  }
};

/**
 * Check if wallet is connected
 */
export const isSBTCWalletConnected = (): boolean => {
  return isConnected();
};

/**
 * Get wallet address
 */
export const getWalletAddress = (): string | null => {
  const userData = getLocalStorage();
  console.log('userData', userData);
  
  // If no addresses, return null
  if (!userData?.addresses?.stx?.length) return null;
  
  // If multiple addresses exist, return the last one as it's likely
  // the one actively selected in the wallet UI
  const addresses = userData.addresses.stx;
  return addresses[addresses.length - 1].address;
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
    // Get the sender's address - use the most recently connected one
    const senderAddress = getWalletAddress();
    
    if (!senderAddress) {
      throw new Error('Wallet not connected');
    }
    
    // Verify the sender and recipient are different addresses
    if (senderAddress === recipientAddress) {
      throw new Error('Cannot send a tip to yourself');
    }

    console.log('Sending from address:', senderAddress);
    console.log('Sending to address:', recipientAddress);
    console.log('Amount in satoshis:', satoshiAmount);
    
    // Create contract call transaction
    const response = await request('stx_callContract', {
      network,
      contract: SBTC_FULL_CONTRACT,
      functionName: 'transfer',
      functionArgs: [
        Cl.uint(satoshiAmount),
        Cl.standardPrincipal(senderAddress),
        Cl.standardPrincipal(recipientAddress),
      ],
    });
    
    // Handle callbacks after the request completes
    if (onFinish) onFinish(response);
    return response;
    } catch (error) {
    console.error('Error sending sBTC tip:', error);
    throw error;
  }
};

/**
 * Get transaction explorer URL
 */
export const getTransactionExplorerUrl = (txId: string): string => {
  return `${SBTC_EXPLORER_URL}/${txId}?chain=${network}`;
};
