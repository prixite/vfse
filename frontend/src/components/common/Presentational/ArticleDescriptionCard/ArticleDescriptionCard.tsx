import "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard.scss";

interface ArticleDescription {
  overview: string;
  description: string;
  startGuide: string;
}

const ArticleDescriptionCard = ({
  overview,
  description,
  startGuide,
}: ArticleDescription) => {
  return (
    <div className="article-description">
      <h1 className="heading" style={{ marginBottom: "18px" }}>
        Overview
      </h1>
      <p className="description">{overview}</p>
      <h1 className="heading" style={{ margin: "18px 0" }}>
        Getting started
      </h1>
      <p className="description">{description}</p>
      <h1 className="heading" style={{ margin: "18px 0" }}>
        Start guide
      </h1>
      <p className="description">{startGuide}</p>
    </div>
  );
};

export default ArticleDescriptionCard;
