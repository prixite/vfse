import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { localizedData } from "@src/helpers/utils/language";

export default function NetworkModal(props) {
  const constantData: object = localizedData()?.modalities?.popUp;
  const {
    popUpNewNetwork,
    newNetworkName,
    newNetworkSeat,
    newNetworkBtnSave,
    newNetworkBtnCancel,
  } = constantData;

  const handleSetNewNetwork = async () => {
    toast.success("Organization successfully added");
    props.handleClose();
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{popUpNewNetwork}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={newNetworkName}
          type="text"
          fullWidth
          value={""}
          variant="standard"
        />
        <TextField
          margin="dense"
          id="seats"
          label={newNetworkSeat}
          type="text"
          fullWidth
          variant="standard"
          value={0}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>{newNetworkBtnCancel}</Button>
        <Button onClick={handleSetNewNetwork}>{newNetworkBtnSave}</Button>
      </DialogActions>
    </Dialog>
  );
}
