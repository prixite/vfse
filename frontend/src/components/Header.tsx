import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Toolbar></Toolbar>
      </AppBar>
    </Box>
  );
}
