import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import "@src/components/common/smart/profileTimeline/profileTimeline.scss";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

import ProfileTimeLineCards from "@src/components/common/presentational/profileTimeLineCards/ProfileTimeLineCards";
import RecentActivity from "@src/components/common/presentational/recentActivity/RecentActivity";
import TopicToggler from "@src/components/common/presentational/topicToggler/TopicToggler";
import { api } from "@src/store/reducers/api";
import { getTopicListArg } from "@src/types/interfaces";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ProfileTimeline = () => {
  const [topicListPayload, setTopicListPayload] = useState<getTopicListArg>({});
  const [slicePointer, setSlicePointer] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedTopics, setPaginatedTopics] = useState([]);
  const { data: topicsList = [], isLoading } =
    api.useGetTopicsListQuery(topicListPayload);

  const fetchMoreSection = () => {
    setSlicePointer((prevState) => prevState + 2);
    if (slicePointer + 2 >= topicsList.length) {
      setHasMore(false);
    }

    setTimeout(() => {
      setPaginatedTopics((prevState) => [
        ...prevState.concat([
          ...topicsList.slice(slicePointer, slicePointer + 2),
        ]),
      ]);
    }, 0);
  };
  useEffect(() => {
    if (topicsList && topicsList.length) {
      setPaginatedTopics([...topicsList.slice(0, 5)]);
      setSlicePointer(5);
      if (topicsList.length <= 5) {
        setHasMore(false);
      }
    }
  }, [topicsList]);
  return (
    <>
      <>
        <Box component="div" className="timeline_section">
          <Grid container spacing={2}>
            {!isLoading ? (
              <Grid item xs={9}>
                <InfiniteScroll
                  dataLength={paginatedTopics.length}
                  next={fetchMoreSection}
                  hasMore={hasMore}
                  loader={
                    <h4
                      style={{
                        width: "100%",
                        textAlign: "center",
                        color: "#696f77",
                      }}
                    ></h4>
                  }
                >
                  <Grid container xs={12} item style={{ marginTop: "0px" }}>
                    {paginatedTopics?.map((item, key) => (
                      <Grid key={key} item xs={12}>
                        <ProfileTimeLineCards
                          description={item?.description}
                          title={item?.title}
                          user={item?.user}
                          image={item?.image}
                          number_of_comments={item?.number_of_comments}
                          number_of_followers={item?.number_of_followers}
                          categories={item?.categories}
                          followers={item?.followers}
                          id={item?.id}
                          reply_email_notification={
                            item?.reply_email_notification
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </InfiniteScroll>
              </Grid>
            ) : (
              <p>Loading ...</p>
            )}

            <Grid item xs={3}>
              <div className="timelineLeft">
                <div className="allTopics">
                  <TopicToggler setTopicListPayload={setTopicListPayload} />
                </div>
              </div>
              <RecentActivity />
            </Grid>
          </Grid>
        </Box>
      </>
    </>
  );
};

export default ProfileTimeline;
