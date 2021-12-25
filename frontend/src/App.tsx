import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "@src/App.scss";
import PageLayout from "@src/components/shared/Layout/PageLayout/PageLayout";
import RoutesHOC from "@src/components/hoc/routesHOC";
import { constants } from "@src/helpers/utils/constants";
import {
  useMeReadQuery,
  useOrganizationsListQuery,
} from "@src/store/reducers/api";

import {
  setCurrentOrganization,
  setSelectedOrganization,
} from "@src/store/reducers/organizationStore";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  updateButtonColor,
  updateSideBarColor,
  updateButtonTextColor,
  updateSideBarTextColor,
  updateFontOne,
  updateFontTwo,
} from "./store/reducers/themeStore";
import { matchPath } from "react-router";
import { useLocation, withRouter, useHistory } from "react-router-dom";

const App = () => {
  const dispatch = useAppDispatch();
  const { fontOne, fontTwo } = useAppSelector((state) => state.myTheme);
  const history = useHistory();
  const { pathname } = useLocation();
  const params: any = matchPath(pathname, { path: "/clients/:id" });
  const { data, isFetching } = useMeReadQuery();
  const { data: organizationList, isFetching: FetchingList } =
    useOrganizationsListQuery({
      page: 1,
    });
  const [isLoading, setIsLoading] = useState(true);
  const { organizationRoute } = constants;
  useEffect(() => {
    setIsLoading(true);
    if (!isFetching && !FetchingList) {
      let organizationData = data?.organization;
      dispatch(
        setCurrentOrganization({ currentOrganization: organizationData })
      );
      if (organizationList) {
        const selectedOrganizationData = organizationList.find(
          (organization) => {
            return organization?.id === parseInt(params?.params.id, 10);
          }
        );
        if (selectedOrganizationData) {
          dispatch(
            setSelectedOrganization({
              selectedOrganization: selectedOrganizationData,
            })
          );
          dispatch(
            updateSideBarColor(
              selectedOrganizationData.appearance.sidebar_color
            )
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
            updateButtonTextColor(
              selectedOrganizationData.appearance.button_text
            )
          );
          dispatch(updateFontOne(selectedOrganizationData.appearance.font_one));
          dispatch(updateFontTwo(selectedOrganizationData.appearance.font_two));
        } else {
          dispatch(
            setSelectedOrganization({ selectedOrganization: organizationData })
          );
          dispatch(
            updateSideBarColor(organizationData.appearance.sidebar_color)
          );
          dispatch(
            updateButtonColor(organizationData.appearance.primary_color)
          );
          dispatch(
            updateSideBarTextColor(organizationData.appearance.sidebar_text)
          );
          dispatch(
            updateButtonTextColor(organizationData.appearance.button_text)
          );
          dispatch(updateFontOne(organizationData.appearance.font_one));
          dispatch(updateFontTwo(organizationData.appearance.font_two));
        }
      }
      setIsLoading(false);
    }
  }, [isFetching, FetchingList]);

  useEffect(() => {
    if (fontOne) {
      document.getElementById("container").style.fontFamily = fontOne;
    }
    if (fontTwo) {
      document.getElementById("SideBarcontainer").style.fontFamily = fontTwo;
    }
  }),
    [fontOne, fontTwo];

  return (
    <>
      {isLoading ? (
        <p>Loading Main</p>
      ) : (
        <>
          <ToastContainer />
          <PageLayout>
            <RoutesHOC />
          </PageLayout>
        </>
      )}
    </>
  );
};
export default withRouter(App);
