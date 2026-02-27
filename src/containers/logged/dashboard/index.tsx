import React, { useState, useEffect, Suspense } from "react"
import { useSelector } from "react-redux";
import { currentUserSelector } from "redux/selectors";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';
import CalendarView from "components/CalendarView";
import { isEmpty } from "lodash";
import EnumDropdown from "components/DropDowns/EnumDropdown";

const Dashobard = () => {
    const history = useHistory();
    const currentUser = useSelector(currentUserSelector);



    return (
        <Container>

        </Container>
    )
}
const Container = styled('div') `
    margin-left: 316px;
    height: 100%;
    
`

export default Dashobard;