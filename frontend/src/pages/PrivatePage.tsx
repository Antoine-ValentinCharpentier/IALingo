import React, { Suspense, useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import AuthContext, {AuthContextType} from '../context/AuthContext'; 
import Loading from '../components/Loading';

type PrivatePageProps = {
  element: ReactNode;
};

const PrivatePage: React.FC<PrivatePageProps> = ({ element }): JSX.Element => {
  const { jwt } = useContext<AuthContextType>(AuthContext);

  if (jwt) {
    return <Suspense fallback={<Loading />}>{element}</Suspense>;
  }

  return <Navigate to="/login" />;
};

export default PrivatePage;
