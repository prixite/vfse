import { ToastContainer } from "react-toastify";
import "@src/App.scss";
import PageLayout from "@src/components/shared/Layout/PageLayout/PageLayout";
import RoutesHOC from "@src/components/hoc/routesHOC";
import { useMeReadQuery } from "@src/store/reducers/api";
import { setCurrentOrganization } from "@src/store/reducers/organizationStore";
import { useAppDispatch } from "@src/store/hooks";
import {
  updateButtonColor,
  updateSideBarColor,
} from "./store/reducers/themeStore";

export default function App() {
  const dispatch = useAppDispatch();
  const { data, isFetching } = useMeReadQuery();

  if (!isFetching) {
    let organizationData = data.organization;
    dispatch(setCurrentOrganization({ currentOrganiation: organizationData }));
    dispatch(updateSideBarColor(organizationData.appearance.sidebar_color));
    dispatch(updateButtonColor(organizationData.appearance.primary_color));
  }

  if (isFetching) {
    return <p>Loading</p>;
  }

  return (
    <>
      <ToastContainer />
      <PageLayout>
        <RoutesHOC />
      </PageLayout>
    </>
  );
}
