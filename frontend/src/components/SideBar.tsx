import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Link } from "react-router-dom";
import "./SideBar.scss";

export default function SideBar() {
  return (
    <Box className="SideBar">
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
          <ListItemText primary={"3rd party administration"} />
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

        <ListItem button component={Link} to="/vfse" key={"/vfse"}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"vFSE"} />
        </ListItem>

        <ListItem button component="a" href="/accounts/logout/">
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
}
