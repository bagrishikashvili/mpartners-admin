import { Fragment, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import styled from "styled-components";
import { currentUserSelector } from "redux/selectors";
import { useTranslation } from "react-i18next";
import LogoutIcon from '@mui/icons-material/Logout';
import { deleteToken } from "lib/storage";
import { updateAxiosHeaders } from 'services/axios';
const Account = () => {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();
    const currentUser = useSelector(currentUserSelector);

    const logOut = () => {
        deleteToken();
        window.location.href = '/login';
    }

    const changeLanguage = async (item: any) => {
        updateAxiosHeaders(item);
        await localStorage.setItem('@lang', item);
        window.location.reload();
    }


    return (
        <Fragment>
            <AccountContainer>
                <AccountInfo>
                    <h1>{currentUser?.name}</h1>
                    <ChooseAccount>{currentUser.email}</ChooseAccount>
                </AccountInfo>
                <Sepr/>
                <LogoutIcon style={{color: '#607d8b', cursor: 'pointer'}} onClick={() => logOut()}/>
            </AccountContainer>
        </Fragment>
    )
}

const ChooseAccount = styled('div') `
    display: block;
    font-size: 12px;
    color: #000;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    margin-top: 2px;
`
const AccountContainer = styled('div') `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
`
const AccountInfo = styled('div') `
    & > h1 {
        font-feature-settings: "case";
        letter-spacing: -.3px;
        font-weight: bold;
        margin: 0px;
        padding: 0px;
        font-size: 14px;
    }
    & > p {
        display: block;
        font-size: 11px;
        color: rgb(117, 122, 152);
        font-feature-settings: "case";
    }
`
const Sepr = styled('div') `
    background-color: rgb(247, 247, 247);
    width: 1px;
    height: 50px;
    margin: 0px 5px;
`
const ChangeLang = styled.div `
    font-size: 13px;
    font-family: 'Plus Jakarta Sans', "BPG Arial Caps";
    color: #5d627a;
    cursor: pointer;
`
export default Account;