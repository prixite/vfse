import { useState, useEffect } from "react";

import "@src/components/common/smart/userSection//userSectionMobile/userSectionMobile.scss";
import { Box } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import UserCard from "@src/components/common/smart/activeUsersSection/userCard/UserCard";
import { User } from "@src/store/reducers/api";

interface UserSectionMobileProps {
  userList: User[];
}
const UserSectionMobile = ({ userList }: UserSectionMobileProps) => {
  const [slicePointer, setSlicePointer] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedDocs, setPaginatedDocs] = useState([]);
  const fetchMoreSection = () => {
    setSlicePointer((prevState) => prevState + 2);
    if (slicePointer + 2 >= userList.length) {
      setHasMore(false);
    }

    setTimeout(() => {
      setPaginatedDocs((prevState) => [
        ...prevState.concat([
          ...userList.slice(slicePointer, slicePointer + 2),
        ]),
      ]);
    }, 0);
  };
  useEffect(() => {
    setPaginatedDocs([...userList.slice(0, slicePointer + 4)]);
    setSlicePointer((prevState) => prevState + 4);
  }, [userList]);
  return (
    <Box className="UserSectionMobile">
      <InfiniteScroll
        dataLength={paginatedDocs.length}
        next={fetchMoreSection}
        hasMore={hasMore}
        loader={
          <h4 style={{ width: "100%", textAlign: "center", color: "#696f77" }}>
            Loading...
          </h4>
        }
      >
        {paginatedDocs?.map((doc, i) => (
          <UserCard key={i} user={doc} />
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export default UserSectionMobile;
