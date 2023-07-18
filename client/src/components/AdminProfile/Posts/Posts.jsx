import React, { useState } from "react";
import { createPortal } from "react-dom";
import ViewPostModal from "../../Modal/ViewPostModal";

const Posts = ({ data }) => {
  const [viewPostModal, setViewPostModal] = useState(false);
  const [modalImageData, setModalImageData] = useState();

  return (
    <section className="border-t border-gray-600">
      <div className="grid grid-cols-3 gap-1 my-2">
        {data &&
          data.map((element) => {
            return (
              <img
                src={element.photo}
                key={data.indexOf(element)}
                draggable="false"
                className="hover:cursor-pointer w-[100%] h-[100%]"
                onClick={() => {
                  setViewPostModal(true);
                  setModalImageData(element);
                }}
              />
            );
          })}
      </div>

      {viewPostModal &&
        createPortal(
          <ViewPostModal
            image={modalImageData}
            onClose={() => setViewPostModal(false)}
          />,
          document.body
        )}
    </section>
  );
};

export default Posts;
