import React from "react";
import { MDComponent } from "./Interface";

const heading: MDComponent = ({ children, token }) => {
    return React.createElement("h" + token.options!.depth, { children });
}

export default heading;