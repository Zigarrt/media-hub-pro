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
      <AlertDialogContent className="rounded-2xl p-6 sm:p-8 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">⚠️ Izbriši datoteko?</AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-2 leading-relaxed">
            Ali res želiš izbrisati <strong className="text-foreground">{file?.name}</strong> iz mape <strong className="text-foreground">{file?.folder}</strong>?
            <br />
            <span className="text-destructive font-medium">To dejanje je nepopravljivo.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3 sm:gap-3">
          <AlertDialogCancel className="text-base px-6 py-3 h-auto rounded-xl">Prekliči</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-base px-6 py-3 h-auto rounded-xl"
          >
            Izbriši
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
