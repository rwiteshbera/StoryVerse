import React from "react";
import Images from "../../assets/images";
import { Route, Routes} from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";

const Accounts = () => {
  const AppTitle = "PixBy";
  return (
    <>
      <div className="flex flex-row items-center justify-center mt-[20vh] gap-x-10">
        <img
          src={Images.login}
          alt="Login Page Image"
          className="hidden md:block md:w-96 "
          draggable="false"
        />{" "}
        <div className="flex flex-col items-center justify-center gap-y-2">
         
            <Routes>
              <Route index element={<Login title={AppTitle} />} />
              <Route path="/signup" element={<Signup title={AppTitle} />} />
            </Routes>
        </div>
      </div>
    </>
  );
};

export default Accounts;
