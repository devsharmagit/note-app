import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

type ConfirmDialogProps = {
  open: boolean;
  handleClose: (value: boolean) => void;
};

function ConfirmDialog({ open, handleClose }: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Do you want to delete the collection?"}
      </DialogTitle>

      <DialogActions className="!pb-3">
        <Button
          className="!bg-red-500 !text-white !font-medium !py-1"
          onClick={() => {
            handleClose(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="!bg-slate-800 !text-white !font-medium !py-1"
          onClick={() => {
            handleClose(true);
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
