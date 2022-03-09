import "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard.scss";

interface ArticleDescription {
  overview: string;
}

const ArticleDescriptionCard = ({ overview }: ArticleDescription) => {
  return (
    <div className="article-description">
      <div dangerouslySetInnerHTML={{ __html: overview }} />
    </div>
  );
};

export default ArticleDescriptionCard;
