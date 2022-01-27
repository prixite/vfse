import { SetStateAction, useEffect, Dispatch } from "react";

import "@src/components/common/Presentational/DropzoneBox/DropzoneBox.scss";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDropzone } from "react-dropzone";

import UploadBtn from "@src/assets/svgs/upload-icon.svg";
import { localizedData } from "@src/helpers/utils/language";
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
    onDrop: (acceptedFiles) =>
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
  });
  const constantData: object = localizedData()?.dropzone;
  const { heading, description, button, info } = constantData;
  const dropzoneOptions =
    acceptedFiles?.length || imgSrc
      ? "Uploadoptions hideOptions"
      : "Uploadoptions";

  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length) {
      setSelectedImage(acceptedFiles);
    }
  }, [acceptedFiles]);
  return (
    <section className="dropzone-style">
      {selectedImage && selectedImage.length ? (
        <div className="UploadedImg">
          {isUploading ? (
            <CircularProgress color="secondary" />
          ) : (
            <img src={selectedImage[0].preview} />
          )}
        </div>
      ) : imgSrc ? (
        <div className="UploadedImg">
          <img src={imgSrc} />
        </div>
      ) : (
        ""
      )}
      <div style={{ zIndex: "100" }} className={dropzoneOptions}>
        <img src={UploadBtn} className="" />
        <p>
          <b>{heading}</b>
          {description}
        </p>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button className="browse-btn">{button}</Button>
        </div>
        <p className="file-info">{info}</p>
      </div>
    </section>
  );
};

export default DropzoneBox;
