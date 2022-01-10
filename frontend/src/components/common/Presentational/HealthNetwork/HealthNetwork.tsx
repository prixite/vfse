import { Dispatch, SetStateAction, useState, useEffect } from "react";

import TextField from "@mui/material/TextField";

import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import "@src/components/common/Presentational/HealthNetwork/HealthNetwork.scss";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import { HealthNetwork as HealthNeworkArg } from "@src/store/reducers/api";

interface HealthNetworkProps {
  index: number;
  network: HealthNeworkArg;
  allNetworks: HealthNeworkArg[];
  setNetworks: Dispatch<SetStateAction<HealthNeworkArg[]>>;
}
const HealthNetwork = ({
  index,
  setNetworks,
  network,
  allNetworks,
}: HealthNetworkProps) => {
  const constantData: object = localizedData()?.healthNetwork;
  const { name, logo } = constantData;
  const [selectedImage, setSelectedImage] = useState([]);

  const handleNameChange = (event) => {
    const TempNetworks = [...allNetworks];
    const { appearance } = TempNetworks[index];
    TempNetworks[index] = { name: event.target.value, appearance };
    setNetworks([...TempNetworks]);
  };

  const handleImageUploadChange = async () => {
    const TempNetworks = [...allNetworks];
    const { name } = TempNetworks[index];
    await uploadImageToS3(selectedImage[0]).then(async (data: S3Interface) => {
      TempNetworks[index] = { name, appearance: { logo: data?.location } };
      setNetworks([...TempNetworks]);
    });
  };
  useEffect(() => {
    if (selectedImage && selectedImage.length) {
      handleImageUploadChange();
    }
  }, [selectedImage]);
  return (
    <div className="health-section">
      <p className="info-label">{name}</p>
      <TextField
        className="info-field"
        variant="outlined"
        placeholder="Advent Health"
        value={network?.name}
        onChange={handleNameChange}
      />
      <div className="health-info">
        <div style={{ width: "100%", marginTop: "25px" }}>
          <p className="dropzone-title">{logo}</p>
          <DropzoneBox
            imgSrc={network?.appearance?.logo}
            setSelectedImage={setSelectedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthNetwork;
