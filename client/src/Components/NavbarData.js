import { BsHammer, BsHouseDoorFill } from "react-icons/bs";
import { BsFolder } from "react-icons/bs";
import { BsGear } from "react-icons/bs";
import { RxExit } from "react-icons/rx";


import React from "react";

export const NavbarData = [
    {
        title: "My Constructors",
        icon: <BsFolder/>,
        link: "/ConstructorManager"
    },
    {
        title: "Constructor Builder",
        icon: <BsHammer/>,
        link: "/ConstructorBuilder"
    },
    {
        title: "Log Out",
        icon: <RxExit />,
        link: "/"
    }
]

