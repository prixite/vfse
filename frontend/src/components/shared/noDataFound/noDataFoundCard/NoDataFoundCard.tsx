import { Grid, Card, CardContent, Typography } from "@mui/material";
import "@src/components/shared/noDataFound/noDataFoundCard/NoDataFoundCard.scss";

interface Props {
  message: string;
}

const NoDataFoundCard = ({ message }: Props) => {
  return (
    <Grid item xs={12} xl={12} md={12} lg={12}>
      <Card className="no-folder-card-div">
        <CardContent>
          <Typography className="no-folder-error-div" gutterBottom>
            {message}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default NoDataFoundCard;
