import * as React from "react";

import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";

import TopicSection from "../topicSection/topicSection";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProfileTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
            label="Activity"
            {...a11yProps(0)}
          />
          <Tab
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
            label="My Topics"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Activity
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TopicSection />
        <TopicSection />
        <TopicSection />
        <Stack alignItems="center" mt={2}>
          <Pagination
            showFirstButton
            showLastButton
            count={10}
            color="primary"
          />
        </Stack>
      </TabPanel>
    </Box>
  );
};

export default ProfileTabs;
