import React from "react";
import { MDComponent } from "./Interface";


const List: MDComponent = function({ token, children }) {
    const options = token.options!.list!;
    if(options.isOrdered) {
    return <ol start={Number(options.bullet)}>{children}</ol>
    } else {
        return <ul>{children}</ul>
    }
}
export default List;