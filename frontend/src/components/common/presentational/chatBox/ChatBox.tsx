import { useState, Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "@src/components/common/presentational/chatBox/chatBox.scss";
import { Box, Grid, TextField } from "@mui/material";

import { toastAPIError } from "@src/helpers/utils/utils";
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
  const [placeholder, setPlaceHolder] = useState<string>(
    chatBox.placeholderText
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
    setIsLoading(true);
    setArrayToDiplay((oldArray) => [...oldArray, `${yourQuery}`]);
    postChat({ sysId: system?.id, query: yourQuery })
      .unwrap()
      .then(({ response_text: responseText }) => {
        setArrayToDiplay((oldArray) => [...oldArray, `${responseText}`]);
      })
      .catch((err) => {
        if (err?.originalStatus === 500) {
          setArrayToDiplay((oldArray) => [
            ...oldArray,
            `I'm sorry, I don't understand. Could you say it again?`,
          ]);
          toastAPIError(toastData.chatBoxReqProceedError, err.originalStatus);
        } else {
          setArrayToDiplay((oldArray) => [
            ...oldArray,
            `Re-establish connection. Some Error ${err?.originalStatus} occured.`,
          ]);
          toastAPIError(toastData.chatBoxErrorOcccured, err.originalStatus);
        }
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
          {arrayToDisplay?.map((item, index) => {
            return (
              <>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  marginBottom={1}
                  key={item}
                >
                  <Box
                    style={
                      (index + 1) % 2 !== 0
                        ? {
                            // Odd
                            border: `2px solid ${buttonBackground}`,
                            width: "95%",
                            marginRight: "auto",
                            padding: "5px",
                            borderRadius: "8px",
                            boxShadow:
                              "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                          }
                        : {
                            //Even
                            border: "2px solid #fff",
                            width: "95%",
                            marginLeft: "auto",
                            padding: "5px",
                            borderRadius: "8px",
                            boxShadow:
                              "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                          }
                    }
                  >
                    <p style={{ wordBreak: "break-word" }}>{item}</p>
                  </Box>
                </Grid>
              </>
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
