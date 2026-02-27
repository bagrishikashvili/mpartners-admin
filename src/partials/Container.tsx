import React, { useState, useEffect, Suspense } from "react"
import styled from "styled-components";

const MainConatiner = (props: any) => {
    return (
        <Container>
             <DashboardContainer>
                <HeaderContainer>
                    <TitleBar><span>{props.title}</span></TitleBar>
                    {props.button}
                </HeaderContainer>
                {props.children}
            </DashboardContainer>
        </Container>
    )
}
const Container = styled('div') `
    margin-left: 265px;
    height: 100%;
`
const DashboardContainer = styled.div `
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-bottom: 30px;
`
const HeaderContainer = styled.div `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`
const TitleBar = styled.div `
    text-align: left;
    color: rgb(30, 41, 50);
    font-weight: 400;
    font-size: 20px;
    font-family: "Plus Jakarta Sans", "BPG Arial Caps";
    flex: 1;
    & > span {
        font-family: "Plus Jakarta Sans", "BPG Arial";
        font-size: 14px;
        color: rgb(76, 104, 126);
    }
`
export default MainConatiner;