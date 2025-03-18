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
      
      // Only use truly passive checks that won't trigger UI
      // Try with passive property checks first
      if (window.LeatherProvider.isConnected) {
        return true;
      }
      
      // Don't attempt to call request methods here as they might trigger UI
      // Instead rely on component-level handling after explicit user action
      
      return false;
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
 * @returns Promise with connection status and addresses if available
 */
export const connectSBTCWallet = async (): Promise<{
  connected: boolean;
  addresses?: Array<{
    symbol: string;
    type?: string;
    address: string;
    publicKey?: string;
    derivationPath?: string;
  }>;
}> => {
  console.log("Attempting to connect to SBTC wallet...");
  
  // Use LeatherProvider as recommended in the deprecation warning
  if (typeof window !== 'undefined' && window.LeatherProvider) {
    try {
      console.log("Using LeatherProvider");
      
      // First check if we're already connected without triggering UI
      try {
        // Try a passive check first to avoid multiple popups
        if (window.LeatherProvider.isConnected) {
          console.log("Leather wallet already connected via isConnected property");
          return { connected: true };
        }
      } catch (e) {
        console.log("Error checking passive connection:", e);
      }
      
      // Request addresses using the correct method - will trigger UI once
      const response = await window.LeatherProvider.request("getAddresses");
      console.log("Leather wallet response:", response);
      
      // Check if we have a valid response with addresses
      if (response && response.result && response.result.addresses &&
          Array.isArray(response.result.addresses) && response.result.addresses.length > 0) {
        console.log("Leather wallet connection successful");
        // Return both connection status and addresses to avoid additional requests
        return { 
          connected: true,
          addresses: response.result.addresses
        };
      }
      
      return { connected: false };
    } catch (error) {
      console.error("Error connecting to Leather wallet:", error);
      return { connected: false };
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
          return { connected: true }; // If we got here without error, we're connected
        } catch (e) {
          console.error("Failed getAccounts", e);
          return { connected: false };
        }
      }
      
      // If no request method, check for other indicators
      if (window.btc.address || window.btc.accounts || 
          window.btc.isConnected || (window.btc.status && window.btc.status === 'connected')) {
        return { connected: true };
      }
      
      return { connected: false };
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return { connected: false };
    }
  }
  
  console.error("No Bitcoin wallet found. Please install a compatible wallet.");
  return { connected: false };
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
