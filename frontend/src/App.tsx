import { useEffect, useState } from "react";

import {
  useLocation,
  useParams,
  matchPath,
  useNavigate,
} from "react-router-dom";
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
import "@src/app.scss";
import {
  updateButtonColor,
  updateSideBarColor,
  updateButtonTextColor,
  updateSideBarTextColor,
  updateFontOne,
  updateFontTwo,
  updateSecondaryColor,
} from "@src/store/reducers/themeStore";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

const App = () => {
  const dispatch = useAppDispatch();

  const { fontOne, fontTwo } = useAppSelector((state) => state.myTheme);
  const { pathname } = useLocation();

  const paramsId = matchPath("/clients/*", pathname);
  const paramsSingleId = paramsId.params["*"].replace(/[^\d.]/g, "");
  const { data, isFetching } = useOrganizationsMeReadQuery({
    id: paramsSingleId,
  });

  const { data: organizationList, isFetching: FetchingList } =
    useOrganizationsReadQuery({
      id: paramsSingleId,
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
          dispatch(
            updateSecondaryColor(
              selectedOrganizationData?.appearance?.secondary_color
            )
          );
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
          dispatch(
            updateSecondaryColor(organizationData?.appearance?.secondary_color)
          );
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
    <>
      <ToastContainer />
      <PageLayout>
        <RoutesHOC isLoading={isLoading} />
      </PageLayout>
    </>
  );
};
export default App;
