import { useState, Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "@src/components/common/presentational/chatBox/chatBox.scss";
import { Box, TextField } from "@mui/material";
import { toast } from "react-toastify";

import constants from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { System } from "@src/store/reducers/generated";

interface ChatBoxInterface {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  system: System;
}
const ChatBox = ({ setIsOpen, system }: ChatBoxInterface) => {
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const { chatBox, toastData } = constants;
  const [isLoading, setIsLoading] = useState(false);
  const [postChat] = api.usePostChatBotMutation();
  const [yourQuery, setYourQuery] = useState<string>("");
  const [chatResponse, setChatResponse] = useState<string>("");
  const [placeholder, setPlaceHolder] = useState<string>(
    chatBox.placeholderText
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
        toast.error(
          err.originalStatus === 500
            ? `${toastData.chatBoxReqProceedError}`
            : `${toastData.chatBoxErrorOcccured} ${err?.error}.`,
          {
            autoClose: 1000,
            pauseOnHover: false,
          }
        );
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
        <TextField
          id="outlined-basic"
          variant="outlined"
          autoComplete="off"
          placeholder={placeholder}
          onChange={(e) => {
            setYourQuery(e.target.value.toString());
          }}
          value={yourQuery}
          disabled={isLoading}
          sx={{
            width: "inherit",
            "&:hover fieldset": {
              borderColor: "grey",
            },
          }}
        />
        {!isLoading && yourQuery ? (
          <div
            className="sendIcon-Container"
            style={{
              backgroundColor: `${buttonBackground}`,
            }}
          >
            <SendIcon
              className="sendIcon"
              onClick={() => handleChatting()}
              style={{ color: "white", cursor: "pointer" }}
            />
          </div>
        ) : (
          <div
            className="sendIcon-Container"
            style={{
              border: `2px solid #94989E`,
            }}
          >
            <SendIcon className="sendIcon" style={{ color: `#94989E` }} />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default ChatBox;
