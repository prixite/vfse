import { ToastContainer } from "react-toastify";
import "@src/App.scss";
import PageLayout from "@src/components/shared/Layout/PageLayout/PageLayout";
import RoutesHOC from "@src/components/hoc/routesHOC";
import { useMeReadQuery } from "@src/store/reducers/api";
import { setCurrentOrganization } from "@src/store/reducers/organizationStore";
import { useAppDispatch } from "@src/store/hooks";

export default function App() {
  const dispatch = useAppDispatch();
  const { data, isFetching } = useMeReadQuery();

  if (!isFetching) {
    dispatch(setCurrentOrganization({ currentOrganiation: data.organization }));
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
