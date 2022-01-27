import { Grid, Box } from "@mui/material";

import CardSkeleton from "@src/components/common/Presentational/CardSkeleton/CardSkeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton.scss";

const ImageGallerySkeleton = () => {
  return (
    <>
      <Box component="div" className="OrganizationSectionSkeleton">
        <Grid
          container
          spacing={2}
          className="OrganizationSectionSkeleton__CardsGrid"
        >
          {Array(8).fill(
            <Grid item={true} xs={3} className="cardSkeleton">
              <CardSkeleton />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
export default ImageGallerySkeleton;
