import React, { useState, useEffect } from "react";

import "@src/components/common/Smart/DocumentationSection/DocumentationSectionMobile.scss";
import { Box } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import DocumentationCard from "@src/components/common/Smart/DocumentationSection/DocumentationCard";

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
  documentationLink: (link: any) => JSX.Element;
  openDropDown: (event: any, id: any, name: any) => void;
}
const DocumentationSectionMobile = ({
  docList,
  documentationLink,
  openDropDown,
}: DocumentationSectionMobileProps) => {
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
    }, 500);
  };
  useEffect(() => {
    setPaginatedDocs([...docList.slice(slicePointer, slicePointer + 4)]);
  }, [docList]);
  return (
    <Box className="DocumentationSectionMobile">
      <InfiniteScroll
        dataLength={paginatedDocs.length}
        next={fetchMoreSection}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
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
