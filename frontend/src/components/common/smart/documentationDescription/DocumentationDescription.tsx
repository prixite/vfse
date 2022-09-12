import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ArticleDescriptionCard from "@src/components/common/presentational/articleDescriptionCard/ArticleDescriptionCard";
import ArticleOverviewCard from "@src/components/common/presentational/articleOverviewCard/ArticleOverviewCard";
import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import DocumentationBtnSection from "@src/components/common/presentational/documentationBtnSection/DocumentationBtnSection";
import TextEditor from "@src/components/common/smart/textEditor/TextEditor";
import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { api } from "@src/store/reducers/api";
import "@src/components/common/smart/documentationDescription/documentationDescription.scss";

const DocumentationDescription = () => {
  const { state } = useLocation();
  const [editText, setEditText] = useState(state?.edit);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlText, setHtmlText] = useState("");
  const { docId } = useParams<{ docId: string }>();
  const { toastData } = constantsData;
  const { data: articleData } = api.useGetArticleQuery({ id: parseInt(docId) });
  const [updateArticle] = api.useUpdateArticleMutation();

  const handleEditText = (val) => setEditText(val);
  const getTitle = (htmlString) => {
    const stripedHeadings = htmlString.match(/<h[1-6]>(.*?)<\/h[1-6]>/g);
    if (stripedHeadings && stripedHeadings?.length) {
      //removing p tags from string
      const htmlToString = stripedHeadings[0].replace(/<[^>]+>/g, "");
      //removing any html encoded entities
      const title = htmlToString.replace(/&#?[a-z0-9]{2,8};/g, "");
      return title.trim() || "";
    }
  };

  const saveText = () => {
    const htmlString = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const title = getTitle(htmlString);
    updateArticle({
      id: parseInt(docId),
      document: { ...articleData, text: htmlString, title: title },
    })
      .unwrap()
      .then(() => {
        toast.success(toastData.articleUpdateSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        setHtmlText(htmlString);
      })
      .catch((err) => {
        toastAPIError("Some Error Occured", err.originalStatus);
      });
    setEditText(false);
  };

  useEffect(() => {
    setHtmlText(articleData?.text);
  }, [articleData]);

  return (
    <Box component="div" className="documentation-section">
      <BackBtn />
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
          <ArticleOverviewCard htmlText={htmlText} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentationDescription;
