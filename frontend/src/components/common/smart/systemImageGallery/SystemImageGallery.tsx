import { SetStateAction, useState, Dispatch, useEffect } from "react";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import CardSkeleton from "@src/components/common/presentational/cardSkeleton/CardSkeleton";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { useAppSelector } from "@src/store/hooks";
import { useSystemsImagesListQuery } from "@src/store/reducers/api";

import "@src/components/common/smart/systemImageGallery/systemImageGallery.scss";

interface galleryProps {
  setSystemImage: Dispatch<SetStateAction<number>>;
  systemImage: number;
}

interface imgProps {
  src: string;
  imgIndex: number;
  index: number;
}

const RenderImage = ({ src, imgIndex, index }: imgProps) => {
  const [loaded, setIsLoaded] = useState(false);
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const [browserWidth] = useWindowSize();

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
          marginBottom: `${
            browserWidth !== 0 && browserWidth > mobileWidth ? "4px" : "0px"
          }`,
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
  const { t } = useTranslation();
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
  const [slicePointer, setSlicePointer] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedImages, setPaginatedImages] = useState([]);
  const fetchMoreSection = () => {
    setSlicePointer((prevState) => prevState + 4);
    if (slicePointer + 4 >= data.length) {
      setHasMore(false);
    }

    setTimeout(() => {
      setPaginatedImages((prevState) => [
        ...prevState.concat([...data.slice(slicePointer, slicePointer + 4)]),
      ]);
    }, 0);
  };
  useEffect(() => {
    if (data && data?.length) {
      setPaginatedImages([...data.slice(0, slicePointer + 12)]);
      setSlicePointer((prevState) => prevState + 12);
      if (data?.length < slicePointer + 12) {
        setHasMore(false);
      }
    }
  }, [data]);

  return (
    <div className="systemGallery">
      {!isFetching && data?.length ? (
        <ImageList
          sx={{ width: "100%", height: 300 }}
          cols={4}
          rowHeight={150}
          className="SystemImageList"
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={paginatedImages.length}
            next={fetchMoreSection}
            hasMore={hasMore}
            loader={
              <h4
                style={{
                  width: "100%",
                  textAlign: "center",
                  color: "#696f77",
                }}
              >
                {t("Loading ...")}
              </h4>
            }
            scrollableTarget="scrollableDiv"
          >
            {paginatedImages.map((item) => (
              <ImageListItem
                key={item.id}
                onClick={() => handleSelectedImage(item?.id)}
              >
                <RenderImage
                  src={item?.image}
                  imgIndex={item?.id}
                  index={systemImage}
                />
              </ImageListItem>
            ))}
          </InfiniteScroll>
        </ImageList>
      ) : (
        <h3>{t("Loading ...")}</h3>
      )}
    </div>
  );
};

export default SystemImageGallery;
