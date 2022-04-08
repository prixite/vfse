import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import ArticleDescriptionCard from "@src/components/common/presentational/articleDescriptionCard/ArticleDescriptionCard";
import ArticleOverviewCard from "@src/components/common/presentational/articleOverviewCard/ArticleOverviewCard";
import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import DocumentationBtnSection from "@src/components/common/presentational/documentationBtnSection/DocumentationBtnSection";
import DocumentationMobileDescription from "@src/components/common/smart/documentationDescription/DocumentationMobileDescription";
import TextEditor from "@src/components/common/smart/textEditor/TextEditor";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";

import "@src/components/common/smart/documentationDescription/documentationDescription.scss";

const obj = {
  overview:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. ",
  startGuide:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. ",
  image: "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
};

const text = `
<h2 style="margin-bottom: 20px"><br>    <span style="font-size: 24px; color:#773cbd">OverView</span><br></h2>
<p> <span style=font-size: 18px> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </span></p>
`;

const DocumentationDescription = () => {
  const [browserWidth] = useWindowSize();
  const [editText, setEditText] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlText, setHtmlText] = useState("");
  const localization: LocalizationInterface = localizedData();
  const { title } = localization.document;

  const handleEditText = (val) => setEditText(val);
  const saveText = () => {
    const htmlString = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlText(htmlString);
    setEditText(false);
  };

  useEffect(() => {
    setHtmlText(text);
  }, []);

  return (
    <Box component="div" className="documentation-section">
      <BackBtn />
      {browserWidth < mobileWidth && browserWidth !== 0 ? (
        <DocumentationMobileDescription overview={obj.overview} title={title} />
      ) : (
        <Grid container spacing={5} style={{ marginTop: "20px" }}>
          <Grid
            item={true}
            xs={12}
            lg={7}
            xl={9}
            md={7}
            style={{ paddingTop: "8px" }}
          >
            {editText ? (
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
            <ArticleOverviewCard />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DocumentationDescription;
