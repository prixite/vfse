import { useEffect, useState } from "react";

import { matchPath } from "react-router";
import { match, useLocation, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import RoutesHOC from "@src/components/hoc/routesHOC";
import PageLayout from "@src/components/shared/Layout/PageLayout/PageLayout";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  useMeReadQuery,
  useOrganizationsReadQuery,
} from "@src/store/reducers/api";
import {
  setCurrentOrganization,
  setSelectedOrganization,
} from "@src/store/reducers/organizationStore";
import "@src/App.scss";

import {
  updateButtonColor,
  updateSideBarColor,
  updateButtonTextColor,
  updateSideBarTextColor,
  updateFontOne,
  updateFontTwo,
} from "./store/reducers/themeStore";

const App = () => {
  const dispatch = useAppDispatch();
  const { fontOne, fontTwo } = useAppSelector((state) => state.myTheme);
  const { pathname } = useLocation();
  const params: match<{ id: string }> = matchPath(pathname, {
    path: "/clients/:id",
  });
  const { data, isFetching } = useMeReadQuery();
  const { data: organizationList, isFetching: FetchingList } =
    useOrganizationsReadQuery({
      id: params?.params.id,
    });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    if (!isFetching && !FetchingList) {
      const organizationData = data?.organization;
      dispatch(
        setCurrentOrganization({ currentOrganization: organizationData })
      );
      if (organizationList) {
        const selectedOrganizationData = organizationList;
        dispatch(
          setSelectedOrganization({
            selectedOrganization: selectedOrganizationData,
          })
        );
        dispatch(
          updateSideBarColor(selectedOrganizationData.appearance.sidebar_color)
        );
        dispatch(
          updateButtonColor(selectedOrganizationData.appearance.primary_color)
        );
        dispatch(
          updateSideBarTextColor(
            selectedOrganizationData.appearance.sidebar_text
          )
        );
        dispatch(
          updateButtonTextColor(selectedOrganizationData.appearance.button_text)
        );
        dispatch(updateFontOne(selectedOrganizationData.appearance.font_one));
        dispatch(updateFontTwo(selectedOrganizationData.appearance.font_two));
      } else {
        dispatch(
          setSelectedOrganization({ selectedOrganization: organizationData })
        );
        dispatch(updateSideBarColor(organizationData.appearance.sidebar_color));
        dispatch(updateButtonColor(organizationData.appearance.primary_color));
        dispatch(
          updateSideBarTextColor(organizationData.appearance.sidebar_text)
        );
        dispatch(
          updateButtonTextColor(organizationData.appearance.button_text)
        );
        dispatch(updateFontOne(organizationData.appearance.font_one));
        dispatch(updateFontTwo(organizationData.appearance.font_two));
      }
      setIsLoading(false);
    }
  }, [isFetching, FetchingList]);

  useEffect(() => {
    if (fontOne && document?.getElementById("container")) {
      document.getElementById("container").style.fontFamily = fontOne;
    }
    if (fontTwo && document?.getElementById("SideBarcontainer")) {
      document.getElementById("SideBarcontainer").style.fontFamily = fontTwo;
    }
  }),
    [fontOne, fontTwo];

  return (
    <>
      <ToastContainer />
      <PageLayout>
        <RoutesHOC isLoading={isLoading} />
      </PageLayout>
    </>
  );
};
export default withRouter(App);
