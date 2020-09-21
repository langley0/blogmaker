import React from "react";
import { MDComponent } from "./Interface";

const Image: MDComponent = function ({ token }) {
    return <img src={token.options!.href} alt={token.text}/>
}

export default Image;