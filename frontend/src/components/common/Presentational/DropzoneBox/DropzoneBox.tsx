import "@src/components/common/Presentational/DropzoneBox/DropzoneBox.scss";
import UploadBtn from "@src/assets/svgs/upload-icon.svg";
import Button from "@mui/material/Button";
import {useDropzone} from 'react-dropzone';

const DropzoneBox = () => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="dropzone-style">
            <img src={UploadBtn} className="" />
            <p><b>Drag & Drop</b> files here or</p>
            <div {...getRootProps()}>
            <input {...getInputProps()} />
                <Button className="browse-btn">
                    Browse
                </Button>
            </div>
            <p className="file-info">up to 20mb</p>
            <aside>
                <ul>{files}</ul>
            </aside>
        </section>

    )
}

export default DropzoneBox;
