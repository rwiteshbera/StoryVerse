import React, { useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSWRConfig } from "swr";

const CreateNewPostModal = ({ onClose }) => {
  const { mutate } = useSWRConfig();
  const [imageFile, setImageFile] = useState();
  const [captionText, setCaptionText] = useState();

  const maximumCaptionCharacters = 200;

  const fileInputRef = useRef(null);

  // Input image handler
  const handleChoose = () => {
    fileInputRef.current.click();
  };

  // Set the state of the image file
  const captureFileChange = (e) => {
    e.preventDefault();
    setImageFile(e.target.files[0]);
  };

  // Drag and Drop image handling
  const onDropImageHandler = (e) => {
    e.preventDefault();
    setImageFile(e.dataTransfer.files[0]);
  };

  // Set the state of the caption
  const captureCaptionChange = (e) => {
    e.preventDefault();
    setCaptionText(e.target.value);
  };

  // Close modal handler
  const modalCloseHandler = () => {
    setImageFile();
    setCaptionText();
    fileInputRef.current.value = "";
    onClose();
  };

  // Create New Post // API Call
  const createNewPostHandler = async () => {
    const axiosConfig = {
      headers: {
        "Content-type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const imageData = new FormData();
    imageData.append("file", imageFile);
    imageData.append("caption", captionText);

    try {
      const { data } = await axios.post("/v1/upload", imageData, axiosConfig);
      mutate("/v1/user/posts");
    } catch (error) {
      toast.error(error.data?.messages)
    } finally {
      modalCloseHandler();
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
      />
      <div className="bg-black absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center rounded-2xl py-2">
        <div className="">
          <p className="text-2xl">Create New Post</p>
          <AiOutlineCloseCircle
            className="absolute top-1 right-1 hover:cursor-pointer"
            size={24}
            onClick={() => modalCloseHandler()}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/jpeg, image/jpg, image/png"
            onInput={(e) => captureFileChange(e)}
            onDragEnter={(e) => captureFileChange(e)}
            onDragEndCapture={(e) => captureFileChange(e)}
            onDrop={(e) => captureCaptionChange(e)}
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              className="lg:w-[60vh] lg:h-[60vh] object-fill"
            />
          )}

          {/* If no image is selected, add a blank div  */}
          {!imageFile && (
            <div
              className="lg:w-[60vh] lg:h-[60vh] w-[70vh] h-[70vh] flex items-center justify-center font-semibold"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                onDropImageHandler(e);
              }}
            >
              <p>Drag Photos</p>
            </div>
          )}

          {imageFile && (
            <textarea
              className="resize-none w-full p-2 bg-black outline-none text-sm"
              placeholder="Caption..."
              maxLength={maximumCaptionCharacters}
              onChange={(e) => captureCaptionChange(e)}
            />
          )}
          {!imageFile && (
            <button
              className="bg-second mt-1 px-3 rounded-3xl"
              onClick={() => handleChoose()}
            >
              Choose
            </button>
          )}
          {imageFile && (
            <button
              className="bg-second mt-1 px-3 rounded-3xl"
              onClick={() => createNewPostHandler()}
            >
              Upload
            </button>
          )}
        </div>
        {/* <span className="absolute bottom-2 right-2 text-xs">{maximumCaptionCharacters - captionText.length} characters left</span> */}
        {!captionText && imageFile && (
          <span className="absolute bottom-2 right-2 text-xs">
            {maximumCaptionCharacters} characters left
          </span>
        )}
        {captionText && (
          <span className="absolute bottom-2 right-2 text-xs">
            {maximumCaptionCharacters - captionText.length} characters left
          </span>
        )}
      </div>
    </>
  );
};

export default CreateNewPostModal;
