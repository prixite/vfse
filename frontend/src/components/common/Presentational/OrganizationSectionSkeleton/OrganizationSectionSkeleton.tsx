import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClientCardSkeleton from "@src/components/common/Presentational/ClientCardSkeleton/ClientCardSkeleton";
import { Grid, Box } from "@mui/material";
import "@src/components/common/Presentational/OrganizationSectionSkeleton/OrganizationSectionSkeleton.scss";

const OrganizationSectionSkeleton = () => {
  return (
    <>
      <Box component="div" className="OrganizationSectionSkeleton">
        <Skeleton height={50} width="100%" style={{ marginTop: "23px" }} />
        <Grid
          container
          spacing={2}
          className="OrganizationSectionSkeleton__CardsGrid"
        >
          {Array(16).fill(
            <Grid xs={3} className="cardSkeleton">
              <ClientCardSkeleton />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
export default OrganizationSectionSkeleton;
