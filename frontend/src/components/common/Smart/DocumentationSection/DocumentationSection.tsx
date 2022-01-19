import { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import EditLogo from "@src/assets/svgs/Edit.svg";
import LinkLogo from "@src/assets/svgs/Link.svg";
import "@src/components/common/Smart/DocumentationSection/DocumentationSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import { useProductsModelsListQuery } from "@src/store/reducers/api";

import TopTableFilters from "../TopTableFilters/TopTableFilters";

const columns = [
  {
    field: "name",
    headerName: "SYSTEM NAME",
    width: 230,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "manufacturer",
    headerName: "MANUFACTURER",
    width: 250,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "modality",
    headerName: "MODALITY",
    width: 250,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "documentation",
    headerName: "DOCUMENTATION LINK",
    width: 250,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
];

const headers = [
  {
    field: "name",
    headerName: "SYSTEM NAME",
    width: 230,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "manufacturer",
    headerName: "MANUFACTURER",
    width: 250,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
];

export default function DocumentationSection() {
  const { title } = localizedData().documentation;
  const [tableColumns, setTableColumns] = useState(columns);
  const [columnHeaders, setColumnHeaders] = useState(headers);
  const [pageSize, setPageSize] = useState(14);
  const [docData, setDocData] = useState([]);
  const [hideModality, setHideModality] = useState(false);
  const [hideLink, setHideLink] = useState(false);

  const { data: rows, isLoading } = useProductsModelsListQuery();

  useEffect(() => {
    const dataArray = [];
    rows?.map((row) => {
      const obj = {
        id: row.id,
        name: row.product.name,
        manufacturer: row.product.manufacturer.name,
        modality: row.modality.name,
        documentation: row.documentation.url,
      };
      dataArray.push(obj);
    });
    setDocData([...dataArray]);
  }, [rows]);

  useEffect(() => {
    if (tableColumns[2]?.hide === true) {
      setHideModality(true);
    } else {
      setHideModality(false);
    }
    if (tableColumns[3]?.hide === true) {
      setHideLink(true);
    } else {
      setHideLink(false);
    }
    const headers = [tableColumns[0], tableColumns[1]];
    setColumnHeaders(headers);
  }, [tableColumns]);

  const renderModalities = (modalities) => {
    return (
      <div className="modality-section">
        {modalities.map((modality, index) => (
          <span key={index} className="modality">
            {modality}
          </span>
        ))}
      </div>
    );
  };

  const documentationLink = (link) => {
    return (
      <div className="documentaion-link">
        <img className="img" src={LinkLogo} />
        <span>{link}</span>
      </div>
    );
  };

  const actionLink = () => {
    return (
      <div>
        <img src={EditLogo} />
      </div>
    );
  };

  return (
    <div className="documentaion-section">
      <h2>{title}</h2>
      <TopTableFilters
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
      />
      <div style={{ marginTop: "30px" }}>
        <DataGrid
          rows={docData}
          autoHeight
          columns={[
            ...columnHeaders,
            {
              field: "MODALITY",
              disableColumnMenu: true,
              width: 250,
              hide: hideModality,
              sortable: false,
              renderCell: (cellValues) =>
                renderModalities([cellValues.row.modality]),
            },
            {
              field: "DOCUMENTATION LINK",
              disableColumnMenu: true,
              width: 450,
              hide: hideLink,
              sortable: false,
              renderCell: (cellValues) =>
                documentationLink(cellValues.row.documentation),
            },
            {
              field: "Actions",
              headerAlign: "center",
              align: "center",
              disableColumnMenu: true,
              width: 85,
              sortable: false,
              renderCell: () => (
                <div
                  // onClick={handleClick}
                  style={{
                    cursor: "pointer",
                    padding: "15px",
                    marginLeft: "auto",
                    marginTop: "10px",
                  }}
                >
                  {actionLink()}
                </div>
              ),
            },
          ]}
          loading={isLoading}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[14, 16, 18, 20]}
        />
      </div>
    </div>
  );
}
