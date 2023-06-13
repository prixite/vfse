import { SetStateAction, useEffect, Dispatch } from "react";

import "@src/components/common/presentational/dropzoneBox/dropzoneBox.scss";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

import UploadBtn from "@src/assets/svgs/upload-icon.svg";
import { useAppSelector } from "@src/store/hooks";
interface DropzoneProps {
  setSelectedImage: Dispatch<SetStateAction<unknown[]>>;
  imgSrc?: string;
  isUploading?: boolean;
  selectedImage?: File[];
}

const DropzoneBox = ({
  setSelectedImage,
  selectedImage,
  imgSrc,
  isUploading,
}: DropzoneProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    useFsAccessApi: false, //permissions issue in linux (known bug)
    accept: {
      "image/png": [".jpg", ".jpeg", ".png", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      return acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    },
  });

  const { t } = useTranslation();
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const dropzoneOptions =
    acceptedFiles?.length || imgSrc
      ? `${"Uploadoptions hideOptions"}`
      : `${"Uploadoptions"}`;

  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length) {
      setSelectedImage(acceptedFiles);
    }
  }, [acceptedFiles]);
  return (
    <section className="dropzone-style" {...getRootProps()}>
      <input {...getInputProps()} />
      {selectedImage && selectedImage.length ? (
        <div className="UploadedImg">
          {isUploading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <div
                className="blurBg"
                style={{ backgroundImage: `url(${selectedImage[0]?.preview})` }}
              />
              <img src={selectedImage[0].preview} />
            </>
          )}
        </div>
      ) : imgSrc ? (
        <div className="UploadedImg">
          <div
            className="blurBg"
            style={{ backgroundImage: `url(${imgSrc})` }}
          />
          <img src={imgSrc} />
        </div>
      ) : (
        ""
      )}
      <div style={{ zIndex: "550" }} className={dropzoneOptions}>
        <img src={UploadBtn} className="" />
        <p>
          <b>{t("Drag & Drop")}</b>
          {t(" files here or")}
        </p>
        <div>
          <Button
            className="browse-btn"
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
          >
            {t("Browse")}
          </Button>
        </div>
        <p className="file-info">{t("up to 20mb")}</p>
      </div>
    </section>
  );
};

export default DropzoneBox;
