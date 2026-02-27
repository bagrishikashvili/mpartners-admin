import { useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { AuthLayoutRoute, MainLayoutRoute, UniversalLayoutRoute } from './layout';
import { getCurrentUser } from "services";
import { useDispatch } from "react-redux";
import { setCurrentUser, setToken } from "redux/authSlice";

import {
  Login
} from "./guest";

import {
  Dashboard,
  MenuControl,
  MenuControlCreate,
  MenuControlEdit,
  ContactSettings,
  DynamicMenuPage,
  Recomendation,
  NewsList,
  NewsCreate,
  NewsEdit
} from "./logged"

const Routes = () => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      getCurrentUser().then( async res => {
        dispatch(setCurrentUser(res.data));
      })
    }
  }, [dispatch, token]);



  return (
    <BrowserRouter>
      <Switch>

        <AuthLayoutRoute path="/login" component={Login} />
      
        <Switch>
            <MainLayoutRoute path={["/", "/dashboard"]} exact component={Dashboard} />
            <MainLayoutRoute path={["/menu-control"]} exact component={MenuControl} />
            <MainLayoutRoute path={["/menu-control/create"]} exact component={MenuControlCreate} />
            <MainLayoutRoute path={["/menu-control/:id"]} exact component={MenuControlEdit} />
            <MainLayoutRoute path={["/contact-settings"]} exact component={ContactSettings} />
            <MainLayoutRoute path={["/pages/services/:id"]} exact component={DynamicMenuPage} />
            <MainLayoutRoute path={["/pages/:id"]} exact component={DynamicMenuPage} />
            <MainLayoutRoute path={["/recomendation"]} exact component={Recomendation} />
            <MainLayoutRoute path={["/news"]} exact component={NewsList} />
            <MainLayoutRoute path={["/news/create"]} exact component={NewsCreate} />
            <MainLayoutRoute path={["/news/:id"]} exact component={NewsEdit} />

            <Redirect to="/" />
        </Switch>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
