import { useState, useEffect } from "react";

import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import EditLogo from "@src/assets/svgs/Edit.svg";
import LinkLogo from "@src/assets/svgs/Link.svg";
import "@src/components/common/Smart/DocumentationSection/DocumentationSection.scss";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import DocumentModal from "@src/components/shared/popUps/DocumentModal/DocumentModal";
import { localizedData } from "@src/helpers/utils/language";
import { deleteProductModelService } from "@src/services/DocumentationService";
import {
  useProductsModelsListQuery,
  useProductsModelsDeleteMutation,
} from "@src/store/reducers/api";

const columns = [
  {
    field: "model",
    headerName: "MODEL NAME",
    width: 200,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
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
    width: 500,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
];

const headers = [
  {
    field: "model",
    headerName: "MODEL NAME",
    width: 200,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
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
  const { searching } = localizedData().common;
  const [open, setOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [currentProductModel, setCurrentProductModel] = useState(null);
  const [productName, setProductName] = useState("");
  const [action, setAction] = useState("add");
  const [anchorEl, setAnchorEl] = useState(null);
  const openModal = Boolean(anchorEl);
  const [openConfModal, setOpenConfModal] = useState(false);

  const [deleteProductModel] = useProductsModelsDeleteMutation();

  const { noDataDescription, noDataTitle } = localizedData().organization;

  const {
    data: rows,
    isLoading,
    refetch: docsRefetch,
  } = useProductsModelsListQuery({});

  const [searchedList, setSearchedList] = useState({});
  const [docList, setDocList] = useState(null);

  useEffect(() => {
    if (
      searchText?.length > 2 &&
      searchedList &&
      searchedList?.results?.length
    ) {
      setHasData(true);
      setDocList(docList);
      handleSearchQuery(searchText);
    } else if (docData?.length && searchText?.length <= 2) {
      setHasData(true);
      setDocList(docData);
    } else {
      setHasData(false);
    }
  }, [searchText, searchedList, docData]);

  useEffect(() => {
    const dataArray = [];
    rows?.map((row) => {
      const obj = {
        id: row?.id,
        product_id: row?.product?.id,
        name: row?.product?.name,
        manufacturer: row?.product?.manufacturer?.name,
        modality: row?.modality?.name,
        documentation: row?.documentation?.url,
        model: row?.model,
      };
      dataArray.push(obj);
    });
    setDocData([...dataArray]);
  }, [rows]);

  useEffect(() => {
    if (tableColumns[3]?.hide === true) {
      setHideModality(true);
    } else {
      setHideModality(false);
    }
    if (tableColumns[4]?.hide === true) {
      setHideLink(true);
    } else {
      setHideLink(false);
    }
    const headers = [tableColumns[0], tableColumns[1], tableColumns[2]];
    setColumnHeaders(headers);
  }, [tableColumns]);

  const handleSearchQuery = (searchQuery: string) => {
    setDocList(
      docData?.filter((doc) => {
        return (
          doc?.name?.toLowerCase().search(searchQuery?.toLowerCase()) != -1
        );
      })
    );
  };

  const handleClose = () => {
    setOpen(false);
    handleActionClose();
  };

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
        <img
          className="img"
          src={LinkLogo}
          onClick={() => {
            navigator?.clipboard?.writeText(link);
            toast.success("Link Copied.", {
              autoClose: 1000,
              pauseOnHover: false,
            });
          }}
        />
        <span className="text">{link}</span>
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

  const handleClick = (event, id, name) => {
    setCurrentDoc(id);
    setProductName(name);
    setCurrentProductModel(docData?.find((doc) => doc.id === id));
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setAction("add");
    setCurrentProductModel(null);
  };

  const deleteDocument = async () => {
    handleModalClose();
    handleActionClose();
    await deleteProductModelService(
      currentDoc,
      deleteProductModel,
      docsRefetch
    );
    toast.success("Documentation successfully deleted", {
      autoClose: 1000,
      pauseOnHover: false,
    });
  };

  const handleModalOpen = () => {
    setOpenConfModal(true);
    handleActionClose();
  };
  const handleModalClose = () => {
    setOpenConfModal(false);
  };

  const editDocumentModal = async () => {
    setAction("edit");
    setOpen(true);
    setAnchorEl(null);
  };

  return (
    <div className="documentaion-section">
      <h2>{title}</h2>
      <TopViewBtns
        setOpen={setOpen}
        path="documentation"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
        setList={setSearchedList}
        actualData={rows}
        searchText={searchText}
        setSearchText={setSearchText}
        hasData={hasData}
      />
      <div style={{ marginTop: "30px" }}>
        {docList && docList?.length ? (
          <DataGrid
            rows={docList}
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
                  renderModalities([cellValues?.row?.modality]),
              },
              {
                field: "DOCUMENTATION LINK",
                disableColumnMenu: true,
                width: 500,
                hide: hideLink,
                sortable: false,
                renderCell: (cellValues) =>
                  documentationLink(cellValues?.row?.documentation),
              },
              {
                field: "Actions",
                headerAlign: "center",
                align: "center",
                disableColumnMenu: true,
                width: 95,
                sortable: false,
                renderCell: (cellValues) => (
                  <div
                    onClick={(e) =>
                      handleClick(e, cellValues?.row?.id, cellValues?.row?.name)
                    }
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
        ) : searchedList?.query === searchText ? (
          <NoDataFound title={noDataTitle} description={noDataDescription} />
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
        )}
      </div>
      <ConfirmationModal
        name={`Product Model of ${productName}`}
        open={openConfModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={deleteDocument}
      />
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="client-options-button"
        anchorEl={anchorEl}
        open={openModal}
        className="UserDropdownMenu"
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => editDocumentModal()}>Edit</MenuItem>
        <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
      </Menu>
      <DocumentModal
        open={open}
        handleClose={handleClose}
        refetch={docsRefetch}
        selectedDocId={currentDoc}
        selectedDoc={currentProductModel}
        action={action}
      />
    </div>
  );
}
