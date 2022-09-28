import { Box, Grid } from "@mui/material";

import "@src/components/common/smart/countingInfoSection/countingInfoSection.scss";
import allIcon from "@src/assets/svgs/all_dev.svg";
import offlineIcon from "@src/assets/svgs/offline_dev.svg";
import onlineIcon from "@src/assets/svgs/online_dev.svg";
import systemIcon from "@src/assets/svgs/systemIcon.png";
import usersIcon from "@src/assets/svgs/users_dev.svg";
import CountingInfoCards from "@src/components/common/presentational/countingInfoCards/CountingInfoCards";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import constantsData from "@src/localization/en.json";
import { api } from "@src/store/reducers/api";

const CountingInfoSection = () => {
  const [browserWidth] = useWindowSize();
  const { data: dashBoardList } = api.useGetDashboardListQuery();
  const {
    system_count,
    allDevices,
    online_system_count,
    devicesOffline,
    devicesOnline,
    offline_system_count,
    last_month_logged_in_user,
    last_month_logged_in_user_text,
    workOrders,
  } = constantsData.countingInfoSection;
  const renderDashBoardCard = (key) => {
    switch (key) {
      case system_count:
        return (
          <CountingInfoCards
            key={key}
            deviceNo={dashBoardList[key]}
            deviceStatus={allDevices}
            deviceImage={allIcon}
          />
        );
      case online_system_count:
        return (
          <CountingInfoCards
            key={key}
            deviceNo={dashBoardList[key]}
            deviceStatus={devicesOnline}
            deviceImage={onlineIcon}
          />
        );
      case offline_system_count:
        return (
          <CountingInfoCards
            key={key}
            deviceNo={dashBoardList[key]}
            deviceStatus={devicesOffline}
            deviceImage={offlineIcon}
          />
        );
      case last_month_logged_in_user:
        return (
          <CountingInfoCards
            key={key}
            deviceNo={dashBoardList[key]}
            deviceStatus={last_month_logged_in_user_text}
            deviceImage={usersIcon}
          />
        );
    }
  };
  return (
    <>
      {browserWidth > mobileWidth ? (
        <Box component="div" className="CountingInfoSection">
          <div className="cardsSection">
            <Grid container spacing={3}>
              {Object.keys(dashBoardList).map((item, key) => (
                <Grid key={key} item xl={2.4} md={4} xs={6}>
                  {renderDashBoardCard(item)}
                </Grid>
              ))}
              <Grid item xl={2.4} md={4} xs={6}>
                <CountingInfoCards
                  // key={key}
                  deviceNo={dashBoardList.work_order}
                  deviceStatus={workOrders}
                  deviceImage={systemIcon}
                />
              </Grid>
            </Grid>
          </div>
        </Box>
      ) : (
        <Box component="div" className="mobileCountingInfoSection">
          <div className="mobilecardsSection">
            {Object.keys(dashBoardList).map((item, key) => (
              <div key={key}>{renderDashBoardCard(item)}</div>
            ))}
            <CountingInfoCards
              // key={key}
              deviceNo={dashBoardList.work_order}
              deviceStatus={workOrders}
              deviceImage={systemIcon}
            />
          </div>
        </Box>
      )}
    </>
  );
};

export default CountingInfoSection;
