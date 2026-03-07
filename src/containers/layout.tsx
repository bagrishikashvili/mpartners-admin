import styled from "styled-components";
import { isEmpty } from "lodash";
import { Route, Redirect } from 'react-router-dom';
import { currentUserSelector } from "redux/selectors";
import { useSelector } from "react-redux";
import { getToken } from "lib/storage";
import { ReactComponent as FlexupLogo } from 'assets/svg/logo-small.svg';
import AuthHeader from "partials/headers/authHeader";
import NavigationMenu from "partials/NavigationMenu";
import { CircularProgress } from "@mui/material";

const MainLayout = ({ children }: any) => {
  const currentUser = useSelector(currentUserSelector);

  return (
    <Wrapper>
      {
        !isEmpty(currentUser) ? 
          <>
            <AuthHeader/>
            <ContentContainer>
              <NavigationMenu/>
              <BodyContainer>
                {children}
              </BodyContainer>
            </ContentContainer>
          </>
        : 
        <LoadingScreenContainer>
          <CircularProgress/>
        </LoadingScreenContainer>}
    </Wrapper>
  );
};

const MainLayoutRoute = ({ component: Component, ...rest }: any) => {
  const token = getToken();
  return (
    <Route {...rest} render={(props) =>
        token ?
          <MainLayout>
            <Component {...props} />
          </MainLayout>
          : <Redirect to="/login" />
      }
    />
  );
};

const AuthLayout = ({ children }: any) => {
  return (
    <Wrapper>
      <ContentContainer>{children}</ContentContainer>
    </Wrapper>
  );
};

const AuthLayoutRoute = ({ component: Component, ...rest }: any) => {
  const token = getToken();
  return (
    <Route {...rest} render={props => (
      !token ? <AuthLayout>
        <Component {...props} />
      </AuthLayout> : <Redirect to={'/'} />
    )} />
  )
};

const UniversalLayoutRoute = ({ component: Component, ...rest }: any) => {

  return (
    <Route {...rest} render={props => (
      <AuthLayout>
        <Component {...props} />
      </AuthLayout>
    )} />
  )
};

export { AuthLayoutRoute, MainLayoutRoute, UniversalLayoutRoute };

const LoadingScreenContainer = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   flex: 1;
   background-color: #fff;
`;

const FLexupText = styled.h1 `
    color: #fff;
    text-align: center;
    margin-top: 10px;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: auto;
  overflow: overlay;
  gap: 10px;
  & > * {
    flex: 1
  }
`;

const BodyContainer = styled.div `
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  overflow: overlay;
  padding: 16px 16px 16px 6px;
  & > * {
    flex: 1
  }
`