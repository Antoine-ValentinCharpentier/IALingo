import React, { memo, Suspense, ReactNode } from "react";
import Loading from "../components/Loading";

type PublicPageProps = {
  element: ReactNode;
};

const PublicPage: React.FC<PublicPageProps> = memo(
  ({ element }): JSX.Element => {
    return <Suspense fallback={<Loading />}>{element}</Suspense>;
  }
);

export default PublicPage;
