import { Fragment, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import styled from "styled-components";
import { currentUserSelector, globalErrorSelector } from "redux/selectors";
import { useTranslation } from "react-i18next";
import { ReactComponent as FlexupLogo } from 'assets/svg/logo-blue.svg';
import Account from './accout';

const AuthHeader = () => {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();
    const currentUser = useSelector(currentUserSelector);
    return (
        <Fragment>
            <Container>
                <NavLeftSideContainer>
                    <Link to='/dashboard'>
                        <div>
                            <h1>სამართავი პანელი</h1>
                        </div>
                    </Link>
                </NavLeftSideContainer>
                <NavRightSideContainer>
                    <AccountMenuContainer>
                        <Account/>
                    </AccountMenuContainer>
                </NavRightSideContainer>
            </Container>
        </Fragment>
    )
}
const Container = styled('div')(({ theme }) => ({
    padding: "10px 20px",
    height: 67,
    background: "var(--header-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 9,
    flexShrink: 0,
    borderBottom: '1px solid #f6f6f6',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
}));
const NavLeftSideContainer = styled.div `
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    & > a {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        & > div {
            & > h1 {
                font-size: 18px;
                font-weight: 600;
                margin-top: 2px;
                color: #1E2932;
            }
            & > p {
                margin-top: 2px;
                display: block;
                font-size: 11px;
                color: rgb(117, 122, 152);
            }
        }
    }
`
const NavRightSideContainer = styled('div')(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    ".settings": {
      marginRight: 12,
      width: 40,
      height: 40,
      "&:hover": { "& path:first-child": { fill: "#215549" } },
    },
    ".settings-active": { "& path:first-child": { fill: "#215549" } }
}));
const AccountMenuContainer = styled('div') `
    
`;

export default AuthHeader;