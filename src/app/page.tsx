"use client";

import HomeSection1 from "./Home/Homesection1";
import HomeSection2 from "./Home/Homesection2";
import HomeSection3 from "./Home/Homesection3";
import HomeSection4 from "./Home/Homesection4";
import HomeSection5 from "./Home/Homesection5";
import HomeSection6 from "./Home/Homesection6";
import HomeSection7 from "./Home/Homesection7";
import HomeSection8 from "./Home/Homesection8";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <HomeSection4 />
      <HomeSection5 />
      <HomeSection6 />
      <HomeSection7 />
      <HomeSection8 />
      <ToastContainer />
    </div>
  );
}
