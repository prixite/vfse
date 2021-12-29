import { Dispatch, SetStateAction } from "react";

import TextField from "@mui/material/TextField";

import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import "@src/components/common/Presentational/HealthNetwork/HealthNetwork.scss";
import { localizedData } from "@src/helpers/utils/language";

interface HealthNetworkProps {
  setSelectedImage: Dispatch<SetStateAction<unknown[]>>;
}
const HealthNetwork = ({ setSelectedImage }: HealthNetworkProps) => {
  const constantData: object = localizedData()?.healthNetwork;
  const { name, logo } = constantData;

  return (
    <div className="health-section">
      <p className="info-label">{name}</p>
      <TextField
        className="info-field"
        variant="outlined"
        placeholder="Advent Health"
      />
      <div className="health-info">
        <div style={{ width: "100%", marginTop: "25px" }}>
          <p className="dropzone-title">{logo}</p>
          <DropzoneBox setSelectedImage={setSelectedImage} />
        </div>
      </div>
    </div>
  );
};

export default HealthNetwork;
