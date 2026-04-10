import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MediaFile } from "@/lib/types";

interface DeleteModalProps {
  file: MediaFile | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ file, open, onClose, onConfirm }: DeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Izbriši datoteko?</AlertDialogTitle>
          <AlertDialogDescription>
            Ali res želiš izbrisati <strong>{file?.name}</strong> iz mape <strong>{file?.folder}</strong>?
            To dejanje je nepopravljivo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Prekliči</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Izbriši
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
