import { DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { useAppSelector } from "@src/store/hooks";

import "@src/components/shared/popUps/viewMapModal/index.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
  points: Array<{ long: number; lat: number; name: string }>;
}

const ViewMapModal = ({ open, handleClose, points }: Props) => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme,
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} className="map-modal">
        <DialogTitle>
          <div className="title-section title-cross">
            <span className="modal-header">View Locations</span>
            <span className="dialog-page">
              <img src={CloseBtn} className="cross-btn" onClick={handleClose} />
            </span>
          </div>
        </DialogTitle>
        <DialogContent>
          <MapContainer center={[40.505, -100.09]} zoom={4}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map(({ long, lat, name }, index) => (
              <Marker
                key={`${index}${name}`}
                position={[Number(long), Number(lat)]}
              >
                <Popup>{name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
              padding: "10px 30px",
              fontSize: 16,
            }}
            className="btnModal"
            onClick={handleClose}
          >
            close me
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewMapModal;
