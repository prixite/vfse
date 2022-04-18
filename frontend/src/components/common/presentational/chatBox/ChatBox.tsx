import { useState, Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "@src/components/common/presentational/chatBox/chatBox.scss";
import { Box, TextareaAutosize } from "@mui/material";
import { toast } from "react-toastify";

import { api } from "@src/store/reducers/api";
import { System } from "@src/store/reducers/generated";

interface ChatBoxInterface {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  system: System;
}
const ChatBox = ({ setIsOpen, system }: ChatBoxInterface) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postChat] = api.usePostChatBotMutation();
  const [yourQuery, setYourQuery] = useState<string>("");
  const [chatResponse, setChatResponse] = useState<string>("");
  const [placeholder, setPlaceHolder] = useState<string>(
    "How may I answer your query..."
  );

  const resetQuery = () => {
    setPlaceHolder("");
    setIsLoading(false);
    setYourQuery("");
  };

  const handleChatting = () => {
    setIsLoading(true);
    postChat({ sysId: system?.id, query: yourQuery })
      .unwrap()
      .then(({ response_text: responseText }) => {
        setChatResponse(responseText);
      })
      .catch((err) => {
        toast.success(`Error occured ${err}`, {
          autoClose: 300,
          pauseOnHover: false,
        });
      })
      .finally(() => {
        resetQuery();
      });
  };

  return (
    <Box component="div" className="chatBox">
      <Box component="div" className="chatHeader">
        <p className="title">{system?.name}</p>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            setIsOpen(false);
          }}
        />
      </Box>
      <Box component="div" className="chatSection">
        <div className="chatBotResponse">
          <p>{chatResponse}</p>
        </div>
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
          placeholder={placeholder}
          style={{
            borderRadius: "7px",
            padding: "10px",
            width: "270px",
            borderColor: "light-gray",
            userSelect: "text",
            cursor: "text",
          }}
          disabled={isLoading}
        />
        {!isLoading && yourQuery ? (
          <SendIcon
            style={{
              color: "rgb(119, 60, 189)",
              width: "34px",
              height: "33px",
            }}
            onClick={() => handleChatting()}
          />
        ) : (
          <SendIcon
            style={{
              color: "#94989E",
              width: "34px",
              height: "33px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatBox;
