import noCommentsLogo from "@src/assets/images/no-messages.png";
import "@src/components/common/Presentational/NoCommentsFound/NoCommentsFound.scss";
const NoCommentsFound = () => {
  return (
    <div className="NoCommentsFound">
      <div className="Logo">
        <img src={noCommentsLogo} />
      </div>
      <h3 className="Heading">This system has no comments</h3>
      <p className="description">Start Sharing your thoughts</p>
    </div>
  );
};

export default NoCommentsFound;
