import React from "react";
import styled from "styled-components";


const Layout = ({title, scrollID, menu, children}: any) => {
    return (
        <Container>
            <DashboardContainer>
                <ListBlock>
                    <Toolbar><h1>{title}</h1></Toolbar>
                    <BlockContainer id={scrollID}>
                        {menu}
                    </BlockContainer>
                </ListBlock>
                {children}
            </DashboardContainer>
        </Container>
    )
}
const Container = styled('div') `
    margin-left: 316px;
    height: 100%;
    overflow: hidden;
`
const DashboardContainer = styled.div `
    display: flex;
    gap: 10px;
`
const Toolbar = styled.div `
    height:60px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    border-bottom: 1px solid #f0f1f3;
    & > h1 {
        font-feature-settings: "case";
    }
`
const BlockContainer = styled.div `
    padding: 10px;
    overflow: scroll;
    height: calc(100vh - 161px);
`
const ListBlock = styled.div `
    display: block;
    transition: none;
    background: #ffffff;
    border: 1px solid #f0f1f3;
    box-shadow: 0px 0px 20px 0px rgba(76, 87, 125, 0.04);
    border-radius: 6px;
    width: 400px;
`
export default Layout;