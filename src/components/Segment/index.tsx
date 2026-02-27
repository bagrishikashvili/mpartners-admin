import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
const Segment = ({onChnage}: any) => {
    const { t } = useTranslation();
    const [active, setActive] = useState('full');

    const onChnageSegment = (type: string) => {
        if (active !== type) {
            setActive(type)
            onChnage(type)
        }
    }


    return (
        <Fragment>
            <SegmentContainer>
                <SegmentButton onClick={() => onChnageSegment('full')} $isActive={active === 'full' ? true : false}>{t('text4')}</SegmentButton>
                <SegmentButton onClick={() => onChnageSegment('day')} $isActive={active === 'day' ? true : false}>{t('text5')}</SegmentButton>
                <SegmentButton onClick={() => onChnageSegment('seasonal')} $isActive={active === 'seasonal' ? true : false}>{t('text6')}</SegmentButton>
            </SegmentContainer>
        </Fragment>
    )
}
const SegmentContainer = styled.div `
    box-sizing: border-box;
    margin: 0;
    padding: 2px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 13px;
    line-height: 1.5714285714285714;
    display: flex;
    gap: 10px;
    background-color: #f5f5f5;
    border-radius: 6px;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
`
const SegmentButton = styled.div<{ $isActive?: boolean }> `
    position: relative;
    text-align: center;
    padding: 3px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    border-radius: 4px;
    background-color: ${props => props.$isActive ? '#ffffff' : 'none'};
    box-shadow: ${props => props.$isActive ? "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)" : 'none'};
    color: rgba(0, 0, 0, 0.88);
`
export default Segment;