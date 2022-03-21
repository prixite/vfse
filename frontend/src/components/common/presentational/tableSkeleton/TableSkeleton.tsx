import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton = () => {
  return (
    <>
      <div style={{ marginTop: "55px" }}>
        <Skeleton height={50} />
        <div style={{ marginTop: "40px" }}>
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
          <Skeleton height={30} style={{ marginBottom: "30px" }} />
        </div>
      </div>
    </>
  );
};
export default TableSkeleton;
