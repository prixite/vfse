import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

import "@src/views/NotFoundPage/NotFoundPage.scss";
import Logo404 from "@src/assets/images/Frame404.png";
import { localizedData } from "@src/helpers/utils/language";
const NotFoundPage = () => {
  const history = useHistory();
  const { title, description, backbtn } = localizedData()?.page404;
  return (
    <Box component="div" className="Page404">
      <img src={Logo404} />
      <div className="Page404__content">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
        <Button className="Backbtn" onClick={() => history.push("/")}>
          {backbtn}
        </Button>
      </div>
    </Box>
  );
};

export default NotFoundPage;
