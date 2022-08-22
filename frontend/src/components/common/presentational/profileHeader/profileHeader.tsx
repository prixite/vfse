import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Typography, Stack } from "@mui/material";

import user from "@src/assets/images/profile.png";
import calender from "@src/assets/svgs/g-calendar.svg";
import gmail from "@src/assets/svgs/gmail.svg";
import msg from "@src/assets/svgs/msg.svg";
import slack from "@src/assets/svgs/slack.svg";
import zoom from "@src/assets/svgs/zoom.svg";
import "@src/components/common/presentational/profileHeader/profileHeader.scss";

const ProfileHeader = () => {
  return (
    <>
      <Box className="header">
        <Box className="headerTop">
          <Avatar
            alt="Profile"
            className="profilePic"
            src={user}
            sx={{ width: 120, height: 120 }}
          />
          <Button
            variant="contained"
            className="editButton"
            startIcon={<EditIcon />}
          >
            {"Edit"}
          </Button>
        </Box>
        <Box
          className="headerBottom"
          marginLeft={{ xs: 0, md: "8rem" }}
          marginTop={{ xs: "3rem", md: 0 }}
        >
          <Typography
            fontWeight="bold"
            textAlign={{ xs: "center", md: "left" }}
          >
            {"Jessie Hudson"}
          </Typography>
          <Stack className="iconsSec" direction={{ xs: "column", md: "row" }}>
            <Typography className="roleText">{"Admin"}</Typography>
            <Stack
              className="icons"
              direction="row"
              gap={2}
              mt={{ xs: "1rem", md: 0 }}
            >
              <img src={gmail} />
              <img src={calender} />
              <img src={zoom} />
              <img src={slack} />
            </Stack>
          </Stack>
          <Stack
            className="about"
            direction={{ xs: "column", lg: "row" }}
            gap={{ xs: 2, lg: 0 }}
            width={{ xs: "100%", xl: "70%" }}
            mt={{ xs: "3rem", md: 0 }}
          >
            <Stack gap={{ xs: 0, lg: 1 }}>
              <Typography fontWeight={400}>{"Email"}</Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <img src={msg} />
                <Typography>{"jessiehudson@gmail.com"}</Typography>
              </Stack>
            </Stack>
            <Stack gap={{ xs: 0, lg: 1 }}>
              <Typography fontWeight={400}>{"Company"}</Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <img src={msg} />
                <Typography>{"Nova Healthcare"}</Typography>
              </Stack>
            </Stack>
            <Stack gap={{ xs: 0, lg: 1 }}>
              <Typography fontWeight={400}>{"Location"}</Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <img src={msg} />
                <Typography>{"Richland, WA"}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default ProfileHeader;
