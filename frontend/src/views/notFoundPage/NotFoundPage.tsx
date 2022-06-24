import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import "@src/views/notFoundPage/notFoundPage.scss";
import Logo404 from "@src/assets/images/frame404.png";
import { localizedData } from "@src/helpers/utils/language";
const NotFoundPage = () => {
  const navigate = useNavigate();
  const { title, description, backbtn } = localizedData().page404;
  return (
    <Box component="div" className="Page404">
      <img src={Logo404} />
      <div className="Page404__content">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
        <Button className="Backbtn" onClick={() => navigate("/")}>
          {backbtn}
        </Button>
      </div>
    </Box>
  );
};

export default NotFoundPage;
