import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface cardProps {
  height?: number
}

const CardSkeleton = ({height}: cardProps) => {
  return (
    <>
      <Skeleton height={height ?  height : 187} />
    </>
  );
};
export default CardSkeleton;
