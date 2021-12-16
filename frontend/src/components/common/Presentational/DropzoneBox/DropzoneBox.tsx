import "@src/components/common/Presentational/DropzoneBox/DropzoneBox.scss";
import UploadBtn from "@src/assets/svgs/upload-icon.svg";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import { localizedData } from "@src/helpers/utils/language";

const DropzoneBox = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const constantData: object = localizedData()?.dropzone;
  const { heading, description, button, info } = constantData;

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="dropzone-style">
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
      <aside>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};

export default DropzoneBox;
