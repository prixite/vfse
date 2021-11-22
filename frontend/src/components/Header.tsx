import { Button, Typography } from "@mui/material";
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
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>
        <Button href="/accounts/logout/">Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
