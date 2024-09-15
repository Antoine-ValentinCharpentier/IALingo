import React from "react";

import TemplatePage from "./TemplatePage";
import { ScreenEnum } from "../components/Navbar";

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = (): JSX.Element => {
  
  return (
    <TemplatePage screen={ScreenEnum.HomePage}>
      HomePage
    </TemplatePage>
  );
};

export default HomePage;
