import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";

import "@src/components/shared/popUps/ListModal/ListModal.scss";

interface Props {
  name: string;
  list: Array<string>;
  open: boolean;
  handleClose: () => void;
}

const ListModal = ({
  open,
  handleClose,
  name,
  list
}: Props) => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <>
      <Dialog open={open} onClose={handleClose} className="ListModal">
      <DialogTitle>
          <h3>{name}</h3>
      </DialogTitle>
        <DialogContent className="ListModal__Content">
            <div className="modal-list">
            {
                list?.map((item, index) => (
                    <div key={index} className="list-item">{item}</div>
                ))
            }
            </div>
        </DialogContent>
        <DialogActions className="ListModal__Actions">
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            className="btnModal"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListModal;
