import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router";
import "@src/components/common/presentational/backBtn/backBtn.scss";
const BackBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="back-btn">
      <div className="back-btn-container" onClick={() => navigate(-1)}>
        <ArrowRightAltIcon
          style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
        />
        <p className="back-text">Back</p>
      </div>
    </div>
  );
};

export default BackBtn;
