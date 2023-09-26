import { useState, useEffect } from "react";

import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import EditLogo from "@src/assets/svgs/edit.svg";
import LinkLogo from "@src/assets/svgs/link.svg";
import "@src/components/common/smart/documentationSection/documentationSection.scss";
import DocumentationSectionMobile from "@src/components/common/smart/documentationSection/documentationSectionMobile/DocumentationSectionMobile";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import DocumentModal from "@src/components/shared/popUps/documentModal/DocumentModal";
import { mobileWidth } from "@src/helpers/utils/config";
import { timeOut } from "@src/helpers/utils/constants";
import { deleteProductModelService } from "@src/services/documentationService";
import {
  useProductsModelsListQuery,
  useProductsModelsDeleteMutation,
} from "@src/store/reducers/api";

export default function DocumentationSection() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(14);
  const [docData, setDocData] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [currentProductModel, setCurrentProductModel] = useState(null);
  const [productName, setProductName] = useState("");
  const [action, setAction] = useState("add");
  const [anchorEl, setAnchorEl] = useState(null);
  const openModal = Boolean(anchorEl);
  const [openConfModal, setOpenConfModal] = useState(false);
  const [browserWidth] = useWindowSize();
  const [deleteProductModel] = useProductsModelsDeleteMutation();

  const { data: rows, isLoading } = useProductsModelsListQuery({});

  const [searchedList, setSearchedList] = useState({});
  const [docList, setDocList] = useState(null);
  useEffect(() => {
    if (query?.trim().length > 2 && searchedList) {
      setHasData(true);
      setDocList(docList);
      handleSearchQuery(query);
    } else if (docData?.length && query?.trim().length <= 2) {
      setHasData(true);
      setDocList(docData);
    } else {
      setHasData(false);
    }
  }, [query, searchedList, docData]);

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

  const handleSearchQuery = async (searchQuery: string) => {
    const itemsToBeSet = [
      ...docData.filter((doc) => {
        return (
          (
            doc?.name +
            doc?.model +
            doc?.modality +
            doc?.product_id +
            doc?.documentation +
            doc?.id
          )
            ?.trim()
            .toLowerCase()
            .search(searchQuery?.trim().toLowerCase()) != -1
        );
      }),
    ];
    if (docData && docData.length) {
      await Promise.all([itemsToBeSet, setDocList(itemsToBeSet)]);
    }
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
            toast.success("Link Copied", {
              autoClose: timeOut,
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
    await deleteProductModelService(currentDoc, deleteProductModel);
    toast.success("Documentation successfully deleted.", {
      autoClose: timeOut,
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
    {
      field: "MODALITY",
      headerName: "MODALITY",
      disableColumnMenu: true,
      width: 250,
      hide: false,
      sortable: false,
      renderCell: (cellValues) => renderModalities([cellValues?.row?.modality]),
    },
    {
      field: "DOCUMENTATION LINK",
      headerName: "DOCUMENTATION LINK",
      disableColumnMenu: true,
      width: 500,
      hide: false,
      sortable: false,
      renderCell: (cellValues) =>
        documentationLink(cellValues?.row?.documentation),
    },
  ];

  const [columnHeaders, setColumnHeaders] = useState(headers);

  return (
    <div className="documentaion-section">
      <h2>{t("Documentation database")}</h2>
      <TopViewBtns
        setOpen={setOpen}
        path="documentation"
        tableColumns={columnHeaders}
        setTableColumns={setColumnHeaders}
        setList={setSearchedList}
        actualData={rows}
        searchText={query}
        setSearchText={setQuery}
        hasData={hasData}
      />
      <div style={{ marginTop: "30px" }}>
        {docList && docList?.length ? (
          <>
            {browserWidth > mobileWidth ? (
              <DataGrid
                rows={docList}
                autoHeight
                columns={[
                  ...columnHeaders.filter((item) => !item.hide),
                  ...(columnHeaders.some((item) => item.hide === false)
                    ? [
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
                                handleClick(
                                  e,
                                  cellValues?.row?.id,
                                  cellValues?.row?.name
                                )
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
                      ]
                    : []),
                ]}
                loading={isLoading}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[14, 16, 18, 20]}
              />
            ) : (
              <DocumentationSectionMobile
                docList={docList}
                documentationLink={documentationLink}
                openDropDown={handleClick}
              />
            )}
          </>
        ) : searchedList?.query === query ? (
          <NoDataFound
            title={"Sorry! No results found. :("}
            description={"Try Again"}
          />
        ) : (
          <div
            style={{
              color: "gray",
              marginLeft: "45%",
              marginTop: "20%",
            }}
          >
            <h2>{t("Searching ...")}</h2>
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
        <MenuItem onClick={() => editDocumentModal()}>{t("Edit")}</MenuItem>
        <MenuItem onClick={handleModalOpen}>{t("Delete")}</MenuItem>
      </Menu>
      <DocumentModal
        open={open}
        handleClose={handleClose}
        selectedDocId={currentDoc}
        selectedDoc={currentProductModel}
        action={action}
      />
    </div>
  );
}
