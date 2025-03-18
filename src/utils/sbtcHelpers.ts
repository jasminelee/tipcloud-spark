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
 * Check if SBTC wallet is connected without triggering wallet UI
 * @returns Boolean indicating if wallet is connected
 */
export const isSBTCWalletConnected = async (): Promise<boolean> => {
  // Check for window.btc existence
  if (typeof window === 'undefined') {
    console.log("Not in browser environment");
    return false;
  }
  
  // Check for LeatherProvider first (new recommended API)
  if (window.LeatherProvider) {
    try {
      console.log("Checking LeatherProvider connection status");
      
      // Try with passive property checks first
      if (window.LeatherProvider.isConnected) {
        return true;
      }
      
      // As a fallback, try to get addresses without triggering UI
      try {
        // This checks if we're already connected
        const response = await window.LeatherProvider.request("getAddresses");
        return !!(response && response.result && response.result.addresses && 
          Array.isArray(response.result.addresses) && response.result.addresses.length > 0);
      } catch (e) {
        // If this errors, the wallet is likely not connected
        console.log("Error getting addresses from Leather:", e);
        return false;
      }
    } catch (error) {
      console.error("Error checking LeatherProvider connection:", error);
      return false;
    }
  }
  
  // Fallback to check for window.btc
  if (window.btc) {
    try {
      // Only check properties that don't trigger UI
      
      // Check for passive connection indicators
      if (window.btc.address || window.btc.accounts) {
        return true;
      }
      
      // This is a passive check for other wallet types
      if (window.btc.isConnected || (window.btc.status && window.btc.status === 'connected')) {
        return true; 
      }
      
      console.log("Wallet detected but no passive connection indicators found");
      return false;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  }
  
  console.log("No Bitcoin wallet detected");
  return false;
};

/**
 * Connect to SBTC wallet - explicitly triggers wallet UI
 * IMPORTANT: This should ONLY be called from explicit user actions
 * like clicking a "Connect Wallet" button
 * @returns Promise with connection status
 */
export const connectSBTCWallet = async (): Promise<boolean> => {
  console.log("Attempting to connect to SBTC wallet...");
  
  // Use LeatherProvider as recommended in the deprecation warning
  if (typeof window !== 'undefined' && window.LeatherProvider) {
    try {
      console.log("Using LeatherProvider");
      
      // Request addresses using the correct method
      const response = await window.LeatherProvider.request("getAddresses");
      console.log("Leather wallet response:", response);
      
      // Check if we have a valid response with addresses
      if (response && response.result && response.result.addresses &&
          Array.isArray(response.result.addresses) && response.result.addresses.length > 0) {
        console.log("Leather wallet connection successful");
        return true;
      }
      
      // Verify connection after attempting to connect
      const isConnected = await isSBTCWalletConnected();
      console.log(`Leather wallet connection verification: ${isConnected ? 'successful' : 'failed'}`);
      return isConnected;
    } catch (error) {
      console.error("Error connecting to Leather wallet:", error);
      return false;
    }
  }
  
  // Fallback to old method for other wallets
  if (typeof window !== 'undefined' && window.btc) {
    try {
      console.log("Falling back to window.btc");
      
      // For non-Leather wallets
      if (window.btc.request) {
        try {
          await window.btc.request({ method: 'getAccounts' });
        } catch (e) {
          console.error("Failed getAccounts", e);
          return false;
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
    LeatherProvider?: {
      request: (method: string, params?: any) => Promise<any>;
      isConnected?: boolean;
      ready?: boolean;
      getAddresses?: () => Promise<{
        result: {
          addresses: Array<{
            symbol: string;
            type?: string;
            address: string;
            publicKey?: string;
            derivationPath?: string;
          }>
        }
      }>;
    };
  }
}
