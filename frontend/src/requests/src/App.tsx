import { ThemeProvider } from "@mui/material";

import Registeration from "@src/requests/src/Registeration";
import { useAppSelector } from "@src/requests/src/store/hooks";
import useTheme from "@src/requests/src/theme";

const App = () => {
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  return (
    <ThemeProvider theme={useTheme({ buttonBackground: buttonBackground })}>
      <Registeration />
    </ThemeProvider>
  );
};

export default App;
