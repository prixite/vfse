import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <Box
      sx={{
        width: 296,
        flexShrink: 0,
        borderRight: "1px solid #E5E7EB",
        height: "100%",
      }}
    >
      <List>
        <ListItem button component={Link} to="/" key={"/"}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/organizations"
          key={"/organizations"}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Organiations"} />
        </ListItem>
        <ListItem button component={Link} to="/users" key={"/users"}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Users"} />
        </ListItem>
        <ListItem button component={Link} to="/modality" key={"/modality"}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Modality"} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/documentation"
          key={"/documentation"}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Documentation"} />
        </ListItem>
      </List>
    </Box>
  );
}
