import { FC, useEffect, useState } from "react";

import { MenuItem, Select } from "@mui/material";

import constantsData from "@src/localization/en.json";
import { api, Folder, Document } from "@src/store/reducers/api";
import "@src/components/common/presentational/articleMetaCard/articleMetaCard.scss";

interface ArticleMetaCardProps {
  articleData: Document;
  category: number;
  folder: number;
  setFolder: React.Dispatch<React.SetStateAction<number>>;
  setCategory: React.Dispatch<React.SetStateAction<number>>;
}

const ArticleMetaCard: FC<ArticleMetaCardProps> = ({
  articleData,
  category,
  folder,
  setFolder,
  setCategory,
}) => {
  const [folderList, setFolderList] = useState<Folder[]>([]);

  const { categoryText, folderText } = constantsData.articleModal;
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();

  useEffect(() => {
    if (articleData.categories.length) {
      categoriesList.forEach((category) => {
        if (category?.id === articleData.categories[0]) {
          setFolderList([...category.folders]);
          setFolder(articleData?.folder);
          setCategory(articleData?.categories[0]);
        }
      });
    }
  }, [isCategoriesLoading]);

  return (
    <div className="card">
      {!isCategoriesLoading ? (
        <div className="info-section">
          <p className="info-label">{categoryText}</p>
          <Select
            fullWidth
            inputProps={{ "aria-label": "Without label" }}
            style={{ height: "43px", borderRadius: "8px" }}
            disabled={isCategoriesLoading}
            MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoriesList.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {folderList.length > 0 && (
            <>
              <p className="info-label">{folderText}</p>
              <Select
                fullWidth
                inputProps={{ "aria-label": "Without label" }}
                style={{ height: "43px", borderRadius: "8px" }}
                disabled={isCategoriesLoading}
                MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
              >
                {folderList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ArticleMetaCard;
