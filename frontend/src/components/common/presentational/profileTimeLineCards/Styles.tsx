import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  timelineInfo: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    borderRadius: "8px",
    background: "white",
    boxShadow: "3px 3px 12px rgba(10, 35, 83, 0.08)",
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    marginBottom: "16px",
  },
  imgStyling: {
    height: "38px",
    width: "38px",
    overflow: "hidden",
    display: "flex",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: "14px",
    marginTop: "16px",
    lineHeight: "24px",
    color: "#151e29",
  },
  cardDetail: {
    fontFamily: "ProximaNova-Regular",
    fontStyle: "normal",
    fontWeight: "normal",
    marginTop: "8px",
    fontSize: "16px",
    lineHeight: "24px",
    color: "#3d4651",
  },
  cardImage: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "24px",
  },
  postImage: {
    height: "316px",
    width: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    objectFit: "contain",
  },
  cardFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "30px",
  },
  profileSide: {
    display: "flex",
    flexDirection: "row",
    marginLeft:"10px"
  },

  followerImgContainer: {
    display: "flex",
    alignItems: "center",
  },
  followerText: {
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "18px",
    fontStyle: "normal",
    marginLeft: "4px",
    display: "flex",
    alignItems: "center",
    color: "#696f77",
  },
  imgStylingProfiles: {
    width: "35px",
    height: "32px",
    borderRadius: "50%",
    marginLeft: "-10px",
  },
  messageSide: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "5px",
    cursor: "pointer",
  },
  messageTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  messageText: {
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "18px",
    fontStyle: "normal",
    display: "flex",
    alignItems: "center",
    color: "#696f77",
  },
  imgStylingMessage: {
    width: "16px",
    height: "16px",
    marginRight: "4px",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfoWrapper: {
    display: "flex",
    overflow: "hidden",
  },
  userInfo: {
    marginLeft: "8px",
  },
  userName: {
    fontFamily: "ProximaNova-Regular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "20px",
    display: "flex",
    alignItems: "center",
    color: "#151e29",
  },
  postTime: {
    fontFamily: "ProximaNova-Regular",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "18px",
    display: "flex",
    alignItems: "center",
    color: "#696f77",
  },
  follow: {
    height: "32px",
    boxShadow: "unset",
    padding: "4px 16px",
    textTransform: "unset",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },
  categoriesTags: {
    marginTop: "15px",
    display: "flex",
  },
  tag: {
    padding: "7px",
    background: "#efe1ff",
    borderRadius: "6px",
    marginRight: "8px",
    color: "#773cbd",
    fontWeight: "600",
    fontSize: "12px",
  },
  follower_img_container: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useStyles;
