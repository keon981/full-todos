import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IconTrashFilled } from "@tabler/icons-react"

interface Props {
  onDelete: () => void
}

export function DeleteDialog({ onDelete }: Props) {
  return (
    <AlertDialog>

      {/* trigger */}
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <IconTrashFilled className="text-destructive" />
        </Button>
      </AlertDialogTrigger>

      {/* content */}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
