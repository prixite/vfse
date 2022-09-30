import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { toast } from "react-toastify";

import SitesMenu from "@src/components/common/smart/sitesMenu/SitesMenu";
import { localizedData } from "@src/helpers/utils/language";
import {
  Modality,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
  useOrganizationsSystemsListQuery,
} from "@src/store/reducers/generated";
import { Formik } from "@src/types/interfaces";

interface Props {
  formik: Formik;
  modalitiesList: Modality[];
}

const PageTwo = ({ formik, modalitiesList }: Props) => {
  const { data: systemsList = [], isLoading: systemsListLoading } =
    useOrganizationsSystemsListQuery({
      id: formik.values.customer?.toString(),
    });
  const { data: networksData = [] } = useOrganizationsHealthNetworksListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );
  const { data: organizationSitesData } = useOrganizationsSitesListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );

  const constantUserData = localizedData().users.popUp;

  const handleSystemSelection = (e, site) => {
    const val = parseInt(e?.target?.value || e);
    const selectedSystemIndex = formik.values.selectedSystems.indexOf(val);
    if (selectedSystemIndex > -1) {
      formik.values.selectedSystems.splice(selectedSystemIndex, 1);
      formik.setFieldValue("selectedSystems", [
        ...formik.values.selectedSystems,
      ]);
    } else {
      formik.setFieldValue("selectedSystems", [
        ...formik.values.selectedSystems,
        val,
      ]);
    }

    const { systemInSiteExists } = handelSitesOfSystem(site);
    if (
      !e?.target?.checked && //uncheck
      formik.values.selectedSites.includes(site) && //site checked
      !systemInSiteExists //system does not exist
    ) {
      modifySelectedSiteList(site);
    } else if (
      e?.target?.checked &&
      !formik.values.selectedSites.includes(site)
    ) {
      modifySelectedSiteList(site);
    }

    const modality = systemsList
      .filter((item) => item.id == val)
      .map((item) => item.product_model_detail.modality?.id)[0];

    const systems = systemsList
      .filter((item) => item.product_model_detail.modality.id == modality)
      .filter((item) => item.id != val);

    if (
      systems.length &&
      systems.some((item) => formik.values.selectedSystems.includes(item.id))
    ) {
      return;
    }

    const selectedModalityIndex =
      formik.values.selectedModalities.indexOf(modality);

    if (selectedModalityIndex > -1) {
      formik.values.selectedModalities.splice(selectedModalityIndex, 1);
      formik.setFieldValue(constantUserData.selectedModalities, [
        ...formik.values.selectedModalities,
      ]);
    } else {
      formik.setFieldValue(constantUserData.selectedModalities, [
        ...formik.values.selectedModalities,
        modality,
      ]);
    }
  };

  const handleSelectedModalities = async (event, newFormats) => {
    const systems = systemsList.filter(
      (item) => item.product_model_detail.modality.id == event.target.value
    );

    if (!systems.length) {
      toast.warn("No system exixts against this modality");
      return;
    }

    const _selectedSystems = new Set(formik.values.selectedSystems);
    const _selectedSites = new Set(formik.values.selectedSites);
    const selectedSystemsInModality = systems.filter((item) =>
      formik.values.selectedSystems.includes(item.id)
    );
    if (selectedSystemsInModality.length === systems.length) {
      for (const item of systems) {
        _selectedSystems.delete(item.id);
        const allSystemOfSite = systemsList.filter(
          (system) => system.site === item.site
        );
        const allSystemOfSiteModality = systems.filter(
          (system) => system.site === item.site
        );
        const selectedSystemofSite = allSystemOfSite.filter((system) =>
          formik.values.selectedSystems.includes(system.id)
        );
        if (selectedSystemofSite.length === allSystemOfSiteModality.length) {
          _selectedSites.delete(item.site);
        }
      }
      formik.setFieldValue(constantUserData.selectedModalities, [
        ...newFormats,
      ]);
    } else {
      const _systems = systems.filter(
        (item) => !formik.values.selectedSystems.includes(item.id)
      );
      for (const system of _systems) {
        _selectedSystems.add(system.id);
        _selectedSites.add(system.site);
      }
      formik.setFieldValue(constantUserData.selectedModalities, [
        ...newFormats,
      ]);
    }

    formik.setFieldValue("selectedSystems", [...Array.from(_selectedSystems)]);
    formik.setFieldValue("selectedSites", [...Array.from(_selectedSites)]);
  };
  const handleSitesSelection = (e) => {
    const val = parseInt(e?.target?.value || e);
    const { systemsSiteList, systemInSiteExists } = handelSitesOfSystem(val);

    if (!systemInSiteExists) {
      formik.setFieldValue("selectedSystems", [
        ...formik.values.selectedSystems,
        ...systemsSiteList.map((x) => x.id),
      ]);
    } else {
      const selectedSystemsInSite = formik.values.selectedSystems.filter(
        (x) => !systemsSiteList.some((j) => x === j.id)
      );
      formik.setFieldValue("selectedSystems", [...selectedSystemsInSite]);
    }

    modifySelectedSiteList(val);
    const temp = [...formik.values.selectedModalities];
    for (const system of systemsSiteList) {
      if (
        !systemsSiteList.filter((item) =>
          formik.values.selectedSystems.includes(item.id)
        ).length ||
        formik.values.selectedSystems.includes(system.id)
      ) {
        modifySelectedModalities(system, temp);
      }
    }
  };
  const modifySelectedModalities = (system, temp) => {
    const modality = systemsList
      .filter((item) => item.id == system.id)
      .map((item) => item.product_model_detail.modality.id)[0];

    const systems = systemsList
      .filter((item) => item.product_model_detail.modality.id == modality)
      .filter((item) => item.id != system.id);

    if (
      !systems.some((item) => formik.values.selectedSystems.includes(item.id))
    ) {
      const selectedModalityIndex = temp.indexOf(modality);
      if (selectedModalityIndex > -1) {
        temp.splice(selectedModalityIndex, 1);
      } else {
        temp.push(modality);
      }
      formik.setFieldValue(constantUserData.selectedModalities, [...temp]);
    }
  };
  const modifySelectedSiteList = (val) => {
    const siteIndex = formik.values.selectedSites.indexOf(val);
    if (siteIndex > -1) {
      formik.values.selectedSites.splice(siteIndex, 1);
      formik.setFieldValue(constantUserData.selectedSites, [
        ...formik.values.selectedSites,
      ]);
    } else {
      formik.setFieldValue(constantUserData.selectedSites, [
        ...formik.values.selectedSites,
        val,
      ]);
    }
  };

  const handelSitesOfSystem = (site) => {
    const systemsSiteList = systemsList.filter((item) => item.site === site);

    const systemInSiteExists = systemsSiteList.some((item) =>
      formik.values.selectedSystems.includes(item.id)
    );

    return { systemsSiteList, systemInSiteExists };
  };
  const sitesLength = () => {
    let count = 0;
    networksData.forEach((item) => {
      if (item.sites.length) {
        count += item.sites.length;
      }
    });
    if (organizationSitesData && organizationSitesData.length) {
      count += organizationSitesData.length;
    }
    return count;
  };

  const getNetworkSitesLength = () => {
    let count = 0;
    networksData.forEach((item) => {
      if (item.sites.length) {
        count += item.sites.length;
      }
    });
    return count;
  };

  function getModalityColor(item: number): string {
    const systems = systemsList
      .filter((system) => system.product_model_detail.modality.id == item)
      .map((i) => i.id);

    const selectedeSystems = formik.values.selectedSystems.filter((system) =>
      systems.includes(system)
    );

    if (selectedeSystems.length == 0) {
      return "toggle-btn";
    } else if (systems.length == selectedeSystems?.length) {
      return "toggle-btn primaryToggle";
    } else if (systems.length > selectedeSystems.length) {
      return "toggle-btn standardToggle";
    }
  }

  return (
    <>
      <div>
        {sitesLength() > 0 ? (
          <p className="modalities-header">
            <span className="info-label">{constantUserData.sitesText}</span>
            <span className="checked-ratio">{`${
              formik.values.selectedSites.length
            }/${sitesLength()}`}</span>
          </p>
        ) : (
          ""
        )}
        {getNetworkSitesLength() > 0 ? (
          <p className="modalities-header">
            <span style={{ fontWeight: "600" }}>
              {constantUserData.healthNetworkAccessText}
            </span>
          </p>
        ) : (
          ""
        )}
        {networksData.map((item, key) =>
          item.sites.length ? (
            <div key={key}>
              <details className="network-details">
                <summary className="header" style={{ cursor: "pointer" }}>
                  <span className="title">{item.name}</span>
                </summary>
                {item.sites.map((site, key) => {
                  const systems = systemsList.filter(
                    (item) => item.site === site.id
                  );
                  return (
                    <SitesMenu
                      key={key}
                      site={site}
                      systems={systems}
                      formik={formik}
                      handleSitesSelection={handleSitesSelection}
                      handleSystemSelection={handleSystemSelection}
                    />
                  );
                })}
              </details>
            </div>
          ) : (
            ""
          )
        )}
        {organizationSitesData && organizationSitesData.length ? (
          <>
            <p className="modalities-header">
              <span style={{ fontWeight: "600" }}>
                {constantUserData.organizationSitesText}
              </span>
            </p>
            <div className="network-details">
              {!systemsListLoading &&
                organizationSitesData.map((site, key) => {
                  const systems = systemsList.filter(
                    (item) => item.site === site.id
                  );
                  return (
                    <SitesMenu
                      key={key}
                      site={site}
                      systems={systems}
                      formik={formik}
                      handleSitesSelection={handleSitesSelection}
                      handleSystemSelection={handleSystemSelection}
                    />
                  );
                })}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div>
        {modalitiesList.length ? (
          <p className="modalities-header">
            <span className="info-label">
              {constantUserData.accessToModalities}
            </span>
            <span className="checked-ratio">{`${formik.values.selectedModalities.length}/${modalitiesList.length}`}</span>
          </p>
        ) : (
          ""
        )}
        <ToggleButtonGroup
          value={formik.values.selectedModalities}
          color="primary"
          onChange={handleSelectedModalities}
          aria-label="text formatting"
          style={{ flexWrap: "wrap" }}
        >
          {modalitiesList.length &&
            modalitiesList.map((item, key) => {
              return (
                <ToggleButton
                  key={key}
                  value={item.id}
                  className={getModalityColor(item.id)}
                >
                  {item.name}
                </ToggleButton>
              );
            })}
        </ToggleButtonGroup>
      </div>
      <div className="services">
        <FormGroup className="service-options">
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.docLink}
                onClick={() =>
                  formik.setFieldValue("docLink", !formik.values.docLink)
                }
              />
            }
            label="Documentation Link Available"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.accessToFSEFunctions}
                onClick={() =>
                  formik.setFieldValue(
                    "accessToFSEFunctions",
                    !formik.values.accessToFSEFunctions
                  )
                }
              />
            }
            label="Access to FSE functions"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.auditEnable}
                onClick={() =>
                  formik.setFieldValue(
                    "auditEnable",
                    !formik.values.auditEnable
                  )
                }
              />
            }
            label="Audit Enable"
          />
        </FormGroup>

        <FormGroup className="options">
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.possibilitytoLeave}
                onClick={() =>
                  formik.setFieldValue(
                    "possibilitytoLeave",
                    !formik.values.possibilitytoLeave
                  )
                }
              />
            }
            label="Possibility to Leave Notes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.viewOnly}
                onClick={() =>
                  formik.setFieldValue("viewOnly", !formik.values.viewOnly)
                }
              />
            }
            label="View Only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.oneTimeLinkCreation}
                onClick={() =>
                  formik.setFieldValue(
                    "oneTimeLinkCreation",
                    !formik.values.oneTimeLinkCreation
                  )
                }
              />
            }
            label="One-time Link Creation"
          />
        </FormGroup>
      </div>
    </>
  );
};

export default PageTwo;
