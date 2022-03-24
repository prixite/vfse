import Box from "@mui/material/Box";

import "@src/views/serverErrorPage/serverErrorPage.scss";
import Logo505 from "@src/assets/images/frame505.png";
import { localizedData } from "@src/helpers/utils/language";
const ServerErrorPage = () => {
  const { title, description } = localizedData().page505;
  return (
    <Box component="div" className="Page505">
      <img src={Logo505} />
      <div className="Page505__content">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </div>
    </Box>
  );
};

export default ServerErrorPage;
