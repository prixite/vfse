import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
// A custom theme for this app
const useTheme = ({ buttonBackground }) => {
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
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&.MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "#0000003b",
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${buttonBackground} !important`,
                borderWidth: "2px !important",
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: `${buttonBackground}`,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: `${buttonBackground} !important`,
            },
          },
          colorPrimary: {
            color: `${buttonBackground} !important`,
          },
        },
      },
    },
  });
  return theme;
};
export default useTheme;
