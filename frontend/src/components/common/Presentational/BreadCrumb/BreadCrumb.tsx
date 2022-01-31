import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "@src/components/common/Presentational/BreadCrumb/BreadCrumb.scss";

interface props {
  breadCrumbList: {
    name: string;
    route?: string;
  }[];
}

const BreadCrumb = ({ breadCrumbList }: props) => {
  return (
    <>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        style={{ marginBottom: "15px" }}
        aria-label="breadcrumb"
        className="breadcrumb"
      >
        {breadCrumbList?.map((item, index) => (
          <div key={index}>
            {item.route ? (
              <Link
                to={item.route}
                className="text"
                style={{ textDecoration: "none" }}
              >
                {item?.name}
              </Link>
            ) : (
              <Typography key="3" color="text.primary">
                {item?.name}
              </Typography>
            )}
          </div>
        ))}
      </Breadcrumbs>
    </>
  );
};
export default BreadCrumb;
