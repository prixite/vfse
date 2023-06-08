import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import useStyles from "@src/components/common/smart/folderDetailSection/Style";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import { api, Document } from "@src/store/reducers/api";
import "@src/components/common/smart/folderDetailSection/folderDetailSection.scss";

const FolderDetailSection = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [articlesList, setArticlesList] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { folderId } = useParams<{ folderId: string }>();
  const { data: folderData } = api.useGetFolderQuery({
    id: parseInt(folderId),
  });

  const handleSearchQuery = (searchQuery: string) => {
    const dataForSearch = [
      ...folderData.documents.filter(
        (data) =>
          data?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data?.text.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];
    setArticlesList(dataForSearch);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (query.length >= 2) {
      handleSearchQuery(query);
    } else {
      !!folderData.documents && setArticlesList(folderData.documents);
    }
  }, [query, folderData]);

  return (
    <>
      <Box component="div" className="FolderDetailSection">
        <BackBtn />
        <h1 className="main-heading">{folderData?.name}</h1>
        <TopViewBtns
          setOpen={setOpen}
          path="knowledge-base"
          setSearchText={setQuery}
          searchText={query}
          actualData={folderData?.documents}
          setData={setArticlesList}
        />
        {folderData.documents.length && articlesList.length ? (
          <Grid
            container
            spacing={2}
            style={{ marginTop: "9px" }}
            className={classes.container}
          >
            {articlesList?.map((item, index) => (
              <Grid
                item={true}
                xs={12}
                sm={4}
                xl={2}
                md={4}
                lg={3}
                key={index}
                className={classes.card}
              >
                <KnowledgeTopCard
                  title={item?.title}
                  description={item?.text}
                  id={item?.id}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <NoDataFound
            search
            setQuery={setQuery}
            queryText={query}
            title={t("Sorry! No results found. :(")}
            description={t("Try Again")}
          />
        )}
      </Box>
      <ArticleModal open={open} handleClose={handleClose} />
    </>
  );
};

export default FolderDetailSection;
