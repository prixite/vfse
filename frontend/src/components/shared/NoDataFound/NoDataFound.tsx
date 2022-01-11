import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

import "@src/components/shared/NoDataFound/NoDataFound.scss";
import { localizedData } from "@src/helpers/utils/language";

interface Props {
  search: boolean;
  setQuery: (arg: string) => void;
  queryText?: string;
  title: string;
  description: string;
}

const NoDataFound = ({
  search,
  setQuery,
  queryText,
  title,
  description,
}: Props) => {
  const history = useHistory();
  const { backbtn } = localizedData().dataNotFound;
  const handleBack = () => {
    if (search) {
      setQuery("");
    } else {
      history.goBack();
    }
  };
  return (
    <Box component="div" className="NotFound">
      <div className="NotFound__content">
        <h3 className="title">
          {title} {queryText}
        </h3>
        <p className="description">{description}</p>
        <Button className="Backbtn" onClick={handleBack}>
          {backbtn}
        </Button>
      </div>
    </Box>
  );
};

export default NoDataFound;
