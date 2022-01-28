import { SetStateAction, useState, Dispatch, useEffect } from "react";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { useAppSelector } from "@src/store/hooks";
import { useSystemsImagesListQuery } from "@src/store/reducers/api";

import CardSkeleton from "../../Presentational/CardSkeleton/CardSkeleton";

import "@src/components/common/Smart/SystemImageGallery/SystemImageGallery.scss";

interface galleryProps {
  setSystemImage: Dispatch<SetStateAction<number>>;
  systemImage: number
}

interface imgProps {
  src: string;
  imgIndex: number;
  index: number;
}

const RenderImage = ({ src, imgIndex, index }: imgProps) => {
  const [loaded, setIsLoaded] = useState(false);
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  return (
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
            index === imgIndex ? `5px solid ${buttonBackground}` : ""
          }`,
          width: "164px",
          height: "164px",
          cursor: "pointer",
          marginBottom: "4px",
          opacity: loaded ? 1 : 0,
        }}
      />
      <div
        style={{ visibility: loaded ? "hidden" : "visible" }}
        className="imageOver"
      >
        <CardSkeleton height={146} />
      </div>
    </>
  );
};

const SystemImageGallery = ({ setSystemImage, systemImage }: galleryProps) => {
  const { data, isFetching } = useSystemsImagesListQuery();

  useEffect(() => {
    if (data?.length && systemImage === 0) {
      setSystemImage(data[0]?.id);
    }
  }, [data]);

  const handleSelectedImage = (imageId) => {
    const image = parseInt(imageId);
    setSystemImage(image);
  };

  return (
    <div className="systemGallery">
      {!isFetching && data?.length ? (
        <ImageList sx={{ width: "100%", height: 300 }} cols={4} rowHeight={150}>
          {data.map((item) => (
            <ImageListItem
              key={item.id}
              onClick={() => handleSelectedImage(item?.id)}
            >
              <RenderImage src={item?.image} imgIndex={item?.id} index={systemImage} />
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
