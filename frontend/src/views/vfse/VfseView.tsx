import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import TableSkeleton from "@src/components/common/Presentational/TableSkeleton/TableSkeleton";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSeatsListQuery } from "@src/store/reducers/api";

export default function VfseView() {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { isLoading, data } = useOrganizationsSeatsListQuery({
    id: selectedOrganization.id.toString(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      <h2>vFSE</h2>
      {data?.map((item, key) => (
        <SystemCard
          key={key}
          name={item.system.name}
          image={item.system.image_url}
          his_ris_info={item.system.his_ris_info}
          dicom_info={item.system?.dicom_info}
          serial_number={item.system?.serial_number}
          asset_number={item.system?.asset_number}
          mri_embedded_parameters={item.system.mri_embedded_parameters}
          ip_address={item.system?.ip_address}
          local_ae_title={item.system?.local_ae_title}
          software_version={item.system?.software_version}
          location_in_building={item.system?.location_in_building}
          grafana_link={item.system?.grafana_link}
          documentation={item.system?.documentation}
        />
      ))}
    </>
  );
}
