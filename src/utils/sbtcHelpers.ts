
type SBTCResponse = {
  success: boolean;
  txid?: string;
  error?: string;
};

/**
 * Send SBTC to a recipient wallet
 * @param recipientAddress - The wallet address to send SBTC to
 * @param amountSats - Amount in satoshis to send
 * @param memo - Optional memo/message to include
 * @returns Promise with transaction response
 */
export const sendSBTC = async (
  recipientAddress: string,
  amountSats: number,
  memo: string = ""
): Promise<SBTCResponse> => {
  console.log(`Sending ${amountSats} sats to ${recipientAddress} with memo: ${memo}`);
  
  // Check if we're in a browser environment with window.btc
  if (typeof window === 'undefined' || !window.btc) {
    throw new Error("Bitcoin wallet not available. Please install a compatible wallet extension.");
  }
  
  try {
    // This is a placeholder for the actual SBTC implementation
    // In a real implementation, we would call the SBTC API or library
    
    // Mocking the actual wallet connection
    // In production, you'd connect to the actual SBTC wallet API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating network call
    
    const response: SBTCResponse = {
      success: true,
      txid: `tx_${Math.random().toString(36).substring(2, 15)}`
    };
    
    console.log("Transaction successful:", response);
    
    return response;
  } catch (error) {
    console.error("Error sending SBTC:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

/**
 * Check if SBTC wallet is connected
 * @returns Boolean indicating if wallet is connected
 */
export const isSBTCWalletConnected = async (): Promise<boolean> => {
  // Check for window.btc existence
  if (typeof window === 'undefined' || !window.btc) {
    console.log("No Bitcoin wallet detected");
    return false;
  }
  
  try {
    // Try to get accounts or address to verify actual connection
    // This is a common pattern with Bitcoin wallets
    if (window.btc.request) {
      const accounts = await window.btc.request({ method: 'getAccounts' }).catch(() => null);
      return Array.isArray(accounts) && accounts.length > 0;
    }
    
    // Leather wallet specific check
    if (window.btc.getAccounts) {
      const accounts = await window.btc.getAccounts().catch(() => null);
      return Array.isArray(accounts) && accounts.length > 0;
    }
    
    // Fallback for other wallet implementations
    if (window.btc.address || window.btc.accounts) {
      return true;
    }
    
    console.log("Wallet detected but not connected");
    return false;
  } catch (error) {
    console.error("Error checking wallet connection:", error);
    return false;
  }
};

/**
 * Connect to SBTC wallet
 * @returns Promise with connection status
 */
export const connectSBTCWallet = async (): Promise<boolean> => {
  console.log("Attempting to connect to SBTC wallet...");
  
  if (typeof window === 'undefined' || !window.btc) {
    console.error("No Bitcoin wallet found. Please install a compatible wallet.");
    return false;
  }
  
  try {
    // In a real implementation, this would be the actual wallet connection code
    
    // Handle Leather wallet connection
    if (window.btc.request) {
      await window.btc.request({ method: 'getAccounts' }).catch(() => {
        // If getAccounts fails, try requesting accounts
        return window.btc.request({ method: 'request_accounts' });
      });
    }
    
    // Wait a bit to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verify connection after attempting to connect
    const isConnected = await isSBTCWalletConnected();
    
    console.log(`SBTC wallet connection ${isConnected ? 'successful' : 'failed'}`);
    return isConnected;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return false;
  }
};

// For TypeScript to recognize the global window.btc object
declare global {
  interface Window {
    btc?: any;
  }
}
