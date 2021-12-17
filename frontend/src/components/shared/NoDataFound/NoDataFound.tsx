import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "@src/components/shared/NoDataFound/NoDataFound.scss";
import { localizedData } from "@src/helpers/utils/language";
const NoDataFound = () => {
  const history = useHistory();
  const { title, description, backbtn } = localizedData()?.dataNotFound;
  return (
    <Box component="div" className="NotFound">
      <div className="NotFound__content">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
        <Button className="Backbtn" onClick={() => history.goBack()}>
          {backbtn}
        </Button>
      </div>
    </Box>
  );
};

export default NoDataFound;
