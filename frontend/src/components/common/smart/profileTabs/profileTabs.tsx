import * as React from "react";

import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";

import women from "@src/assets/svgs/womenAvatar.svg";
import constantsData from "@src/localization/en.json";

import ProfileTimelineCards from "../../presentational/profileTimeLineCards/ProfileTimeLineCards";
import "@src/components/common/smart/profileTabs/profileTabs.scss";

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
  const { profileTabs } = constantsData;

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
        {profileTabs.activity}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProfileTimelineCards
          id={1}
          title="Clinical Specialist for MedTronics"
          description="I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a 'lifestyle' in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and..."
          number_of_comments={3}
          number_of_followers={24}
          user={{ name: "Jessie Hudson", image: women }}
          categories={[]}
        />
        <ProfileTimelineCards
          id={1}
          title="Clinical Specialist for MedTronics"
          description="I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a 'lifestyle' in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and..."
          number_of_comments={3}
          number_of_followers={24}
          user={{ name: "Jessie Hudson", image: women }}
          categories={[]}
        />
        <ProfileTimelineCards
          id={1}
          title="Clinical Specialist for MedTronics"
          description="I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a 'lifestyle' in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and..."
          number_of_comments={3}
          number_of_followers={24}
          user={{ name: "Jessie Hudson", image: women }}
          categories={[]}
        />
        <Stack alignItems="center" mt={2}>
          <Pagination
            showFirstButton
            showLastButton
            count={5}
            color="primary"
          />
        </Stack>
      </TabPanel>
    </Box>
  );
};

export default ProfileTabs;
