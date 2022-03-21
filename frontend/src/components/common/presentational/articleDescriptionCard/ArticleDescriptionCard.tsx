import "@src/components/common/presentational/articleDescriptionCard/articleDescriptionCard.scss";

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
