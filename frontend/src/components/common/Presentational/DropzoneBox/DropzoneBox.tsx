import { SetStateAction, useEffect ,Dispatch} from "react";

import "@src/components/common/Presentational/DropzoneBox/DropzoneBox.scss";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";

import UploadBtn from "@src/assets/svgs/upload-icon.svg";
import { localizedData } from "@src/helpers/utils/language";
interface DropzoneProps {
  setSelectedImage: Dispatch<SetStateAction<any[]>>;
  imgSrc?:string;
}

const DropzoneBox = ({ setSelectedImage,imgSrc }: DropzoneProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => (
      acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))),
  });
  const constantData: object = localizedData()?.dropzone;
  const { heading, description, button, info } = constantData;
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    setSelectedImage(acceptedFiles);
  }, [acceptedFiles]);
  return (
    <section className="dropzone-style">
      {acceptedFiles && acceptedFiles.length ?
      <div className="UploadedImg">
         <img src={acceptedFiles[0].preview} />
      </div>
      :
       imgSrc ?
       <div className="UploadedImg">
        <img src={imgSrc} />
       </div>
       : ""
      }
      <div style={{zIndex:"100"}} className="Uploadoptions">
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
