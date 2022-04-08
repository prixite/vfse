import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useHistory } from "react-router";
import "@src/components/common/presentational/backBtn/backBtn.scss";
const BackBtn = () => {
  const history = useHistory();
  return (
    <div className="back-btn" onClick={() => history.goBack()}>
      <ArrowRightAltIcon
        style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
      />
      <p className="back-text">Back</p>
    </div>
  );
};

export default BackBtn;
