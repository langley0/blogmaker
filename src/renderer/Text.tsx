import React from "react";
import { MDComponent } from "./Interface";

const text: MDComponent = ({ token }) => {
    return <>{'"' + token.text + '"'}</>;
}

export default text;