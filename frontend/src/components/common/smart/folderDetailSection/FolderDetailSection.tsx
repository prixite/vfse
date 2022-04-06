import {useState} from 'react'
import { Box,Grid} from "@mui/material";
import { api } from '@src/store/reducers/api'
import { useParams } from 'react-router'
import { localizedData } from "@src/helpers/utils/language";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import "@src/components/common/smart/folderDetailSection/folderDetailSection.scss";
const FolderDetailSection = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const {folderId} = useParams<{folderId:string}>();
  const {data : folderData} = api.useGetFolderQuery({id:parseInt(folderId)})
  console.log(folderData , "folderData")
  return (
    <Box component="div" className="FolderDetailSection">
    <h1 className="main-heading">{folderData?.name}</h1>
    <TopViewBtns
        setOpen={setOpen}
        path="knowledge-base"
        setSearchText={setQuery}
        searchText={query}
      />
         <Grid container spacing={1} style={{marginTop:"9px"}}>
        { folderData.documents?.length ?
        folderData.documents.map((item, index) => (
          <Grid item={true} xs={6} xl={2} md={6} lg={3} key={index}>
            <KnowledgeTopCard title={item?.title} description={item?.text} />
          </Grid>
        ))
      :
      <NoDataFound
      search
      setQuery={setQuery}
      queryText={query}
      title={noDataTitle}
      description={noDataDescription}
    />
      }
      </Grid>
    </Box>
  )
}

export default FolderDetailSection