import { useState } from "react";

import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsSystemsListQuery,
  useSitesSystemsListQuery,
} from "@src/store/reducers/api";

const SystemSection = () => {
  const [open, setOpen] = useState(false); // eslint-disable-line
  const [system, setSystem] = useState(null); // eslint-disable-line
  const [systemList, setSystemList] = useState({}); // eslint-disable-line
  const [searchText, setSearchText] = useState("");
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { siteId } = useParams();

  const { data: systemsData, isLoading: isSystemDataLoading } =
    siteId == undefined
      ? useOrganizationsSystemsListQuery({
          page: 1,
          id: selectedOrganization?.id.toString(),
        })
      : useSitesSystemsListQuery({ page: 1, id: siteId?.toString() });

  return (
    <Box component="div">
      <h2>{selectedOrganization?.name}</h2>
      <TopViewBtns
        setOpen={setOpen}
        path="systems"
        setData={setSystem}
        setList={setSystemList}
        actualData={null}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {!isSystemDataLoading && !systemsData?.length ? (
        <NoDataFound title={noDataTitle} description={noDataDescription} />
      ) : (
        <div style={{ marginTop: "32px" }}>
          {systemsData?.map((item, key) => (
            <SystemCard
              key={key}
              name={item?.name}
              his_ris_info={item?.his_ris_info}
              dicom_info={item?.dicom_info}
              asset_number={item?.asset_number}
              mri_embedded_parameters={item?.mri_embedded_parameters}
              ip_address={item?.ip_address}
              local_ae_title={item?.local_ae_title}
              software_version={item?.software_version}
            />
          ))}
        </div>
      )}
    </Box>
  );
};

export default SystemSection;
