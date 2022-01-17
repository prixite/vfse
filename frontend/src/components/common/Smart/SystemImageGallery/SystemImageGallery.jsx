import { useState, useRef, useEffect } from "react";

import Flicking from "@egjs/react-flicking";

import { useSystemsImagesListQuery } from "@src/store/reducers/api";
import "@src/components/common/Smart/SystemImageGallery/SystemImageGallery.scss";

const SystemImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(""); // eslint-disable-line
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);
  const { data, isFetching } = useSystemsImagesListQuery();

  useEffect(() => {
    if (data?.length) {
      setSelectedImage(data[0]?.image);
    }
  }, [data]);

  const handleSelectedImage = (id, image) => {
    setIndex(id);
    setSelectedImage(image);
  };
  return (
    <div className="systemGallery">
      {/* <div className="selectedImage">
               <img src={selectedImage}/>
           </div> */}
      {!isFetching && data?.length ? (
        <Flicking
          ref={carouselRef}
          tag="div"
          viewportTag="div"
          cameraTag="div"
          classPrefix="eg-flick"
          deceleration={0.0075}
          zIndex={4000}
          horizontal
          bound
          gap={15}
        >
          {data.map((image, imgIndex) => (
            <div
              className="image"
              key={imgIndex}
              onClick={() => handleSelectedImage(imgIndex, image.image)}
            >
              <img
                src={image.image}
                style={{
                  border: `${
                    index === imgIndex ? "5px solid rgb(119, 60, 189)" : ""
                  }`,
                }}
              />
            </div>
          ))}
        </Flicking>
      ) : (
        <h3>loading</h3>
      )}
    </div>
  );
};

export default SystemImageGallery;
