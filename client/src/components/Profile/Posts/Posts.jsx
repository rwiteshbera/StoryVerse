import React from "react";

const Posts = ({ data }) => {
  return (
    <section className="border-t border-gray-600">
      <div className="grid grid-cols-3 gap-2 my-2">
        {data.length > 0 ? (
          data.map((element) => {
            return (
              <img
                src={element.photo}
                key={data.indexOf(element)}
                draggable="false"
              />
            );
          })
        ) : (
          <div className="text-center">Loading</div>
        )}
      </div>
    </section>
  );
};

export default Posts;
