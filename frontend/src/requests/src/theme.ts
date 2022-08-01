import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
// A custom theme for this app
const useTheme = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#773CBD",
      },
      secondary: {
        main: "#19857B",
      },
      error: {
        main: red.A400,
      },
    },
  });
  return theme;
};
export default useTheme;
