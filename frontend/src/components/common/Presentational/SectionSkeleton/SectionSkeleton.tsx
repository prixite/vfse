import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CardSkeleton from "@src/components/common/Presentational/CardSkeleton/CardSkeleton";
import { Grid, Box } from "@mui/material";
import "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton.scss";

const SectionSkeleton = () => {
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
            <Grid item={true} xs={3} className="cardSkeleton">
              <CardSkeleton />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
export default SectionSkeleton;
