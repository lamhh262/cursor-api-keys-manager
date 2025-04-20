import { useState, useEffect } from 'react';
import { ApiKey } from '@/app/types';
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

interface EditApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string, monthlyLimit: number | null) => Promise<void>;
  apiKey: ApiKey | null;
  isEditing: boolean;
}

export default function EditApiKeyModal({ isOpen, onClose, onSubmit, apiKey, isEditing }: EditApiKeyModalProps) {
  const [keyName, setKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState<string>('1000');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setKeyName(apiKey.name);
      if (apiKey.monthly_limit) {
        setMonthlyLimit(apiKey.monthly_limit.toString());
        setIsLimitEnabled(true);
      } else {
        setMonthlyLimit('1000');
        setIsLimitEnabled(false);
      }
    }
  }, [apiKey]);

  const handleSubmit = async () => {
    if (!apiKey || !keyName.trim()) return;
    await onSubmit(
      apiKey.id,
      keyName,
      isLimitEnabled ? parseInt(monthlyLimit) : null
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API key</DialogTitle>
          <DialogDescription>
            Update the name and limit for this API key.
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
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Key Name"
            />
          </div>

          {/* Monthly Limit */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="monthlyLimit"
                checked={isLimitEnabled}
                onCheckedChange={(checked: boolean) => setIsLimitEnabled(checked)}
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
            disabled={isEditing || !keyName.trim()}
          >
            {isEditing ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
