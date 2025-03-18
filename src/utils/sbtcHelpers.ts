
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
    // Check for Leather wallet (new API)
    if (window.LeatherProvider) {
      const leather = window.LeatherProvider;
      try {
        const accounts = await leather.request('getAddresses');
        return Array.isArray(accounts) && accounts.length > 0;
      } catch (e) {
        console.log("Leather wallet not connected", e);
        return false;
      }
    }
    
    // Try to get accounts or address to verify actual connection
    // This is a common pattern with Bitcoin wallets
    if (window.btc.request) {
      try {
        const accounts = await window.btc.request({ method: 'getAccounts' });
        return Array.isArray(accounts) && accounts.length > 0;
      } catch (e) {
        console.log("Standard wallet not connected", e);
        return false;
      }
    }
    
    // Leather wallet specific check
    if (window.btc.getAccounts) {
      try {
        const accounts = await window.btc.getAccounts();
        return Array.isArray(accounts) && accounts.length > 0;
      } catch (e) {
        console.log("Wallet getAccounts error", e);
        return false;
      }
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
  
  // First check for Leather provider (recommended in error message)
  if (typeof window !== 'undefined' && window.LeatherProvider) {
    try {
      console.log("Using LeatherProvider");
      const leather = window.LeatherProvider;
      
      // Request connection using the new API
      await leather.request('requestAccounts');
      
      // Verify connection after attempting to connect
      const isConnected = await isSBTCWalletConnected();
      console.log(`Leather wallet connection ${isConnected ? 'successful' : 'failed'}`);
      return isConnected;
    } catch (error) {
      console.error("Error connecting to Leather wallet:", error);
    }
  }
  
  // Fallback to old method
  if (typeof window !== 'undefined' && window.btc) {
    try {
      console.log("Falling back to window.btc");
      
      // Handle Leather wallet connection
      if (window.btc.request) {
        try {
          await window.btc.request({ method: 'request_accounts' });
        } catch (e) {
          console.error("Failed request_accounts, trying getAccounts", e);
          await window.btc.request({ method: 'getAccounts' });
        }
      }
      
      // Verify connection after attempting to connect
      const isConnected = await isSBTCWalletConnected();
      
      console.log(`SBTC wallet connection ${isConnected ? 'successful' : 'failed'}`);
      return isConnected;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return false;
    }
  }
  
  console.error("No Bitcoin wallet found. Please install a compatible wallet.");
  return false;
};

// For TypeScript to recognize the global window objects
declare global {
  interface Window {
    btc?: any;
    LeatherProvider?: any;
  }
}
