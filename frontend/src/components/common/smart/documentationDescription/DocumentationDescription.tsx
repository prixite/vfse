import { useEffect, useState } from "react";

import { Box, Grid, Typography } from "@mui/material";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ArticleDescriptionCard from "@src/components/common/presentational/articleDescriptionCard/ArticleDescriptionCard";
import ArticleMetaCard from "@src/components/common/presentational/articleMetaCard/articleMetaCard";
import ArticleOverviewCard from "@src/components/common/presentational/articleOverviewCard/ArticleOverviewCard";
import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import DocumentationBtnSection from "@src/components/common/presentational/documentationBtnSection/DocumentationBtnSection";
import TextEditor from "@src/components/common/smart/textEditor/TextEditor";
import Hint from "@src/components/shared/popUps/articleModal/Hint";
import { timeOut } from "@src/helpers/utils/constants";
import {
  addIdToHeadings,
  convertImages,
  toastAPIError,
} from "@src/helpers/utils/utils";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import "@src/components/common/smart/documentationDescription/documentationDescription.scss";

const DocumentationDescription = () => {
  const { state } = useLocation();
  const [editText, setEditText] = useState(state?.edit);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlText, setHtmlText] = useState("");
  const { docId } = useParams<{ docId: string }>();
  const { data: articleData } = api.useGetArticleQuery({ id: parseInt(docId) });
  const [updateArticle] = api.useUpdateArticleMutation();

  const handleEditText = (val) => setEditText(val);

  const [category, setCategory] = useState<number[]>([]);
  const [folder, setFolder] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");

  const saveText = () => {
    let htmlString = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    htmlString = addIdToHeadings(htmlString);
    htmlString = convertImages(htmlString); //calling to resolve a bug in package

    updateArticle({
      id: parseInt(docId),
      document: {
        ...articleData,
        folder: folder,
        categories: [...category],
        text: htmlString,
        title: title,
      },
    })
      .unwrap()
      .then(() => {
        toast.success("Article Updated Successfully.", {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        setHtmlText(htmlString);
      })
      .catch((err) => {
        toastAPIError("Some Error Occured", err.status, err.data);
      });
    setEditText(false);
  };

  useEffect(() => {
    setHtmlText(articleData?.text);
    setCategory(
      articleData.categories.length ? [...articleData.categories] : []
    );
    setFolder(articleData?.folder);
    setTitle(articleData?.title);
  }, [articleData]);

  const { buttonBackground } = useAppSelector((state) => state.myTheme);

  return (
    <Box component="div" className="documentation-section">
      <BackBtn />
      <Typography
        color={buttonBackground}
        variant="h4"
        textTransform="capitalize"
      >
        {articleData?.title}
      </Typography>
      <Grid
        container
        spacing={5}
        style={{ marginTop: "20px" }}
        sx={{ flexDirection: { xs: "column-reverse", md: "row" } }}
      >
        <Grid
          item={true}
          xs={12}
          lg={7}
          xl={9}
          md={7}
          style={{ paddingTop: "8px" }}
        >
          {editText && htmlText ? (
            <TextEditor
              htmlText={htmlText}
              editorState={editorState}
              setEditorState={setEditorState}
            />
          ) : (
            <ArticleDescriptionCard overview={htmlText} />
          )}
        </Grid>
        <Grid
          item={true}
          xs={12}
          lg={5}
          xl={3}
          md={5}
          style={{ paddingTop: "13px" }}
        >
          <DocumentationBtnSection
            handleEditText={handleEditText}
            editText={editText}
            saveText={saveText}
          />
          {editText && htmlText ? (
            <>
              <Hint />
              <ArticleMetaCard
                articleData={articleData}
                title={title}
                setCategory={setCategory}
                setFolder={setFolder}
                setTitle={setTitle}
              />
            </>
          ) : (
            <ArticleOverviewCard htmlText={htmlText} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentationDescription;
