import { Token } from "../../markdown/src/Token";
export interface MDProps { token: Token; }
export interface MDComponent extends React.FC<MDProps> {}
