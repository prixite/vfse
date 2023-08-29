import { Dispatch, SetStateAction, useState, useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import "@src/components/common/presentational/healthNetwork/healthNetwork.scss";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { HealthNetwork as HealthNeworkArg } from "@src/store/reducers/api";
import { S3Interface } from "@src/types/interfaces";

interface HealthNetworkProps {
  index: number;
  network: HealthNeworkArg;
  isDataPartiallyfilled: boolean;
  organizationName: string;
  setIsDataPartiallyfilled: Dispatch<SetStateAction<boolean>>;
  setIsNetworkImageUploading: Dispatch<SetStateAction<boolean>>;
  allNetworks: HealthNeworkArg[];
  setNetworks: (args: HealthNeworkArg[]) => void;
}
const HealthNetwork = ({
  index,
  setNetworks,
  network,
  isDataPartiallyfilled,
  organizationName,
  setIsDataPartiallyfilled,
  setIsNetworkImageUploading,
  allNetworks,
}: HealthNetworkProps) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState([]);
  const [networkNameErr, setNetworkNameErr] = useState("");
  const [networkDuplicationErr, setNetworkDuplicationErr] = useState("");
  const [networkImageErr, setNetworkImageErr] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const handleNameChange = (event) => {
    const TempNetworks = [...allNetworks];
    const { appearance, id } = TempNetworks[index];
    TempNetworks[index] = id
      ? { id, name: event.target.value, appearance }
      : { name: event.target.value, appearance };
    setNetworks([...TempNetworks]);
    if (event.target.value !== "") {
      setNetworkNameErr("");
    }
  };

  const handleImageUploadChange = async () => {
    const TempNetworks = [...allNetworks];
    const { name } = TempNetworks[index];
    setIsUploading(true);
    setIsNetworkImageUploading(true);
    await uploadImageToS3(selectedImage[0]).then(async (data: S3Interface) => {
      TempNetworks[index] = { name, appearance: { logo: data?.location } };
      setNetworks([...TempNetworks]);
    });
    setIsUploading(false);
    setIsNetworkImageUploading(false);
  };
  const networkCloseHandler = () => {
    const TempNetworks = allNetworks.filter(
      (_, networkIndex) => networkIndex !== index
    );
    setNetworks([...TempNetworks]);
  };
  useEffect(() => {
    if (selectedImage && selectedImage.length) {
      handleImageUploadChange();
      setNetworkImageErr("");
    }
  }, [selectedImage]);
  useEffect(() => {
    if (isDataPartiallyfilled) {
      if (network?.name === "" && network?.appearance?.logo !== "") {
        setNetworkImageErr("");
        setNetworkNameErr("Name is required");
      }
      if (network?.name !== "" && network?.appearance?.logo === "") {
        setNetworkImageErr("Image is required");
        setNetworkNameErr("");
      }
      if (network?.name === organizationName) {
        setNetworkDuplicationErr("Organization with this Name already exists");
      }
      if (
        (network?.name === "" && network?.appearance?.logo === "") ||
        (network?.name && network?.appearance?.logo)
      ) {
        setNetworkImageErr("");
        setNetworkNameErr("");
      }
      if (network?.name && network?.name !== organizationName) {
        setNetworkDuplicationErr("");
      }
    }
    setIsDataPartiallyfilled(false);
  }, [isDataPartiallyfilled]);
  return (
    <div className="health-section">
      <CloseIcon className="close-icon" onClick={networkCloseHandler} />
      <p className="info-label required">{t("Health Network Name")}</p>
      <TextField
        className="info-field"
        variant="outlined"
        autoComplete="off"
        placeholder="Advent Health"
        value={network?.name}
        onChange={handleNameChange}
      />
      <p style={{ color: "#ff1744" }}>
        {networkNameErr || networkDuplicationErr}
      </p>
      <div className="health-info">
        <div style={{ width: "100%", marginTop: "25px" }}>
          <p className="dropzone-title required">{t("Logo")}</p>
          <DropzoneBox
            imgSrc={network?.appearance?.logo}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            isUploading={isUploading}
          />
        </div>
      </div>
      <p style={{ color: "#ff1744", fontSize: "0.8rem", marginTop: "5px" }}>
        {networkImageErr}
      </p>
    </div>
  );
};

export default HealthNetwork;
