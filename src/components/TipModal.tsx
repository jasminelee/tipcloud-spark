import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  sendSbtcTip, 
  satoshisToUSD, 
  isSBTCWalletConnected, 
  connectSBTCWallet,
  getWalletAddress
} from '@/utils/sbtcHelpers';

// Predefined tip amounts in satoshis
const PRESET_AMOUNTS = [100, 500, 1000, 5000, 10000];

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  djName: string;
  djProfileImage?: string;
  walletAddress: string;
}

const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  djName,
  djProfileImage,
  walletAddress
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [step, setStep] = useState<'amount' | 'confirm'>('amount');
  const [senderAddress, setSenderAddress] = useState<string | null>(null);

  // Determine the actual amount to use (selected or custom)
  const actualAmount = customAmount 
    ? parseInt(customAmount.replace(/[^0-9]/g, ''), 10) || 0 
    : selectedAmount;

  // Check wallet connection when modal opens
  useEffect(() => {
    if (isOpen) {
      checkWalletConnection();
    }
  }, [isOpen]);

  // Check if wallet is connected
  const checkWalletConnection = async () => {
    try {
      const connected = await isSBTCWalletConnected();
      setIsWalletConnected(connected);
      
      if (connected) {
        const address = await getWalletAddress();
        setSenderAddress(address);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsWalletConnected(false);
    }
  };

  // Connect to wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const result = await connectSBTCWallet();
      setIsWalletConnected(result.connected);
      
      if (result.connected && result.addresses) {
        const stacksAddress = result.addresses.find(addr => addr.symbol === 'STX')?.address;
        if (stacksAddress) {
          setSenderAddress(stacksAddress);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Continue to confirmation step
  const handleContinue = () => {
    if (!actualAmount || actualAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setStep('confirm');
  };

  // Go back to amount selection
  const handleBack = () => {
    setStep('amount');
  };

  // Send the tip
  const handleSendTip = async () => {
    if (!walletAddress || !isWalletConnected) {
      toast.error('Cannot send tip', {
        description: 'Wallet not connected or recipient address is missing'
      });
      return;
    }

    if (!actualAmount || actualAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSending(true);
    try {
      await sendSbtcTip({
        recipientAddress: walletAddress,
        satoshiAmount: actualAmount,
        onFinish: (data) => {
          toast.success('Tip sent successfully!', {
            description: `You've sent ${actualAmount.toLocaleString()} sats to ${djName}`
          });
          onClose();
        },
        onCancel: () => {
          toast.info('Transaction cancelled');
          setIsSending(false);
        }
      });
    } catch (error) {
      console.error('Error sending tip:', error);
      toast.error('Failed to send tip', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      setIsSending(false);
    }
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    // When using custom amount, deselect preset amounts
    if (numericValue) {
      setSelectedAmount(0);
    } else {
      setSelectedAmount(1000); // Default back to 1000 sats
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Support Your Favorite DJ</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full" 
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-3 pt-2">
            <div className="rounded-full overflow-hidden h-12 w-12 bg-secondary flex-shrink-0">
              {djProfileImage ? (
                <img 
                  src={djProfileImage} 
                  alt={djName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                  DJ
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">You're tipping</div>
              <div className="text-soundcloud">{djName}</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {step === 'amount' ? (
          <>
            <div className="space-y-4 py-2">
              <div>
                <Label>Select Amount (sats)</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {PRESET_AMOUNTS.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`${
                        selectedAmount === amount ? 'bg-soundcloud text-white' : ''
                      }`}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Custom Amount</Label>
                <Input
                  type="text"
                  placeholder="Enter amount in sats"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="mt-2"
                />
                {actualAmount > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Approximately {satoshisToUSD(actualAmount)}
                  </div>
                )}
              </div>

              <div>
                <Label>Message (Optional)</Label>
                <Textarea 
                  placeholder="Add a message of support..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 min-h-[80px]"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              {isWalletConnected ? (
                <Button 
                  className="w-full bg-soundcloud hover:bg-soundcloud-dark text-white"
                  disabled={!actualAmount || actualAmount <= 0}
                  onClick={handleContinue}
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting Wallet...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{actualAmount.toLocaleString()} sats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approx. USD</span>
                  <span>{satoshisToUSD(actualAmount)}</span>
                </div>
              </div>

              {message && (
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground mb-1">Your message</div>
                  <div className="text-sm">{message}</div>
                </div>
              )}

              {senderAddress && (
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground mb-1">From</div>
                  <div className="text-sm truncate">{senderAddress}</div>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground mb-1">To</div>
                <div className="text-sm truncate">{walletAddress}</div>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  You're about to send a tip using sBTC. This will open your wallet to confirm the transaction.
                </div>
              </div>
            </div>

            <DialogFooter className="space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={isSending}
              >
                Back
              </Button>
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white"
                onClick={handleSendTip}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Tip'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TipModal;
