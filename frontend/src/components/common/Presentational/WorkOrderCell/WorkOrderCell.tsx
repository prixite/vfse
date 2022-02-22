import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import ConnectIcon from "@src/assets/svgs/Green_Btn.svg";
import SystemIcon from "@src/assets/svgs/system.svg";
import { workOrderTabs } from "@src/helpers/utils/constants";
import "@src/components/common/Presentational/WorkOrderCell/WorkOrderCell.scss";
import { localizedData } from "@src/helpers/utils/language";

const { connect } = localizedData().systems_card;

const work_data = {
  All: {
    systems: [
      {
        system_title: "Ge Signa Excite",
        system_subtiltle: "GE Healthcare",
        system_image: SystemIcon,
        connect_image: ConnectIcon,
      },
      {
        system_title: "AirisMate 0.2T",
        system_subtiltle: "Hitachi",
        system_image: SystemIcon,
        connect_image: ConnectIcon,
      },
      {
        system_title: "Espree 1.5T",
        system_subtiltle: "Siemens",
        system_image: SystemIcon,
        connect_image: ConnectIcon,
      },
      {
        system_title: "Ge Signa Excite",
        system_subtiltle: "GE Healthcare",
        system_image: SystemIcon,
        connect_image: ConnectIcon,
      },
      {
        system_title: "Ge Signa Excite",
        system_subtiltle: "GE Healthcare",
        system_image: SystemIcon,
        connect_image: ConnectIcon,
      },
    ],
  },
  MRI: {},
  ULTRASOUND: {},
  MEMMOGRAPH: {},
};
function TabPanel(props) {
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function WorkOrderCell() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="upper_class" sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {workOrderTabs.map((tab: string, index: number) => {
            return (
              <Tab
                key={index}
                label={tab}
                sx={{
                  "&.Mui-selected": {
                    color: "#0000FF",
                  },
                }}
                className="tab-style"
              />
            );
          })}
        </Tabs>
      </Box>
      <TabPanel
        value={value}
        index={0}
        style={{ maxHeight: 457, overflow: "auto" }}
      >
        {work_data.All.systems.map((item) => (
          <div className="root_section" key={item.system_title}>
            <div className="img_section">
              <div className="img_div">
                <img src={item.system_image} className="imgStyling" />
              </div>
              <div className="detail_section">
                <div className="title">{item.system_title}</div>
                <div className="subtitle">{item.system_subtiltle}</div>
              </div>
            </div>
            <div className="btn_section">
              <Button className="connect_btn">{connect}</Button>
            </div>
          </div>
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}
