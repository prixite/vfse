import { useEffect, Dispatch, SetStateAction } from "react";

import { EditorState, ContentState, RichUtils } from "draft-js";
import { insertNewUnstyledBlock } from "draftjs-utils";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "@src/components/common/smart/textEditor/textEditor.scss";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { useAppSelector } from "@src/store/hooks";

interface text {
  htmlText: string;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  editorState: EditorState;
}

const TextEditor = ({ htmlText, editorState, setEditorState }: text) => {
  const onTextChange = (editState) => {
    setEditorState(editState);
  };

  useEffect(() => {
    const contentBlock = htmlToDraft(htmlText);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  const { secondaryColor, buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  //setting scss variable via js
  document.documentElement.style.setProperty(
    "--richTextIconBackground",
    secondaryColor
  );
  document.documentElement.style.setProperty(
    "--buttonBackground",
    buttonBackground
  );
  document.documentElement.style.setProperty(
    "--buttonTextColor",
    buttonTextColor
  );

  return (
    <Editor
      handleReturn={(event) => {
        // override behavior for enter key
        let newEditorState = null;
        if (event.keyCode === 13 && event.shiftKey) {
          // with shift, make a new block
          newEditorState = insertNewUnstyledBlock(editorState);
        } else if (event.keyCode === 13 && !event.shiftKey) {
          // without shift, just a normal line break
          newEditorState = RichUtils.insertSoftNewline(editorState);
        }
        if (newEditorState) {
          setEditorState(newEditorState);
          return true;
        }
        return false;
      }}
      editorState={editorState}
      editorClassName="editor"
      onEditorStateChange={onTextChange}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "list",
          "colorPicker",
          "link",
          "image",
        ],
        inline: {
          options: ["bold", "italic", "underline", "strikethrough"],
          className: "richTextIcon",
        },
        list: { options: ["unordered", "ordered"] },
        link: { options: ["link"] },
        fontFamily: {
          options: ["Proxima Nova", "Calibri"],
        },
        image: {
          urlEnabled: true,
          uploadEnabled: true,
          alignmentEnabled: true,
          uploadCallback: async (item) => {
            const data = await uploadImageToS3(item);
            return { data: { link: data?.location } };
          },
          previewImage: true,
          inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          defaultSize: {
            height: "auto",
            width: "auto",
          },
        },
      }}
    />
  );
};

export default TextEditor;
