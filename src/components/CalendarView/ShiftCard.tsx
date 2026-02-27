import { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Tooltip } from "@mui/material";

const ShiftCard = ({ item, onRowClick }: any) => {

    const renderStatusbackgrounds = () => {
        const startTime = moment(item?.start_time);
        let endTime = moment(item?.end_time); 
        const isAllDone = item?.bookings?.every((element: any) => element.manager_approval === true);
        const currentTime = moment();

        if (currentTime.isSameOrAfter(endTime)) {
            if (isAllDone) {
                return '#a5b1c2';  // დასრულებულია და უკვე დამთავრებულია
            } else {
                return '#44bd32';  // დასრულდა, მაგრამ არ არის გაკეთებული ბოლომდე
            }
        } else if (currentTime.isBetween(startTime, endTime, null, '[]')) {
            return '#f7b731';  // შუალედშია, მიმდინარეობს
        } else if (currentTime.isBefore(startTime)) {
            return '#0097e6';  // ჯერ არ დადგა დრო
        }

    }


    return (
        <Tooltip title={item.role_name} placement="top" arrow>
        <CalendarContainer $bgColor={renderStatusbackgrounds()} onClick={(e) => onRowClick(e, item)}>
           <span>{moment(item.start_time).format('HH:mm')}</span><span>-</span><span>{moment(item.end_time).format('HH:mm')}</span>
           {item.users > 0 && <Counter><span>{item.users}</span></Counter>}
        </CalendarContainer>
        </Tooltip>
    )
}
const Counter = styled.div `
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    & > span {
        font-size: 7px;
        color: #fff;
    }
`
const CalendarContainer = styled.div<{ $bgColor: any }> `
    position: relative;
    display: block;
    text-align: left;
    background-color: ${(props) => { return props.$bgColor }};
    border-color: ${(props) => { return props.$bgColor }};
    padding: 3px 7px;
    border-radius: 4px;
    cursor: pointer;
    /* &:hover {
        background-color: #0283c6;
        .mnn {
            background-color: #fff;
        }
    } */
    & > h1 {
        margin: 0px;
        padding: 0px;
        font-size: 12px;
        color: #fff;
        font-weight: 500;
    }
    & > span {
        margin: 0px;
        padding: 0px;
        font-size: 11px;
        color: #fff;
        font-weight: 500;
        display: block;
        text-align: center;
        line-height: 11px;
    }
    &:last-child{
        margin-bottom: 0px;
    }
`

export default ShiftCard