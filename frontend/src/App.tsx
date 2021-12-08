import { ToastContainer } from "react-toastify";
import "@src/App.scss";
import PageLayout from "@src/components/shared/Layout/PageLayout/PageLayout";
import RoutesHOC from "@src/components/hoc/routesHOC";
import { useMeReadQuery } from "./store/reducers/api";
import { updateMe } from "@src/store/reducers/organizationStore";
import { useAppDispatch } from "@src/store/hooks";

export default function App() {
  const dispatch = useAppDispatch();
  const { data, isFetching } = useMeReadQuery();

  if (!isFetching) {
    dispatch(updateMe(data));
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
