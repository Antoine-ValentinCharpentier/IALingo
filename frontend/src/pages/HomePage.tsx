import React, { useContext } from 'react'; 
import AuthContext, { AuthContextType } from '../context/AuthContext';

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = () : JSX.Element => {
  const { handleLogout } = useContext<AuthContextType>(AuthContext);
  return <>
    HomePage
    <p onClick={handleLogout}>logout</p>
  </>
};

export default HomePage;
