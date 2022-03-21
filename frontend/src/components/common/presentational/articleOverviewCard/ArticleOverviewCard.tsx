import "@src/components/common/presentational/articleOverviewCard/articleOverviewCard.scss";

const ArticleOverviewCard = () => {
  return (
    <div className="overview">
      <div className="card">
        <h1 className="heading">Overview</h1>
        <p className="description">Getting started</p>
        <p className="description">Quick start guide</p>
        <p className="description">Your next step</p>
      </div>
    </div>
  );
};

export default ArticleOverviewCard;
