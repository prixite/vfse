import { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import EditLogo from "@src/assets/svgs/Edit.svg";
import LinkLogo from "@src/assets/svgs/Link.svg";
import "@src/components/common/Smart/DocumentationSection/DocumentationSection.scss";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import DocumentModal from "@src/components/shared/popUps/DocumentModal/DocumentModal";
import { localizedData } from "@src/helpers/utils/language";
import { useProductsModelsListQuery } from "@src/store/reducers/api";

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
  const [searchText, setSearchText] = useState("");
  const [tableColumns, setTableColumns] = useState(columns);
  const [columnHeaders, setColumnHeaders] = useState(headers);
  const [pageSize, setPageSize] = useState(14);
  const [docData, setDocData] = useState([]);
  const [hideModality, setHideModality] = useState(false);
  const [hideLink, setHideLink] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [searchedData, setSearchedData] = useState(null);
  const { searching } = localizedData().common;
  const [open, setOpen] = useState(false);

  const { noDataDescription, noDataTitle } = localizedData().organization;

  const { data: rows, isLoading } = useProductsModelsListQuery();

  const [docList, setDocList] = useState({});

  useEffect(() => {
    if (searchText?.length > 2 && docList && docList?.results?.length) {
      setHasData(true);
    } else if (docData?.length && searchText?.length <= 2) {
      setHasData(true);
    } else {
      setHasData(false);
    }
  }, [searchText, docList, docData]);

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
    const dataArray = [];
    docList?.results?.map((row) => {
      const obj = {
        id: row.id,
        name: row.product.name,
        manufacturer: row.product.manufacturer.name,
        modality: row.modality.name,
        documentation: row.documentation.url,
      };
      dataArray.push(obj);
    });
    setSearchedData([...dataArray]);
  }, [docList]);

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

  const handleClose = () => setOpen(false);

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
      {/* <TopTableFilters
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
      /> */}
      <TopViewBtns
        setOpen={setOpen}
        path="documentation"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
        setList={setDocList}
        actualData={rows}
        searchText={searchText}
        setSearchText={setSearchText}
        hasData={hasData}
      />
      <div style={{ marginTop: "30px" }}>
        {searchText?.length > 2 ? (
          docList &&
          searchedData?.length &&
          docList?.results?.length &&
          docList?.query === searchText ? (
            <DataGrid
              rows={searchedData}
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
          ) : docList?.query === searchText ? (
            <NoDataFound
              search
              setQuery={setSearchText}
              title={noDataTitle}
              description={noDataDescription}
            />
          ) : (
            <div
              style={{
                color: "gray",
                marginLeft: "45%",
                marginTop: "20%",
              }}
            >
              <h2>{searching}</h2>
            </div>
          )
        ) : docData && docData?.length ? (
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
        ) : (
          <NoDataFound title={noDataTitle} description={noDataDescription} />
        )}
      </div>
      <DocumentModal open={open} handleClose={handleClose} />
    </div>
  );
}
