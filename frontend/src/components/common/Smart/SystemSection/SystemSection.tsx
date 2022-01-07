import { useState } from "react";

import { Box } from "@mui/material";

import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";

import TopViewBtns from "../TopViewBtns/TopViewBtns";

const SystemSection = () => {
  const [open, setOpen] = useState(false); // eslint-disable-line
  const [system, setSystem] = useState(null); // eslint-disable-line
  const [systemList, setSystemList] = useState({}); // eslint-disable-line
  const [searchText, setSearchText] = useState("");

  return (
    <Box component="div">
      <h2>Advent Health Carollwood</h2>
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
