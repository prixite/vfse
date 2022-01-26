import { SetStateAction, useState, Dispatch, useEffect } from "react";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardSkeleton from "../../Presentational/CardSkeleton/CardSkeleton";
import { useSystemsImagesListQuery } from "@src/store/reducers/api";

import "@src/components/common/Smart/SystemImageGallery/SystemImageGallery.scss";
import { Hidden } from "@mui/material";
import { height } from "@mui/system";

interface galleryProps {
  setSystemImage: Dispatch<SetStateAction<number>>;
}

const RenderImage = ({src, imgIndex, index}) =>{
  const [loaded, setIsLoaded] = useState(false);
  return(
    <>
    <img
    src={`${src}?w=160&h=160&fit=crop&auto=format`}
    srcSet={`${src}?w=160&h=160&fit=crop&auto=format&dpr=2 2x`}
    loading="lazy"
    onLoad={() => {
      setIsLoaded(true);
    }}
    style={{
      border: `${
        index === imgIndex ? "5px solid rgb(119, 60, 189)" : ""
      }`,
      width: "164px",
      height: "164px",
      cursor: "pointer",
      marginBottom: "4px",
      opacity: loaded ? 1 : 0 
    }}
  />
  <div style={{visibility: loaded ? "hidden" : "visible"}} className="imageOver"><CardSkeleton height={146}/></div> 
   </>
  );
};

const SystemImageGallery = ({ setSystemImage }: galleryProps) => {
  const [index, setIndex] = useState(0);
  const { data, isFetching } = useSystemsImagesListQuery();

  useEffect(() => {
    if (data?.length) {
      setSystemImage(data[0]?.id);
    }
  }, [data]);

  const handleSelectedImage = (id, imageId) => {
    const image = parseInt(imageId);
    setIndex(id);
    setSystemImage(image);
  };

  return (
    <div className="systemGallery">
      {!isFetching && data?.length ? (
        <ImageList sx={{ width: "100%", height: 300 }} cols={4} rowHeight={150}>
          {data.map((item, imgIndex) => (
            <ImageListItem
              key={item.id}
              onClick={() => handleSelectedImage(imgIndex, item?.id)}
            >
             <RenderImage src={item.image} imgIndex={imgIndex} index={index}/>
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <h3>loading</h3>
      )}
    </div>
  );
};

export default SystemImageGallery;
