import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard.scss";

interface ArticleDescription {
  overview: string;
}

const ArticleDescriptionCard = ({ overview }: ArticleDescription) => {
  const localization: LocalizationInterface = localizedData();
  const { title1 } = localization.articleDescription;
  return (
    <div className="article-description">
      <h1 className="heading" style={{ marginBottom: "18px" }}>
        {title1}
      </h1>
      <p className="description">{overview}</p>
    </div>
  );
};

export default ArticleDescriptionCard;
