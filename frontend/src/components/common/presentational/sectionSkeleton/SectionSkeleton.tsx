import { Grid, Box } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import CardSkeleton from "@src/components/common/presentational/cardSkeleton/CardSkeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "@src/components/common/presentational/sectionSkeleton/sectionSkeleton.scss";

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
          {[...Array(16)].map((e, index) => (
            <Grid key={index} item={true} xs={3} className="cardSkeleton">
              <CardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default SectionSkeleton;
