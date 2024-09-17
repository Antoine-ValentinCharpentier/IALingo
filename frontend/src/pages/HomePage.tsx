import React from "react";

import TemplatePage from "./TemplatePage";
import { ScreenEnum } from "../components/Navbar";
import Title from "../components/Title";

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = (): JSX.Element => {
  
  return (
    <TemplatePage screen={ScreenEnum.HomePage}>
      <Title text="HomePage"/>
    </TemplatePage>
  );
};

export default HomePage;
