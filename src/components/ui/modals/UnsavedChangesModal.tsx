import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button/button';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onDiscard,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white dark:bg-background-dark'>
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Would you like to save them before leaving?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-2 justify-end">
            <Button variant="destructive" onClick={onDiscard}>
              Discard
            </Button>
            <Button variant="black" onClick={onConfirm}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
