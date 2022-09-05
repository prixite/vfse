import noCommentsLogo from "@src/assets/images/no-messages.png";
import "@src/components/common/presentational/noCommentsFound/noCommentsFound.scss";
import constantsData from "@src/localization/en.json";
const NoCommentsFound = () => {
  const { noCommentFound } = constantsData;
  return (
    <div className="NoCommentsFound">
      <div className="Logo">
        <img src={noCommentsLogo} />
      </div>
      <h3 className="Heading">{noCommentFound.noComments}</h3>
      <p className="description">{noCommentFound.share}</p>
    </div>
  );
};

export default NoCommentsFound;
