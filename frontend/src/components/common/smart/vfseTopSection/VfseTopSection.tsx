// import CountingInfoCards from "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards";
import React, { useState, useMemo, useEffect } from "react";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, Button, InputAdornment, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import debouce from "lodash.debounce";

import TopicUpdatesCards from "@src/components/common/presentational/topicUpdatesCards/TopicUpdatesCard";
import useStyles from "@src/components/common/smart/vfseTopSection//Styles";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import { api, VfseTopicsListApiResponse } from "@src/store/reducers/api";

interface Props {
  setOpen?: (arg: boolean) => void;
  title: string;
  seeAll: string;
  paginatedTopics: VfseTopicsListApiResponse;
  setPaginatedTopics?: React.Dispatch<
    React.SetStateAction<VfseTopicsListApiResponse>
  >;
}

export default function VfseTopSection({
  setOpen,
  title,
  seeAll,
  paginatedTopics,
  setPaginatedTopics,
}: Props) {
  const classes = useStyles();
  const { data: popularTopicData = [] } = api.useGetPopularTopicsQuery(); //popular
  const { data: topicsList = [] } = api.useGetTopicsListQuery({});

  const [searchTerm, setSearchTerm] = useState("");
  const [listData, setListData] = useState([]);

  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [sort, setSort] = useState<number>(0);
  const [filter, setfilter] = useState<number>(0);

  useEffect(() => {
    setListData(popularTopicData);
  }, [popularTopicData]);

  useEffect(() => {
    handleChangeFilter();
    handleChangeSortBy();
    if (filter === 30 && sort === 30) {
      setListData(popularTopicData);
      setPaginatedTopics(topicsList);
    }
    if (searchTerm !== "") {
      if (popularTopicData && popularTopicData.length) {
        setListData([
          ...popularTopicData.filter((topic) => {
            return (
              (topic?.title + topic?.description + topic?.user?.name)
                ?.trim()
                ?.toLowerCase()
                ?.search(searchTerm?.toLowerCase()?.trim()) != -1
            );
          }),
        ]);
      }
      if (topicsList && topicsList.length) {
        setPaginatedTopics([
          ...topicsList.filter((topic) => {
            return (
              (
                topic?.title +
                topic?.description +
                topic?.user?.name.trim().toLowerCase()
              )
                ?.trim()
                ?.toLowerCase()
                ?.search(searchTerm?.toLowerCase()?.trim()) != -1
            );
          }),
        ]);
      }
    } else {
      setListData([...popularTopicData]);
      setPaginatedTopics([...topicsList]);
    }
  }, [searchTerm, sort, filter]);

  const handleChangeFilter = async () => {
    if (filter === 10) {
      //ASC
      const ascPopulatTopicsData = await [
        ...listData.slice().sort((first, second) => {
          return first?.id - second?.id;
        }),
      ];
      setListData([...ascPopulatTopicsData]);
      const ascPaginatedTopicsData = await [
        ...paginatedTopics.slice().sort((first, second) => {
          return first?.id - second?.id;
        }),
      ];
      setPaginatedTopics([...ascPaginatedTopicsData]);
    } else if (filter === 20) {
      //DES
      const reversePopularTopicsData = await listData
        .slice()
        .sort((first, second) => {
          return first?.id - second?.id;
        })
        .reverse();
      setListData([...reversePopularTopicsData]);

      const reverseTopicsListData = await [
        ...paginatedTopics.slice().sort((first, second) => {
          return first?.id - second?.id;
        }),
      ].reverse();
      setPaginatedTopics([...reverseTopicsListData]);
    } else {
      setListData([...popularTopicData]);
      setPaginatedTopics([...topicsList]);
    }
  };

  const handleChangeSortBy = async () => {
    if (sort === 10) {
      //Created At
      const sortedCreatedAtDatesPopular = await listData
        .slice()
        .sort((first, second) => {
          return (
            new Date(first?.created_at).getTime() -
            new Date(second?.created_at).getTime()
          );
        });
      setListData(sortedCreatedAtDatesPopular);
      const sortedCreatedAtDatesTopics = await paginatedTopics
        .slice()
        .sort((first, second) => {
          return (
            new Date(first?.created_at).getTime() -
            new Date(second?.created_at).getTime()
          );
        });
      setPaginatedTopics(sortedCreatedAtDatesTopics);
    } else if (sort === 20) {
      //UpdatedAt !TODO
      const sortedUpdateAtDatesPopular = await listData
        .slice()
        .sort((first, second) => {
          return (
            new Date(first?.updated_at).getTime() -
            new Date(second?.updated_at).getTime()
          );
        });
      setListData(sortedUpdateAtDatesPopular);

      const sortedUpdatedAtDatesTopics = await paginatedTopics
        .slice()
        .sort((first, second) => {
          return (
            new Date(first?.updated_at).getTime() -
            new Date(second?.updated_at).getTime()
          );
        });
      setPaginatedTopics(sortedUpdatedAtDatesTopics);
    } else {
      setListData(popularTopicData);
      setPaginatedTopics(topicsList);
    }
  };

  const searchSetter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  //useMemo Hook is used to memoize a return value from our debounce function.
  const debouncedResults = useMemo(() => {
    return debouce(searchSetter, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const { btnCreateTopic } = localizedData().Forum;

  const handleClose = () => {
    setOpenSort(false);
  };

  const handleOpen = () => {
    setOpenSort(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleModal = () => {
    setOpen(true);
  };

  const sortSetter = (e) => {
    setSort(e.target.value);
  };
  const filterSetter = (e) => {
    setfilter(e.target.value);
  };

  const renderPopularTopics = () => {
    return (
      <>
        <Box component="div" className="topic_updates_section" mt={3}>
          <div className="heading_section">
            <h2 className="heading">{title}</h2>
            <h3 className="subheading">{seeAll}</h3>
          </div>
          <Box component="div" className="cardsSection" mt={2}>
            <Grid container spacing={3}>
              {listData?.map((item, key) => (
                <Grid key={key} item lg={6} xl={3} md={4} sm={12} xs={12}>
                  <TopicUpdatesCards
                    cardTitle={item?.title}
                    numberOfComments={item?.number_of_comments}
                    numberOfFollowers={item?.number_of_followers}
                    categories={item?.categories}
                    followers={item?.followers}
                    user={item?.user}
                    id={item?.id}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        {/* Sort  */}
        <Grid item xs={4} sm={4} md={2} lg={2}>
          <FormControl className={classes.sortByField} size="small">
            <InputLabel id="sort-by-categoty">Sort By:</InputLabel>
            <Select
              labelId="sort-by-category-label"
              id="demo-controlled-open-select"
              open={openSort}
              onClose={handleClose}
              onOpen={handleOpen}
              // value={sort}
              label="Sort"
              onChange={sortSetter}
              defaultValue=""
            >
              <MenuItem value={30}>None</MenuItem>
              <MenuItem value={20}>Updated At</MenuItem>
              <MenuItem value={10}>Created At</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filter  */}
        <Grid item xs={2} sm={2} md={1} lg={2} ml={3}>
          <FormControl
            // sx={{ m: 0, mr: 1, minWidth: 140, backgroundColor: "white" }}
            className={classes.filterField}
            size="small"
          >
            <InputLabel id="filter-dropdown">Filter:</InputLabel>
            <Select
              labelId="filter-dropdown-label"
              id="filter-dropdown-select"
              open={openFilter}
              onClose={handleCloseFilter}
              onOpen={handleOpenFilter}
              // value={filter}
              label="Filter"
              onChange={filterSetter}
              defaultValue=""
            >
              <MenuItem value={30}>None</MenuItem>
              <MenuItem value={10}>Ascending</MenuItem>
              <MenuItem value={20}>Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Search  */}
        <Grid item xs={12} sm={12} md={2} lg={3}>
          <TextField
            id="search-topics"
            size="small"
            className={classes.topSearchInput}
            variant="outlined"
            onChange={debouncedResults}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Create Topic Button  */}
        <Grid item xs={6} sm={12} md={12} lg={4} className={classes.topBtnGrid}>
          <Box className={classes.topBtnCreate}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onClick={handleModal}
            >
              {btnCreateTopic}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box className="rootSection">
        <Box component="div" className="div-wrapper">
          {/* SortBy Div */}
          {/* <div style={{ marginRight: "5px" }}>
            <FormControl
              sx={{ m: 0, mr: 1, minWidth: 200, backgroundColor: "white" }}
              size="small"
            >
              <InputLabel id="sort-by-categoty">Sort By:</InputLabel>
              <Select
                labelId="sort-by-category-label"
                id="demo-controlled-open-select"
                open={openSort}
                onClose={handleClose}
                onOpen={handleOpen}
                // value={sort}
                label="Sort"
                onChange={handleChangeSort}
              >
                <MenuItem value={10}>Created At</MenuItem>
                <MenuItem value={20}>updated At</MenuItem>
              </Select>
            </FormControl>
          </div> */}
          {/* Filter Div */}
          {/* <div style={{ marginRight: "5px" }}>
            <FormControl
              sx={{ m: 0, mr: 1, minWidth: 140, backgroundColor: "white" }}
              size="small"
            >
              <InputLabel id="filter-dropdown">Filter:</InputLabel>
              <Select
                labelId="filter-dropdown-label"
                id="filter-dropdown-select"
                open={openFilter}
                onClose={handleCloseFilter}
                onOpen={handleOpenFilter}
                value={filter}
                label="Filter"
                onChange={handleChangeFilter}
              >
                <MenuItem value={1}>Ascending</MenuItem>
                <MenuItem value={2}>Descending</MenuItem>
              </Select>
            </FormControl>
          </div> */}
          {/* Search Div  */}
          {/* <Box
            component="form"
            sx={{
              "& .MuiTextField-root": {
                m: 0,
                mr: 1,
                width: "75ch",
                backgroundColor: "white",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="search-topics"
                size="small"
                className="Search-input"
                variant="outlined"
                onChange={debouncedResults}
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Box> */}
        </Box>
        {/* Div-3 Create A Topic */}
        {/* <div className="create-topic-btn">
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            variant="contained"
            className="AddTopicsbtn"
            onClick={handleModal}
          >
            <div className="btn-content">
              <AddIcon />
              <span className="text" id={`remove`}>
                {btnCreateTopic}
              </span>
            </div>
          </Button>
        </div> */}
      </Box>
      {renderPopularTopics()}
    </>
  );
}
