import { useEffect, useState } from "react";
import "@src/components/common/presentational/articleOverviewCard/articleOverviewCard.scss";
interface ArticleOverviewCardProps {
  htmlText: string;
}
const ArticleOverviewCard = ({ htmlText }: ArticleOverviewCardProps) => {
  const [tableContents, setTableContents] = useState([]);
  const getHeadings = () => {
    const stripedHeadings = htmlText.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/g);
    if (stripedHeadings && stripedHeadings?.length) {
      //removing p tags from string
      const headingsText = stripedHeadings.map((heading) => {
        const htmlToString = heading.replace(/<[^>]+>/g, "");
        return htmlToString.replace(/&#?[a-z0-9]{2,8};/g, "");
      });

      setTableContents(headingsText);
    }
  };

  const renderHeadings = () => {
    return tableContents.map((content, i) => {
      if (i === 0) {
        return <h1 className="heading">{content?.toLowerCase()}</h1>;
      } else {
        return <p className="description">{content?.toLowerCase()}</p>;
      }
    });
  };

  useEffect(() => {
    if (htmlText) {
      getHeadings();
    }
  }, [htmlText]);
  return (
    <div className="overview">
      {tableContents && tableContents.length ? (
        <div className="card">{renderHeadings()}</div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ArticleOverviewCard;
