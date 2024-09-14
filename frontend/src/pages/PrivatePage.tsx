import React, { Suspense, useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import AuthContext, {AuthContextType} from '../context/AuthContext'; 
import Loading from '../components/Loading';

type PrivatePageProps = {
  element: ReactNode;
};

const PrivatePage: React.FC<PrivatePageProps> = ({ element }): JSX.Element => {
  const { user } = useContext<AuthContextType>(AuthContext);

  if (user) {
    return <Suspense fallback={<Loading />}>{element}</Suspense>;
  }

  return <Navigate to="/login" />;
};

export default PrivatePage;
