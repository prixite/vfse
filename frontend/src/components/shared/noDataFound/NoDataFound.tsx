import Box from "@mui/material/Box";

import NoSearchFound from "@src/assets/images/no-search-icon.png";
import "@src/components/shared/noDataFound/noDataFound.scss";

interface Props {
  search?: boolean;
  setQuery?: (arg: string) => void;
  queryText?: string;
  title: string;
  description?: string;
}

const NoDataFound = ({
  search, // eslint-disable-line
  setQuery, // eslint-disable-line
  queryText, // eslint-disable-line
  title,
  description, // eslint-disable-line
}: Props) => {
  return (
    <Box component="div" className="NotFound">
      <div className="NotFound__content">
        <img
          style={{ width: "180px", height: "180px", marginBottom: "20px" }}
          src={NoSearchFound}
        />
        <h3 className="title">{title}</h3>
      </div>
    </Box>
  );
};

export default NoDataFound;
