import { useState } from 'react';
import { KeyType } from '@/app/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: string, monthlyLimit: number | null) => Promise<void>;
  isCreating: boolean;
}

export default function CreateApiKeyModal({ isOpen, onClose, onSubmit, isCreating }: CreateApiKeyModalProps) {
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedKeyType, setSelectedKeyType] = useState<'production' | 'development'>('development');
  const [monthlyLimit, setMonthlyLimit] = useState<string>('1000');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);

  const keyTypes: KeyType[] = [
    {
      id: 'production',
      name: 'Production',
      description: 'Not limited to 1,000 requests/minute',
      disabled: true
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Rate limited to 100 requests/minute'
    }
  ];

  const handleSubmit = async () => {
    if (!newKeyName.trim()) return;
    await onSubmit(
      newKeyName,
      selectedKeyType,
      isLimitEnabled ? parseInt(monthlyLimit) : null
    );
    resetForm();
  };

  const resetForm = () => {
    setNewKeyName('');
    setSelectedKeyType('development');
    setMonthlyLimit('1000');
    setIsLimitEnabled(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new API key</DialogTitle>
          <DialogDescription>
            Enter a name and limit for the new API key.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Key Name Input */}
          <div className="space-y-2">
            <Label htmlFor="keyName">
              Key Name — A unique name to identify this key
            </Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key Name"
            />
          </div>

          {/* Key Type Selection */}
          <div className="space-y-2">
            <Label>Key Type — Choose the environment for this key</Label>
            <RadioGroup
              value={selectedKeyType}
              onValueChange={(value: string) => setSelectedKeyType(value as 'production' | 'development')}
              className="space-y-3"
            >
              {keyTypes.map((type) => (
                <div
                  key={type.id}
                  className={cn(
                    "flex items-center p-3 border rounded-lg",
                    selectedKeyType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-input",
                    type.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <RadioGroupItem
                    value={type.id}
                    id={type.id}
                    disabled={type.disabled}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={type.id}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium">{type.name}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Monthly Limit */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="monthlyLimit"
                checked={isLimitEnabled}
                onCheckedChange={(checked) => setIsLimitEnabled(checked as boolean)}
              />
              <Label htmlFor="monthlyLimit">Limit monthly usage*</Label>
            </div>

            {isLimitEnabled && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className="mt-2"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !newKeyName.trim()}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
