import InfoIcon from "@mui/icons-material/Info";
import { Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/articleModal/articleModal.scss";

const Hint = () => {
  const { t } = useTranslation();
  const { buttonBackground } = useAppSelector((state) => state.myTheme);

  return (
    <Paper className="hint" variant="outlined" square>
      <Stack direction="row" gap={1} alignItems="center">
        <InfoIcon
          sx={{
            color: buttonBackground,
          }}
        />
        <Typography className="hintText">
          {t("Use shift+enter to insert multiple line breaks")}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default Hint;
