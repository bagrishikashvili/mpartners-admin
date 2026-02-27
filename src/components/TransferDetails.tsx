import React, { Fragment } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';

const TransferDetails = () => {
    const { t } = useTranslation();

    return (
        <TransferRoot>
            <Alert style={{marginBottom: 10}} severity="warning">{t('text159')}</Alert>
            <TranferContainer>
                <HeaderBlock>{t('text66')}</HeaderBlock>
                <ContentBlock>
                    <BlockRow>
                        <span>{t('text67')}</span>
                        <p>{t('text68')}</p>
                    </BlockRow>
                    <BlockRow>
                        <span>{t('text69')}</span>
                        <p>BAGAGE22</p>
                    </BlockRow>
                    <BlockRow>
                        <span>{t('text70')}</span>
                        <p>{t('text71')}</p>
                    </BlockRow>
                    <BlockRow>
                        <span>{t('text72')}</span>
                        <p>GE65BG0000000540140454</p>
                    </BlockRow>
                    <BlockRow>
                        <span>{t('text73')}</span>
                        <p>{t('text74')}</p>
                    </BlockRow>
                </ContentBlock>
                <RuleContainer>
                    {t('text75')} <Link style={{color: 'blue', textDecoration: 'underline'}} to="https://www.facebook.com/FlexUpApp" target="_blank">{t('text76')}</Link> {t('text77')} <b>invoice@flexup.ge</b>
                </RuleContainer>
                <PhoneContainer>
                    {t('text78')} <b>(+995) 574 078 752</b>
                </PhoneContainer>
            </TranferContainer>
        </TransferRoot>
    )
}
const TransferRoot = styled.div `
    & > .ant-alert-with-description {
        align-items: flex-start;
        padding: 9px 9px;
    }
`
const PhoneContainer = styled.div `
    margin-top: 20px;
    margin-bottom: 20px;
    color: #000;
`
const RuleContainer = styled.div `
    margin-top: 20px;
    margin-bottom: 20px;
    color: #ee3942;
    font-size: 13px;
`
const ContentBlock = styled.div `
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: 20px;
`
const BlockRow = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span {
        font-size: 13px;
    }
    & > p {
        font-size: 13px;
    }
`
const HeaderBlock = styled.div `
    font-size: 14px;
    line-height: 16px;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 16px;
`
const TranferContainer = styled.div `
    background-color: #fff;
    border-top: 2px solid #ee3942;
    padding: 16px;
    font-size: 13px;
    border-radius: 8px;
    box-shadow: 0px 4px 5px -1px rgb(0 0 0 / 7%);
`
export default TransferDetails;