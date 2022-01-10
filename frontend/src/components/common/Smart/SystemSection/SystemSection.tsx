import { useState, useRef } from "react";

import Flicking from "@egjs/react-flicking";
import { Box } from "@mui/material";

import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import { useAppSelector } from "@src/store/hooks";
import { useModalitiesListQuery } from "@src/store/reducers/api";

import TopViewBtns from "../TopViewBtns/TopViewBtns";
import "@src/components/common/Smart/SystemSection/SystemSection.scss";

const SystemSection = () => {
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [system, setSystem] = useState(null);
  // eslint-disable-next-line
  const [systemList, setSystemList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [modality, setModality] = useState(0);
  const carouselRef = useRef(null);

  const { buttonBackground } = useAppSelector((state) => state.myTheme);

  const { data: modalitiesList } = useModalitiesListQuery();

  const handleClick = (index) => {
    setModality(index);
  };

  return (
    <Box component="div" className="system-section">
      <h2>Organization or Site Title</h2>
      <h3>All Systems</h3>
      <div
        style={{
          width: "100%",
        }}
      >
        <div className="modalities">
          <Flicking
            ref={carouselRef}
            tag="div"
            viewportTag="div"
            cameraTag="div"
            classPrefix="eg-flick"
            deceleration={0.0075}
            horizontal
            bound
            gap={40}
            style={{ height: "33px" }}
          >
            {
              // eslint-disable-next-line
              modalitiesList?.map((item, key) => (
                <span
                  key={key}
                  className="modality"
                  style={{
                    color: `${modality === key ? buttonBackground : ""}`,
                    borderBottom: `${
                      modality === key ? `1px solid ${buttonBackground}` : ""
                    }`,
                  }}
                  onClick={() => handleClick(key)}
                >
                  {item.name}
                </span>
              ))
            }
          </Flicking>
        </div>
        <hr style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }} />
      </div>
      <TopViewBtns
        setOpen={setOpen}
        path="systems"
        setData={setSystem}
        setList={setSystemList}
        actualData={null}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div style={{ marginTop: "32px" }}>
        <SystemCard />
        <SystemCard />
      </div>
    </Box>
  );
};

export default SystemSection;
