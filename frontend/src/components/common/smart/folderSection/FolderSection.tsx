import { useState, useEffect } from "react";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Grid, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/smart/folderSection/folderSection.scss";

const topData = {
  folderName: "Folder name",
  results: [
    {
      name: "Get started",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    },
    {
      name: "Get started",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    },
    {
      name: "Get started",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    },
    {
      name: "desc",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    },
    {
      name: "folder",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    },
    {
      name: "Get started",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    },
  ],
};

interface document {
  query: string;
  results?: { name: string }[];
}

const FolderSection = () => {
  const { id } = useParams();
  const doc: document = { results: [], query: "" };
  const [documentList, setDocumentList] = useState(doc);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const localization: LocalizationInterface = localizedData();
  const { backBtn } = localization.folderSection;
  const { organizationRoute } = constants;

  useEffect(() => {
    if (query?.length > 2) {
      setList(documentList?.results);
    } else {
      setList(topData?.results);
    }
  }, [topData, documentList, query, setList]);

  return (
    <Box component="div" className="folder-heading">
      <Link
        to={`/${organizationRoute}/${id}/knowledge-base`}
        key={id}
        style={{ textDecoration: "none", height: "100%" }}
      >
        <div className="back-btn">
          <ArrowRightAltIcon
            style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
          />
          <p className="back-text">{backBtn}</p>
        </div>
      </Link>
      <h2 className="main-heading">{topData?.folderName}</h2>
      <TopViewBtns
        path="description"
        actualData={topData?.results}
        searchText={query}
        setSearchText={setQuery}
        setList={setDocumentList}
      />
      <Grid container spacing={1} style={{ marginTop: "30px" }}>
        {query?.length > 2 && documentList.query === query
          ? list.map((item, index) => (
              <Grid item={true} xs={6} xl={2} md={3} key={index}>
                <KnowledgeTopCard
                  title={item?.name}
                  description={item?.description}
                />
              </Grid>
            ))
          : query?.length < 2 || !query?.length
          ? list.map((item, index) => (
              <Grid item={true} xs={6} xl={2} md={3} key={index}>
                <KnowledgeTopCard
                  title={item?.name}
                  description={item?.description}
                />
              </Grid>
            ))
          : ""}
      </Grid>
      {query?.length > 2 && documentList.query !== query ? (
        <div
          style={{
            color: "gray",
            marginLeft: "45%",
            marginTop: "20%",
          }}
        >
          <h2>{"Loading...."}</h2>
        </div>
      ) : (
        ""
      )}
      {query?.length > 2 && !list?.length && documentList.query === query ? (
        <NoDataFound
          search
          setQuery={setQuery}
          queryText={query}
          title={noDataTitle}
          description={noDataDescription}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default FolderSection;
