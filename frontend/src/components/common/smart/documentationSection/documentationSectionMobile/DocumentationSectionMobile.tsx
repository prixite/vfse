import { useState, useEffect } from "react";

import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import "@src/components/common/smart/documentationSection/documentationSectionMobile/documentationSectionMobile.scss";
import InfiniteScroll from "react-infinite-scroll-component";

import DocumentationCard from "@src/components/common/smart/documentationSection/documentationCard/DocumentationCard";

interface DocumentationSectionMobileProps {
  docList: {
    id: number;
    product_id: number;
    name: string;
    manufacturer: string;
    modality: string;
    documentation: string;
    model: string;
  }[];
  documentationLink: (link: string) => JSX.Element;
  openDropDown: (event: unknown, id: number, name: string) => void;
}
const DocumentationSectionMobile = ({
  docList,
  documentationLink,
  openDropDown,
}: DocumentationSectionMobileProps) => {
  const { t } = useTranslation();
  const [slicePointer, setSlicePointer] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedDocs, setPaginatedDocs] = useState([]);
  const fetchMoreSection = () => {
    setSlicePointer((prevState) => prevState + 2);
    if (slicePointer + 2 >= docList.length) {
      setHasMore(false);
    }

    setTimeout(() => {
      setPaginatedDocs((prevState) => [
        ...prevState.concat([...docList.slice(slicePointer, slicePointer + 2)]),
      ]);
    }, 0);
  };
  useEffect(() => {
    setPaginatedDocs([...docList.slice(0, slicePointer + 4)]);
    setSlicePointer((prevState) => prevState + 4);
  }, [docList]);
  return (
    <Box className="DocumentationSectionMobile">
      <InfiniteScroll
        dataLength={paginatedDocs.length}
        next={fetchMoreSection}
        hasMore={hasMore}
        loader={
          <h4 style={{ width: "100%", textAlign: "center", color: "#696f77" }}>
            {t("Loading ...")}
          </h4>
        }
      >
        {paginatedDocs?.map((doc, i) => (
          <DocumentationCard
            key={i}
            doc={doc}
            documentationLink={documentationLink}
            openDropDown={openDropDown}
          />
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export default DocumentationSectionMobile;
