import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 0,
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar></Toolbar>
    </AppBar>
  );
}
