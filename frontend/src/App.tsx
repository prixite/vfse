import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "@src/App.scss";
import PageLayout from "@src/components/shared/Layout/PageLayout/PageLayout";
import RoutesHOC from "@src/components/hoc/routesHOC";
import { useMeReadQuery } from "./store/reducers/api";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentOrganization } from "./store/reducers/organizationStore";
export default function App() {
  const dispatch = useDispatch();
  const { data, isFetching } = useMeReadQuery();
  const { current_organization } = useSelector(
    (state: any) => state.organization
  );
  console.log(current_organization);
  useEffect(() => {
    if (!isFetching) {
      dispatch(updateCurrentOrganization({ data: data }));
    }
  }, [data]);
  if (isFetching) {
    return <p>Loading...</p>;
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
