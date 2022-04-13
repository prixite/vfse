import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import "@src/components/common/presentational/chatBox/chatBox.scss";
import { Box, Button, TextareaAutosize } from "@mui/material";
import { toast } from "react-toastify";

import { ChatBoxInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { api } from "@src/store/reducers/api";

const ChatBox = ({ setIsOpen, systemID }: ChatBoxInterface) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postChat] = api.usePostChatBotMutation();
  const [yourQuery, setYourQuery] = useState<string>("");
  const [chatResponse, setChatResponse] = useState<string>("");

  const resetQuery = () => {
    setYourQuery("");
  };

  const handleChatting = () => {
    setIsLoading(true);
    postChat({ sysId: systemID, query: yourQuery })
      .unwrap()
      .then(({ response_text: responseText }) => {
        toast.success("Article Successfully added", {
          autoClose: 300,
          pauseOnHover: false,
        });
        setChatResponse(responseText);
        resetQuery();
      })
      .catch((err) => {
        toast.success(`Error occured ${err}`, {
          autoClose: 300,
          pauseOnHover: false,
        });
      })
      .finally(() => {
        setIsLoading(false);
        resetQuery();
      });
  };

  return (
    <Box component="div" className="chatBox">
      <Box component="div" className="chatHeader">
        <p className="title">System-{systemID}</p>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            setIsOpen(false);
          }}
        />
      </Box>
      <Box component="div" className="chatSection">
        <pre>{chatResponse}</pre>
      </Box>
      <Box component="div" className="InputSection">
        <TextareaAutosize
          onChange={(e) => {
            setYourQuery(e.target.value.toString());
          }}
          value={yourQuery}
          minRows={1}
          maxRows={3}
          aria-label="maximum height"
          placeholder={`How may I awnser your Query...`}
          style={{
            borderRadius: "7px",
            height: "54px",
            width: "inherit",
            borderColor: "black",
          }}
        />
      </Box>
      {isLoading ? (
        <Button
          variant="outlined"
          style={{
            padding: "0px",
            marginLeft: "218px",
            height: "50px",
            marginRight: "12px",
          }}
          onClick={() => handleChatting()}
        >
          {" "}
          Send{" "}
        </Button>
      ) : (
        <Button
          variant="contained"
          style={{
            padding: "0px",
            marginLeft: "218px",
            height: "50px",
            marginRight: "12px",
          }}
          onClick={() => handleChatting()}
        >
          {" "}
          Send{" "}
        </Button>
      )}
    </Box>
  );
};

export default ChatBox;
