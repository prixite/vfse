import { SetStateAction, useEffect, Dispatch } from "react";

import "@src/components/common/presentational/dropzoneBox/dropzoneBox.scss";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDropzone, FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import UploadBtn from "@src/assets/svgs/upload-icon.svg";
import { timeOut } from "@src/helpers/utils/constants";
import { useAppSelector } from "@src/store/hooks";
interface DropzoneProps {
  setSelectedImage: Dispatch<SetStateAction<unknown[]>>;
  imgSrc?: string;
  isUploading?: boolean;
  selectedImage?: File[];
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const DropzoneBox = ({
  setSelectedImage,
  selectedImage,
  imgSrc,
  isUploading,
}: DropzoneProps) => {
  const { acceptedFiles, getRootProps, getInputProps, fileRejections } =
    useDropzone({
      useFsAccessApi: false,
      accept: {
        "image/png": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxSize: MAX_FILE_SIZE,
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

  useEffect(() => {
    if (fileRejections?.length) {
      const invalidFormatFiles = fileRejections.filter(
        (rejection: FileRejection) =>
          rejection.errors.some((error) => error.code === "file-invalid-type")
      );

      const oversizedFiles = fileRejections.filter((rejection: FileRejection) =>
        rejection.errors.some((error) => error.code === "file-too-large")
      );

      if (invalidFormatFiles.length > 0) {
        toast.success(
          "One or more files have an invalid format. Only JPG, JPEG, PNG, and GIF formats are allowed.",
          {
            autoClose: timeOut,
            pauseOnHover: false,
          }
        );
      }

      if (oversizedFiles.length > 0) {
        toast.success("One or more files exceed the maximum size of 20MB.", {
          autoClose: timeOut,
          pauseOnHover: false,
        });
      }
    }
  }, [fileRejections]);

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
