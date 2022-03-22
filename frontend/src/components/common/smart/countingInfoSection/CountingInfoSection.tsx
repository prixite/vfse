import { Box, Grid } from "@mui/material";

import "@src/components/common/smart/countingInfoSection/countingInfoSection.scss";
import allIcon from "@src/assets/svgs/all_dev.svg";
import FlowerIcon from "@src/assets/svgs/flower.svg";
import offlineIcon from "@src/assets/svgs/offline_dev.svg";
import onlineIcon from "@src/assets/svgs/online_dev.svg";
import usersIcon from "@src/assets/svgs/users_dev.svg";
import CountingInfoCards from "@src/components/common/presentational/countingInfoCards/CountingInfoCards";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";

const device_info = [
  {
    device_status: "all Devices",
    device_number: "2,120",
    device_image: allIcon,
  },
  {
    device_status: "Devices online",
    device_number: "2,220",
    device_image: onlineIcon,
  },
  {
    device_status: "Devices offline",
    device_number: "2,320",
    device_image: offlineIcon,
  },
  {
    device_status: "Users online",
    device_number: "2,420",
    device_image: usersIcon,
  },
  {
    device_status: "Work orders",
    device_number: "2,520",
    device_image: FlowerIcon,
  },
];

const CountingInfoSection = () => {
  const [browserWidth] = useWindowSize();
  return (
    <>
      {browserWidth > mobileWidth ? (
        <Box component="div" className="CountingInfoSection">
          <div className="cardsSection">
            <Grid container spacing={3}>
              {device_info.map((item, key) => (
                <Grid key={key} item xl={2.4} md={4} xs={6}>
                  <CountingInfoCards
                    key={item.device_number}
                    deviceNo={item.device_number}
                    deviceStatus={item.device_status}
                    deviceImage={item.device_image}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
      ) : (
        <Box component="div" className="mobileCountingInfoSection">
          <div className="mobilecardsSection">
            {device_info.map((item, key) => (
              <div key={key}>
                <CountingInfoCards
                  key={item.device_number}
                  deviceNo={item.device_number}
                  deviceStatus={item.device_status}
                  deviceImage={item.device_image}
                />
              </div>
            ))}
          </div>
        </Box>
      )}
    </>
  );
};

export default CountingInfoSection;
