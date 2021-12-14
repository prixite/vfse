import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

import {
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
} from "@src/store/reducers/api";
import { localizedData } from "@src/helpers/utils/language";
import {
  updateOrganizationService,
  addNewOrganizationService,
} from "@src/services/organizationService";

export default function OrganizationModal(props) {
  const [addNewOrganization, { isLoading }] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const constantData: object = localizedData()?.organization?.popUp;
  const {
    popUpNewOrganization,
    newOrganizationName,
    newOrganizationSeats,
    newOrganizationBtnSave,
    newOrganizationBtnCancel,
  } = constantData;

  const handleSetNewOrganization = async () => {
    if (props.organization.id) {
      const { id, ...organization } = props.organization;
      await updateOrganizationService(
        id,
        organization,
        updateOrganization,
        props.refetch
      );
      toast.success("Organization successfully updated");
    } else {
      await addNewOrganizationService(
        props.organization,
        addNewOrganization,
        props.refetch
      );
      toast.success("Organization successfully added");
    }
    props.handleClose();
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>
        {props.organization?.name ?? popUpNewOrganization}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={newOrganizationName}
          type="text"
          fullWidth
          value={props.organization?.name ?? ""}
          variant="standard"
          onChange={(event) =>
            props.setOrganization({
              ...props.organization,
              name: event.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          id="seats"
          label={newOrganizationSeats}
          type="text"
          fullWidth
          variant="standard"
          value={props.organization?.number_of_seats ?? 0}
          onChange={(event) =>
            props.setOrganization({
              ...props.organization,
              number_of_seats: event.target.value,
            })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>{newOrganizationBtnCancel}</Button>
        <Button onClick={handleSetNewOrganization}>
          {newOrganizationBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
