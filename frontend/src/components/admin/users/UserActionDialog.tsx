import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { User } from "@/types/user.ts";
  
  interface UserActionDialogProps {
    user: User | null;
    open: boolean;
    actionType: string;
    onOpenChange: (open: boolean) => void;
    onAction: () => void;
  }
  
  export function UserActionDialog({ 
    user, 
    open, 
    actionType, 
    onOpenChange, 
    onAction 
  }: UserActionDialogProps) {
    if (!user) return null;
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'action</DialogTitle>
            <DialogDescription>
              {actionType === "ban" && `Êtes-vous sûr de vouloir bannir ${user.name} ?`}
              {actionType === "activate" && `Êtes-vous sûr de vouloir activer ${user.name} ?`}
              {actionType === "changeRole" && `Êtes-vous sûr de vouloir changer le rôle de ${user.name} de ${user.role === "writer" ? "écrivain à lecteur" : "lecteur à écrivain"} ?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onAction}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  