
import { Grid, Card, CardContent, Typography } from "@mui/material";
import "@src/components/shared/noFolderFound/noFolderFound.scss";

interface Props {
  errorTitle: string;
}

const NoFolderFound = ({
  errorTitle,
}: Props) => {
  return (
       <Grid item xs={12} xl={12} md={12} lg={12}>
                <Card className="no-folder-card-div">
                  <CardContent>
                    <Typography className="no-folder-error-div" gutterBottom>
                      {errorTitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
      
  );
};

export default NoFolderFound;
