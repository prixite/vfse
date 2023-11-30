import { useEffect, useState } from "react";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation, matchPath } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import RoutesHOC from "@src/components/hoc/routesHOC";
import PageLayout from "@src/components/shared/layout/pageLayout/PageLayout";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsMeReadQuery,
  useOrganizationsReadQuery,
} from "@src/store/reducers/api";
import {
  setCurrentOrganization,
  setSelectedOrganization,
} from "@src/store/reducers/organizationStore";
import { updateTheme } from "@src/store/reducers/themeStore";
import useTheme from "@src/theme";

import { returnPayloadThemeObject } from "./helpers/utils/utils";
import "@src/app.scss";

const App = () => {
  const dispatch = useAppDispatch();
  const { fontOne, fontTwo, buttonBackground } = useAppSelector(
    (state) => state.myTheme
  );
  const { pathname } = useLocation();
  const paramsId = matchPath("/clients/*", pathname);
  const paramsSingleId = paramsId.params["*"].split("/");
  const { data, isFetching } = useOrganizationsMeReadQuery({
    id: paramsSingleId[0],
  });
  const { data: organizationList, isFetching: FetchingList } =
    useOrganizationsReadQuery({
      id: paramsSingleId[0],
    });
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeRendered, setIsFirstTimeRendered] = useState(false);
  useEffect(() => {
    if (!isFirstTimeRendered) {
      setIsLoading(true);
      if (!isFetching && !FetchingList && data) {
        const organizationData = data?.organization;
        dispatch(
          setCurrentOrganization({ currentOrganization: organizationData })
        );
        if (organizationList) {
          const selectedOrganizationData = organizationList;
          const themeObj = returnPayloadThemeObject(selectedOrganizationData);
          dispatch(
            setSelectedOrganization({
              selectedOrganization: selectedOrganizationData,
            })
          );
          dispatch(updateTheme(themeObj));
        } else {
          const themeObj = returnPayloadThemeObject(organizationData);
          dispatch(
            setSelectedOrganization({ selectedOrganization: organizationData })
          );
          dispatch(updateTheme(themeObj));
        }
        setIsFirstTimeRendered(true);
        setIsLoading(false);
      }
    }
  }, [
    isFetching,
    FetchingList,
    organizationList,
    data,
    setIsLoading,
    setIsFirstTimeRendered,
  ]);
  useEffect(() => {
    if (fontOne && document?.getElementById("container")) {
      document.getElementById("container").style.fontFamily = fontOne;
      document.body.style.fontFamily = fontOne;
    }
    if (fontTwo && document?.getElementById("SideBarcontainer")) {
      document.getElementById("SideBarcontainer").style.fontFamily = fontTwo;
    }
  }),
    [fontOne, fontTwo];
  return (
    <ThemeProvider theme={useTheme({ buttonBackground: buttonBackground })}>
      <CssBaseline />
      <ToastContainer />
      <PageLayout>
        <RoutesHOC isLoading={isLoading} me={data} />
      </PageLayout>
    </ThemeProvider>
  );
};
export default App;
