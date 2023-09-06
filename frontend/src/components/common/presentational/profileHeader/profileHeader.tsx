import { useState } from "react";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Typography, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import calender from "@src/assets/svgs/g-calendar.svg";
import gmail from "@src/assets/svgs/gmail.svg";
import msg from "@src/assets/svgs/msg.svg";
import slack from "@src/assets/svgs/slack.svg";
import zoom from "@src/assets/svgs/zoom.svg";
import { constants } from "@src/helpers/utils/constants";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import { useUsersRolesListQuery } from "@src/store/reducers/api";
// import { useOrganizationsMeReadQuery } from "@src/store/reducers/generated";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/generatedWrapper";

import EditProfilePicModal from "../editProfilePicModal/editProfilePicModal";

import "@src/components/common/presentational/profileHeader/profileHeader.scss";

const ProfileHeader = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    me && setOpen(true);
  };
  const navigate = useNavigate();
  const { data: usersRoles } = useUsersRolesListQuery();
  const { data: me } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
  const defaultOrganizationData = useAppSelector(
    (state) => state.organization.currentOrganization
  );
  const { organizationRoute } = constants;

  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const roleFound = usersRoles?.find((x) => {
    return x?.value === me?.role;
  });
  return (
    <>
      <Box className="header">
        <Box className="headerTop">
          <Button
            className="editProfileBtn"
            variant="contained"
            onClick={() => {
              navigate(
                `/${organizationRoute}/${defaultOrganizationData.id}/account`
              );
            }}
          >
            <span style={{ paddingTop: 6, paddingRight: 6 }}>
              <EditIcon fontSize="small" />
            </span>
            <span className="show-hide">{t("Edit")}</span>
          </Button>
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
            sx={{
              "&:hover": {
                color: `${buttonBackground} !important`,
              },
            }}
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
              {roleFound?.title || "Admin"}
            </Typography>
            <Stack
              className="icons"
              direction="row"
              gap={2}
              mt={{ xs: "1rem", md: 0 }}
            >
              <a href={`mailto:{${me?.email}`} target="_blank" rel="noreferrer">
                <img src={gmail} />
              </a>
              {me?.calender_link ? (
                <a href={me?.calender_link} target="_blank" rel="noreferrer">
                  <img src={calender} />
                </a>
              ) : (
                ""
              )}
              {me?.zoom_link ? (
                <a href={me?.zoom_link} target="_blank" rel="noreferrer">
                  <img src={zoom} />
                </a>
              ) : (
                ""
              )}
              {me?.slack_link ? (
                <a href={me?.slack_link} target="_blank" rel="noreferrer">
                  <img src={slack} />
                </a>
              ) : (
                ""
              )}
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
                <Typography>{me?.email}</Typography>
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
                <Typography>{me?.location}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default ProfileHeader;
