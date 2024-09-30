import React from "react";

import TemplatePage from "../layout/TemplatePage";
import { ScreenEnum } from "../components/ui/Navbar";
import Title from "../components/ui/Title";

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = (): JSX.Element => {
  
  return (
    <TemplatePage screen={ScreenEnum.HomePage}>
      <Title text="HomePage"/>
    </TemplatePage>
  );
};

export default HomePage;
