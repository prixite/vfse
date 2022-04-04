import CloseIcon from "@mui/icons-material/Close";
import { Box, TextareaAutosize } from "@mui/material";
import "@src/components/common/presentational/chatBox/chatBox.scss";
const ChatBox = () => {
  return (
    <Box component="div" className="chatBox">
      <Box component="div" className="chatHeader">
        <p className="title">ChatBot</p>
        <CloseIcon style={{ cursor: "pointer" }} />
      </Box>
      <Box component="div" className="chatSection"></Box>
      <Box component="div" className="InputSection">
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          aria-label="maximum height"
          placeholder="Ask something..."
        />
      </Box>
    </Box>
  );
};

export default ChatBox;
