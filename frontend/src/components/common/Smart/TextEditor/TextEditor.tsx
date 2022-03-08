import { useState, useEffect } from "react";

import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface text {
  htmlText: string;
}

const TextEditor = ({ htmlText }: text) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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
  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onTextChange}
    />
  );
};

export default TextEditor;
