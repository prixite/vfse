import { useState } from "react";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { Avatar, Box, Typography, Stack } from "@mui/material";

import calender from "@src/assets/svgs/g-calendar.svg";
import gmail from "@src/assets/svgs/gmail.svg";
import msg from "@src/assets/svgs/msg.svg";
import slack from "@src/assets/svgs/slack.svg";
import zoom from "@src/assets/svgs/zoom.svg";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/generated";

import EditProfilePicModal from "../editProfilePicModal/editProfilePicModal";

import "@src/components/common/presentational/profileHeader/profileHeader.scss";

const ProfileHeader = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    me && setOpen(true);
  };

  const { data: me } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });

  return (
    <>
      <Box className="header">
        <Box className="headerTop">
          <Avatar
            alt="Profile"
            className="profilePic"
            src={me?.profile_picture}
            onClick={handleClickOpen}
            sx={{ width: 120, height: 120, cursor: "pointer" }}
          />
          <CameraAltOutlinedIcon
            onClick={handleClickOpen}
            className="cameraIcon"
          />
          <EditProfilePicModal open={open} setOpen={setOpen} />
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
            {`${me?.first_name} ${me?.last_name}` || "Jessie Hudson"}
          </Typography>
          <Stack className="iconsSec" direction={{ xs: "column", md: "row" }}>
            <Typography className="roleText">
              {`${me?.role}` || "Admin"}
            </Typography>
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
                <Typography>
                  {`${me?.organization?.name}` || "Nova Healthcare"}
                </Typography>
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
