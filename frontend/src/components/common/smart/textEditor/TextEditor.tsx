import { useEffect, Dispatch, SetStateAction } from "react";

import { EditorState, ContentState, Modifier, RichUtils } from "draft-js";
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

  function isListBlock(block) {
    if (block) {
      const blockType = block.getType();
      return (
        blockType === "unordered-list-item" || blockType === "ordered-list-item"
      );
    }
    return false;
  }

  function removeSelectedBlocksStyle(editorState) {
    const newContentState = RichUtils.tryToRemoveBlockStyle(editorState);
    if (newContentState) {
      return EditorState.push(
        editorState,
        newContentState,
        "change-block-type"
      );
    }
    return editorState;
  }

  function insertNewUnstyledBlock(editorState) {
    const newContentState = Modifier.splitBlock(
      editorState.getCurrentContent(),
      editorState.getSelection()
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "split-block"
    );
    return removeSelectedBlocksStyle(newEditorState);
  }

  function getSelectedBlocksMap(editorState) {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const startKey = selectionState.getStartKey();
    const endKey = selectionState.getEndKey();
    const blockMap = contentState.getBlockMap();
    return blockMap
      .toSeq()
      .skipUntil((_, k) => k === startKey)
      .takeUntil((_, k) => k === endKey)
      .concat([[endKey, blockMap.get(endKey)]]);
  }

  function changeBlocksDepth(editorState, adjustment, maxDepth) {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    let blockMap = contentState.getBlockMap();
    const blocks = getSelectedBlocksMap(editorState).map((block) => {
      let depth = block.getDepth() + adjustment;
      depth = Math.max(0, Math.min(depth, maxDepth));
      return block.set("depth", depth);
    });
    blockMap = blockMap.merge(blocks);
    return contentState.merge({
      blockMap,
      selectionBefore: selectionState,
      selectionAfter: selectionState,
    });
  }

  function changeDepth(editorState, adjustment, maxDepth) {
    const selection = editorState.getSelection();
    let key;
    if (selection.getIsBackward()) {
      key = selection.getFocusKey();
    } else {
      key = selection.getAnchorKey();
    }
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(key);
    const type = block.getType();
    if (type !== "unordered-list-item" && type !== "ordered-list-item") {
      return editorState;
    }
    const blockAbove = content.getBlockBefore(key);
    if (!blockAbove) {
      return editorState;
    }
    const typeAbove = blockAbove.getType();
    if (typeAbove !== type) {
      return editorState;
    }
    const depth = block.getDepth();
    if (adjustment === 1 && depth === maxDepth) {
      return editorState;
    }
    const adjustedMaxDepth = Math.min(blockAbove.getDepth() + 1, maxDepth);
    const withAdjustment = changeBlocksDepth(
      editorState,
      adjustment,
      adjustedMaxDepth
    );
    return EditorState.push(editorState, withAdjustment, "adjust-depth");
  }

  function handleHardNewlineEvent(editorState) {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const blockKey = selection.getStartKey();
      const block = contentState.getBlockForKey(blockKey);
      if (!isListBlock(block)) {
        return insertNewUnstyledBlock(editorState);
      }
      if (isListBlock(block) && block.getLength() === 0) {
        const depth = block.getDepth();
        if (depth === 0) {
          return removeSelectedBlocksStyle(editorState);
        }
        if (depth > 0) {
          return changeDepth(editorState, -1, depth);
        }
      }
    }
    return editorState;
  }

  function isHardNewLIneEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    return (
      e.code === "Enter" &&
      !(
        e.getModifierState("Shift") ||
        e.getModifierState("Alt") ||
        e.getModifierState("Control")
      )
    );
  }

  // handleReturn
  const handleReturn = (event, editorStates) => {
    if (isHardNewLIneEvent(event)) {
      //on enter press
      const newEditorState = handleHardNewlineEvent(editorStates); // break block
      setEditorState(RichUtils.insertSoftNewline(newEditorState)); // add <br> tag
      return true;
    }
    // else add <br> tag without breaking block
    return false;
  };

  return (
    <Editor
      handleReturn={handleReturn}
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
