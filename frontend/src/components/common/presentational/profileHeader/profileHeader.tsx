import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Typography, Stack } from "@mui/material";

import user from "@src/assets/images/profile.png";
import calender from "@src/assets/svgs/g-calendar.svg";
import gmail from "@src/assets/svgs/gmail.svg";
import msg from "@src/assets/svgs/msg.svg";
import slack from "@src/assets/svgs/slack.svg";
import zoom from "@src/assets/svgs/zoom.svg";
import "@src/components/common/presentational/profileHeader/profileHeader.scss";
import { useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsMeReadQuery,
  useUsersPartialUpdateMutation,
} from "@src/store/reducers/generated";
import { useEffect, useState } from "react";
import DropzoneBox from "../dropzoneBox/DropzoneBox";

const ProfileHeader = () => {
  const [updateUser] = useUsersPartialUpdateMutation();
  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  const [mainState, setMainState] = useState("initial");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePic, setProfilePic] = useState();

  const handleUploadClick = (event) => {
    setProfilePic(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new FileReader();
    var url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setSelectedFile([reader.result]);
    };
    // console.log("url", selectedFile); // Would see a path?

    setMainState("uploaded");
    setSelectedFile(file);
  };

  // useEffect(() => {
  //   if (selectedImage?.length) {
  //     formik.setFieldValue("userProfileImage", selectedImage[0]);
  //   }
  // }, [selectedImage]);

  // const handleEditUser = async () => {
  //   setIsLoading(true);
  //   if (formik.isValid) {
  //     if (!selectedImage.length && formik.values.userProfileImage?.length) {
  //       performEditUser(formik.values.userProfileImage);
  //     } else {
  //       await uploadImageToS3(selectedImage[0]).then(
  //         async (data: S3Interface) => {
  //           performEditUser(data?.location);
  //         }
  //       );
  //     }
  //   } else {
  //     setIsLoading(false);
  //   }
  // };
  // const performEditUser = async (data: string) => {
  //   const userObject = constructObject(data);
  //   await updateUserService(props?.selectedUser, userObject, updateUser)
  //     .then(() => {
  //       setTimeout(() => {
  //         resetModal();
  //         setIsLoading(false);
  //       }, 500);
  //     })
  //     .catch((error) => {
  //       if (error?.status < 500) {
  //         const metaError = error.data.meta
  //           ? Object.keys(error.data.meta)[0] +
  //             ": " +
  //             error.data.meta[Object.keys(error.data.meta)[0]][0]
  //           : error.data[Object.keys(error.data)[0]][0];
  //         toast.error(metaError, {
  //           autoClose: 2000,
  //           pauseOnHover: false,
  //         });
  //       } else {
  //         toast.error("Error occurred while saving user");
  //       }
  //       setIsLoading(false);
  //     });
  // };
  return (
    <>
      <Box className="header">
        <Box className="headerTop">
          {/* {
            <p className="errorText" style={{ marginTop: "5px" }}>
              {formik.errors.userProfileImage}
            </p>
          } */}
          {/* <Avatar
            alt="Profile"
            className="profilePic"
            src={user}
            sx={{ width: 120, height: 120 }}
          /> */}
          {(mainState === "initial" && (
            <>
              <Avatar
                alt="Profile"
                className="profilePic"
                src={user}
                sx={{ width: 120, height: 120 }}
              />
              {/* <input
                accept="image/*"
                className="input profilePic"
                id="contained-button-file"
                type="file"
                onChange={handleUploadClick}
              /> */}
            </>
          )) ||
            (mainState === "uploaded" && (
              <>
                <Avatar
                  alt="Remy Sharp"
                  className="profilePic"
                  src={selectedFile}
                  sx={{ width: 150, height: 150, mb: 3 }}
                />
              </>
            ))}
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
