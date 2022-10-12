import InfoIcon from "@mui/icons-material/Info";
import { Paper, Stack, Typography } from "@mui/material";

import constantsData from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/articleModal/articleModal.scss";

const Hint = () => {
  const { hintText } = constantsData.articleModal;

  const { buttonBackground } = useAppSelector((state) => state.myTheme);

  return (
    <Paper className="hint" variant="outlined" square>
      <Stack direction="row" gap={1} alignItems="center">
        <InfoIcon
          sx={{
            color: buttonBackground,
          }}
        />
        <Typography className="hintText">{hintText}</Typography>
      </Stack>
    </Paper>
  );
};

export default Hint;
