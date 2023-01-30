import { FC, useEffect, useMemo, useState } from "react";

import { Grid, TextField, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";

import constantsData from "@src/localization/en.json";
import { api, Folder, Document } from "@src/store/reducers/api";

import "@src/components/common/presentational/articleMetaCard/articleMetaCard.scss";

interface ArticleMetaCardProps {
  articleData: Document;
  title: string;
  setFolder: React.Dispatch<React.SetStateAction<number>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<number[]>>;
}

const ToggleButton = styled(MuiToggleButton)(
  ({ selectedColor }: { selectedColor?: string | number }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white !important",
      backgroundColor: `${selectedColor} !important`,
    },
  }),
);
const ArticleMetaCard: FC<ArticleMetaCardProps> = ({
  articleData,
  setFolder,
  title,
  setTitle,
  setCategory,
}) => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const { categoryText, folderText, titleText } = constantsData.articleModal;
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();
  const [catFormats, setCatFormats] = useState<number[]>([
    ...articleData.categories,
  ]);
  const [folFormats, setFolFormats] = useState<number | number[]>(
    articleData.folder,
  );

  const finalFolders = useMemo(() => {
    let solFolders = [];
    categoriesList.forEach((category) => {
      if (catFormats.includes(category?.id)) {
        category.folders.forEach((folder) => {
          if (catFormats.every((el) => folder.categories.includes(el))) {
            solFolders.push(folder);
          }
        });
        const uniqueArr = Array.from(new Set(solFolders.map((a) => a.id))).map(
          (id) => {
            return solFolders.find((a) => a.id === id);
          },
        );
        solFolders = uniqueArr;
      }
    });
    return solFolders;
  }, [catFormats, isCategoriesLoading]);

  useEffect(() => {
    if (articleData.categories.length) {
      setFolderList([...finalFolders]);
    } else {
      setFolderList([]);
    }
  }, [catFormats, isCategoriesLoading]);

  const handleOnChangeCategories = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number[],
  ) => {
    setCatFormats(newFormats);
    setCategory(newFormats);
  };

  const handleOnChangeFolders = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number,
  ) => {
    setFolFormats(newFormats);
    setFolder(newFormats);
  };

  return (
    <div className="card">
      {!isCategoriesLoading ? (
        <div className="info-section">
          <Grid item xs={12}>
            <div className="info-section">
              <p className="info-label">{categoryText}(1)</p>
              <ToggleButtonGroup
                defaultValue="none"
                value={catFormats || ""}
                color="primary"
                aria-label="text formatting"
                style={{ flexWrap: "wrap" }}
                onChange={handleOnChangeCategories}
              >
                {categoriesList.length
                  ? categoriesList.map((item, index) => (
                      <ToggleButton
                        key={index}
                        value={item.id}
                        className="toggle-btn"
                        selectedColor={`${item?.color}`}
                      >
                        {item?.name}
                      </ToggleButton>
                    ))
                  : ""}
              </ToggleButtonGroup>
            </div>
          </Grid>
          <>
            {folderList.length > 0 && (
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{folderText}</p>
                  <ToggleButtonGroup
                    value={folFormats || ""}
                    color="primary"
                    aria-label="text formatting"
                    style={{ flexWrap: "wrap" }}
                    onChange={handleOnChangeFolders}
                    exclusive
                  >
                    {folderList.length
                      ? folderList.map((item, index) => (
                          <ToggleButton
                            key={index}
                            value={item.id}
                            className="toggle-btn"
                            selectedColor={`#773cbd`}
                          >
                            {item?.name}
                          </ToggleButton>
                        ))
                      : ""}
                  </ToggleButtonGroup>
                </div>
              </Grid>
            )}
            <p className="info-label">{titleText}</p>
            <TextField
              autoComplete="off"
              name="title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="info-field"
              variant="outlined"
              size="small"
            />
          </>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ArticleMetaCard;
