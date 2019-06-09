import React from "react";
import NavBar from "./NavBar/NavBar";

const layout = props => {
  return (
    <div>
      <NavBar />
      <main>{props.children}</main>
    </div>
  );
};

export default layout;
