import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "@src/components/common/presentational/chatBox/chatBox.scss";
import { Box, TextareaAutosize } from "@mui/material";
import { toast } from "react-toastify";

import { ChatBoxInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { api } from "@src/store/reducers/api";

const ChatBox = ({ setIsOpen, systemID }: ChatBoxInterface) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postChat] = api.usePostChatBotMutation();
  const [yourQuery, setYourQuery] = useState<string>("");
  const [chatResponse, setChatResponse] = useState<string>("");
  const [placeholder, setPlaceHolder] = useState<string>(
    "How may I awnser your Query..."
  );

  const resetQuery = () => {
    setPlaceHolder("");
    setIsLoading(false);
    setYourQuery("");
  };

  const handleChatting = () => {
    setIsLoading(true);
    postChat({ sysId: systemID, query: yourQuery })
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
        <p className="title">System-{systemID}</p>
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
            height: "54px",
            width: "270px",
            borderColor: "light-gray",
            userSelect: "text",
            cursor: "text",
          }}
          disabled={isLoading}
        />
        {!isLoading && (
          <SendIcon
            style={{
              color: "rgb(119, 60, 189)",
              width: "34px",
              height: "33px",
            }}
            onClick={() => handleChatting()}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatBox;
