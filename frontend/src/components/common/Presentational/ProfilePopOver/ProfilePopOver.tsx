import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

const ProfilePopOver = ({ user, className }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <img src={user} className={className} onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        style={{ marginLeft: "5px" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 1 }}>
          {" "}
          <a href="/accounts/logout/" style={{ textDecoration: "none" }}>
            Logout
          </a>
        </Typography>
      </Popover>
    </div>
  );
};

export default ProfilePopOver;
