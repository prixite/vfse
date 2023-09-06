import { useState, Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { Box, Grid, TextField, Dialog } from "@mui/material";

import { toastAPIError } from "@src/helpers/utils/utils";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
// import { System } from "@src/store/reducers/generated";
import { System } from "@src/store/reducers/generatedWrapper";
import "@src/components/common/presentational/chatBox/chatBox.scss";

interface chatBoxInterface {
  handleClose: () => void;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  system: System;
}
const ChatBox = ({ setIsOpen, system, handleClose }: chatBoxInterface) => {
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
          toastAPIError(
            "We cannot process your request at the moment",
            err.status,
            err.data
          );
        } else {
          setArrayToDiplay((oldArray) => [
            ...oldArray,
            `Re-establish connection. Some Error ${err?.originalStatus} occured.`,
          ]);
          toastAPIError("Error occured", err.status, err.data);
        }
      })
      .finally(() => {
        resetQuery();
      });
  };

  return (
    <Dialog open={setIsOpen} onClose={handleClose}>
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
    </Dialog>
  );
};

export default ChatBox;
