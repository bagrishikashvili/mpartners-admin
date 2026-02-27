import React, { Fragment, useState, useRef, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import styled from "styled-components";
import { forEach, isEmpty, map } from 'lodash';
import "react-multi-date-picker/styles/layouts/mobile.css"
import moment from "moment";
import { useTranslation } from "react-i18next"
interface PropsStyle {
    focusedInput: boolean;
}
const CalendarUi = ({onChange, single, dates, style, plholder}: any) => {
    const { t } = useTranslation();
    const datePickerRef: any = useRef()
    const [date, setDate] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState<any>([]);
    const [focused, setFocused] = useState(false);

    const weekDays = [t('Months.WEEK.text1'), t('Months.WEEK.text2'), t('Months.WEEK.text3'), t('Months.WEEK.text4'), t('Months.WEEK.text5'), t('Months.WEEK.text6'), t('Months.WEEK.text7')];
    const months = [
        t('Months.text1'),
        t('Months.text2'),
        t('Months.text3'),
        t('Months.text4'),
        t('Months.text5'),
        t('Months.text6'),
        t('Months.text7'),
        t('Months.text8'),
        t('Months.text9'),
        t('Months.text10'),
        t('Months.text11'),
        t('Months.text12'),
    ];

    useEffect(() => {
        onChange(selectedDates);
       if (!isEmpty(selectedDates)) {
            setFocused(true)
       }
       else {
            setFocused(false);
       }
    },[selectedDates]);

    const fullMonth = moment(new Date()).add(4, 'day').toDate();

    return (
        <CalendarContainer>
            <CalendarInput
             style={{...style, height: 40}}
                onClick={() => datePickerRef.current.openCalendar()}
            >
                {!isEmpty(selectedDates) && <InputValue> {
                    selectedDates.map((x: any, index: number) => (
                        <span key={x.short_date + '_' + index}>
                        {x.short_date}
                        </span>
                    )).reduce((prev: any, curr: any) => [prev, ', ', curr])}
                    </InputValue>
                }
                {isEmpty(selectedDates) && <LablelText style={{top: style ? 10 : 12}} focusedInput={focused}>{plholder ? plholder : ''}</LablelText>}
            </CalendarInput>
            <DatePicker
                ref={datePickerRef}
                weekDays={weekDays}
                months={months}
                disableMonthPicker={true}
                disableYearPicker={true}
                onChange={(array: any) => {
                    if (single) {
                        const obj = {
                            short_date: (moment(array.format()).format('MMM, DD')),
                            start_date: (moment(array.format()).format('YYYY-MM-DD')),
                            start_time: null,
                            end_time: null,
                            workers: 0,
                            amount: 0
                        }
                        setSelectedDates([obj]);
                    }
                    else {
                        let dates: any = [];
                        forEach(array, (x) => {
                            const obj = {
                                short_date: (moment(x.format()).format('MMM, DD')),
                                start_date: (moment(x.format()).format('YYYY-MM-DD')),
                                start_time: null,
                                end_time: null,
                                workers: 0,
                                amount: 0
                            }

                            dates.push(obj);
                        })
                        setSelectedDates(dates);
                    }
                    
                }}
                format="MMM DD YYYY"
                inputMode="false"
                minDate={new Date()}
                maxDate={single ? fullMonth : ''}
                className="rmdp-mobile"
                render={<Fragment></Fragment>}
                mobileLabels={{
                    OK: t('text47'),
                    CANCEL: t('text48'),
                }}
            />
        </CalendarContainer>
    )
}
const InputValue = styled.div`
    font-size: 13px;
    color: #2f3237;
`
const CalendarContainer = styled.div `
    display: block;
    .rmdp-week-day {
        color: #757A98;
        cursor: default;
        font-size: 12px;
    }
    .rmdp-mobile .rmdp-day span {
        font-size: 12px;
    }

    .rmdp-day.rmdp-today span {
        background-color: #fff;
        color: #f3742d;
    }

    .rmdp-day:not(.rmdp-disabled,.rmdp-day-hidden) span:hover {
        background-color: #DBEDF0;
        color: #1E2932;
    }

    .rmdp-day.rmdp-selected span:not(.highlight) {
        background-color: #f3742d;
        box-shadow: 0 0 0px #8798ad;
        color: #fff;
    }

    .rmdp-header-values {
        margin: auto;
        font-size: 13px;
        color: #1E2932;
    }

    .rmdp-mobile .rmdp-arrow-container {
        margin: 0 3px;
        height: 16px;
        width: 16px;
    }
    .rmdp-arrow-container:hover {
        background-color: #fff;
        box-shadow: 0 0 0px #000;
    }

    .rmdp-arrow-container.disabled .rmdp-arrow, .rmdp-arrow-container.disabled:hover .rmdp-arrow {
        border: solid gray;
        border-width: 0 2px 2px 0;
        color: #000;
    }


    .rmdp-arrow-container:hover .rmdp-arrow {
        border: solid #1E2932;
        border-width: 0 2px 2px 0;
    }

    .rmdp-mobile .rmdp-action-button {
        background-color: #e2e2e2;
        border-radius: 4px;
        margin: 15px 3px;
        margin-top: 0px;
        font-size: 13px;
        border: 0px;  
        color: #1E2932;  
    }
`

const CalendarInput = styled.div`
    width: 100%;
    height: 3px;
    padding: 0px 13px;
    outline: none;
    border: 1px solid #D6D6D6;
    font-size: 14px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 4px;
    cursor: text;
    &:hover, &:focus {
        border: 1px solid rgba(243, 116, 45, 1);
    }
`
const LablelText = styled.div<PropsStyle>`
    position: absolute;
    pointer-events: none;
    font-size: 13px;
    color: ${props => !props.focusedInput ? '#949b9e' : '#000'};
`
export default CalendarUi;