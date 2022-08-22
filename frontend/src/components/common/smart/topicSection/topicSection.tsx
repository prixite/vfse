import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import women from "@src/assets/svgs/womenAvatar.svg";
import avatarOne from "@src/assets/svgs/avatarOne.svg";
import avatarTwo from "@src/assets/svgs/avatarTwo.svg";
import avatarThree from "@src/assets/svgs/avatarThree.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "@src/components/common/smart/topicSection/topicSection.scss";

const TopicSection = () => {
  return (
    <Box className="topicSection">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={3} alignItems="center">
          <Avatar alt="Avatar" src={women} />
          <Stack>
            <Typography fontWeight="bold">{"Jessie Hudson"}</Typography>
            <Typography>{"3 hours ago"}</Typography>
          </Stack>
        </Stack>
        <MoreVertIcon />
      </Stack>
      <Stack direction="row" gap={2} mt={2}>
        <Button className="topicButton" size="small">
          {"Ultrasound"}
        </Button>
        <Button className="topicButton" size="small">
          {"FAQ"}
        </Button>
        <Button className="topicButton" size="small">
          {"Error"}
        </Button>
      </Stack>
      <Typography fontWeight="bold" my={2}>
        {"Clinical Specialist for MedTronics"}
      </Typography>
      <Typography>
        {
          "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a 'lifestyle' in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and..."
        }
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        mt={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={5}
      >
        <Stack gap={1} direction="row" alignItems="center">
          <AvatarGroup max={3}>
            <Avatar alt="Remy Sharp" src={avatarOne} />
            <Avatar alt="Travis Howard" src={avatarTwo} />
            <Avatar alt="Cindy Baker" src={avatarThree} />
          </AvatarGroup>
          <Typography>{"24 followers"}</Typography>
        </Stack>
        <Stack gap={1} direction="row" alignItems="center">
          <ChatBubbleOutlineIcon
            sx={{
              color: "#696F77",
            }}
          />
          <Typography ml={1}>{"142"}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TopicSection;
