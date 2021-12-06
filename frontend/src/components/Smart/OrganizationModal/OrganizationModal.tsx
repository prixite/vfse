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

export default function OrganizationModal(props) {
  const [addNewOrganization, { isLoading }] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>
        {props.organization?.name ?? "New Organization"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
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
          label="Number of seats"
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
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={async () => {
            if (props.organization.id) {
              const { id, ...organization } = props.organization;
              await updateOrganization({ id, organization }).unwrap();
              toast.success("Organization successfully updated");
            } else {
              await addNewOrganization({
                organization: props.organization,
              }).unwrap();
              toast.success("Organization successfully added");
            }
            props.handleClose();
            props.refetch(); // TODO: invalidate cache instead of this.
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
