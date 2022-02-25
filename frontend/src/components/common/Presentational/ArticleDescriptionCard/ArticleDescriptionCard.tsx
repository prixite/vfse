import { localizedData } from "@src/helpers/utils/language";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
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
  const localization : LocalizationInterface = localizedData();
  const { title1, title2, title3 } = localization.articleDescription;
  return (
    <div className="article-description">
      <h1 className="heading" style={{ marginBottom: "18px" }}>
        {title1}
      </h1>
      <p className="description">{overview}</p>
      <h1 className="heading" style={{ margin: "18px 0" }}>
        {title2}
      </h1>
      <p className="description">{description}</p>
      <h1 className="heading" style={{ margin: "18px 0" }}>
        {title3}
      </h1>
      <p className="description">{startGuide}</p>
    </div>
  );
};

export default ArticleDescriptionCard;
