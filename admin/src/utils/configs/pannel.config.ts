// import logo from "../lib/images/logo.svg"
import logo from "/logo.svg";

export const pannelData = {
    name: "Lodgify Admin",
    logo: logo,
}

export function setTitle() {
    document.title = pannelData.name;
}