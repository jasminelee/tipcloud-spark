
import { useState } from 'react';
import { X, SendHorizonal, HandCoins, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { sendSBTC } from '@/utils/sbtcHelpers';
import { toast } from 'sonner';

interface TipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  djName: string;
  djImageUrl: string;
  djWalletAddress: string;
}

const TIP_AMOUNTS = [100, 500, 1000, 5000, 10000];

const TipModal = ({ open, onOpenChange, djName, djImageUrl, djWalletAddress }: TipModalProps) => {
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount("");
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setAmount(parseInt(value));
    } else {
      setAmount(0);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
    setCustomAmount(value[0].toString());
  };
  
  const handleSendTip = async () => {
    try {
      setIsSending(true);
      
      // Send tip using SBTC through the helper function
      await sendSBTC(djWalletAddress, amount, message);
      
      toast.success(`Successfully tipped ${djName} ${amount} sats!`);
      setIsSending(false);
      onOpenChange(false);
      // Reset form state
      setAmount(1000);
      setCustomAmount("");
      setMessage("");
      setStep(1);
    } catch (error) {
      console.error("Error sending tip:", error);
      toast.error("Failed to send tip. Please try again.");
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <div className="bg-soundcloud h-2" />
        
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-display">
              {step === 1 ? "Support Your Favorite DJ" : "Confirm Your Tip"}
            </DialogTitle>
            <button 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        {step === 1 ? (
          <div className="p-6 pt-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={djImageUrl} 
                  alt={djName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <div className="text-sm text-muted-foreground">You're tipping</div>
                <div className="font-medium">{djName}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Select Amount (sats)
                </Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {TIP_AMOUNTS.map((tipAmount) => (
                    <button
                      key={tipAmount}
                      type="button"
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all
                        ${amount === tipAmount && !customAmount 
                          ? 'bg-soundcloud text-white border-soundcloud' 
                          : 'bg-muted border-border hover:border-soundcloud/50'}`}
                      onClick={() => handleAmountSelect(tipAmount)}
                    >
                      {tipAmount}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-amount" className="text-sm font-medium">
                  Custom Amount
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount in sats"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="slider" className="text-sm font-medium">
                    Adjust Amount
                  </Label>
                  <span className="text-soundcloud font-medium text-sm">
                    {amount} sats
                  </span>
                </div>
                <Slider
                  id="slider"
                  defaultValue={[1000]}
                  max={50000}
                  min={100}
                  step={100}
                  value={[amount]}
                  onValueChange={handleSliderChange}
                  className="my-4"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Message (Optional)
                </Label>
                <Input
                  id="message"
                  placeholder="Add a message of support..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button 
              className="w-full mt-6 bg-soundcloud hover:bg-soundcloud-dark text-white"
              size="lg"
              onClick={() => setStep(2)}
              disabled={amount <= 0}
            >
              Continue
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        ) : (
          <div className="p-6 pt-2">
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{amount} sats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-medium">{djName}</span>
              </div>
              {message && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground block mb-1">Your message:</span>
                  <span className="text-sm italic">"{message}"</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white"
                onClick={handleSendTip}
                disabled={isSending}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <HandCoins size={16} className="mr-2" />
                    Send Tip
                  </span>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              By continuing, you'll be sending {amount} sats using SBTC to support {djName}.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TipModal;
