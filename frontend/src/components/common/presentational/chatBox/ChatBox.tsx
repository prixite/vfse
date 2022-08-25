import { useState, Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "@src/components/common/presentational/chatBox/chatBox.scss";
import { Box, TextField } from "@mui/material";
import { toast } from "react-toastify";

import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { System } from "@src/store/reducers/generated";

interface ChatBoxInterface {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  system: System;
}
const ChatBox = ({ setIsOpen, system }: ChatBoxInterface) => {
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [postChat] = api.usePostChatBotMutation();
  const [yourQuery, setYourQuery] = useState<string>("");
  const [placeholder, setPlaceHolder] = useState<string>(
    "How may I answer your query..."
  );

  const [arrayToDisplay, setArrayToDiplay] = useState<string[]>([]);
  const resetQuery = () => {
    setPlaceHolder("");
    setIsLoading(false);
    setYourQuery("");
  };

  const keyPressEnter = (event) => {
    if (event.key == "Enter") {
      handleChatting();
    }
  };

  const handleChatting = () => {
    setArrayToDiplay((oldArray) => [...oldArray, `${yourQuery}`]);
    setIsLoading(true);
    postChat({ sysId: system?.id, query: yourQuery })
      .unwrap()
      .then(({ response_text: responseText }) => {
        setArrayToDiplay((oldArray) => [
          ...oldArray,
          `Response ${responseText}`,
        ]);
      })
      .catch((err) => {
        if (err?.status > 500) {
          setArrayToDiplay((oldArray) => [
            ...oldArray,
            `I'm sorry, I don't understand. Could you say it again?`,
          ]);
        } else {
          setArrayToDiplay((oldArray) => [
            ...oldArray,
            `Re-establish connection. Some Error ${err?.originalStatus} occured.`,
          ]);
        }
        toast.error(
          err.originalStatus === 500
            ? "We can not proceed ypur request at that time."
            : `Error occured ${err?.error}.`,
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
          {arrayToDisplay?.map((item) => {
            return (
              <div
                key={item}
                style={{ boxShadow: "3px 3px 12px rgb(10 35 83 / 8%)" }}
              >
                <p>{item}</p>
              </div>
            );
          })}
        </div>
      </Box>
      <Box component="div" className="InputSection">
        <TextField
          id="outlined-basic"
          variant="outlined"
          inputProps={{ autoComplete: "off" }}
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
          onKeyPress={keyPressEnter}
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
              style={{ color: "white" }}
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
