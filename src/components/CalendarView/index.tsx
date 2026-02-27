import { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import ShiftCard from "./ShiftCard";
import { find, filter, isEmpty } from 'lodash';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import 'moment/locale/ka';
moment.locale('ka');
moment.updateLocale('ka', {
    week: {
        dow: 0, // Monday is the first day of the week
    }
});

const CalendarView = ({ shifts, onClick, onChangeMonth, objects }: any) => {
    const today = moment();
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [selectedDays, setSelectedDays] = useState<any>([]);
    const [list, setList] = useState<any>([]);
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    useEffect(() => {
        if (!isEmpty(shifts)) {
            setList(shifts);
        }
    }, [shifts])

    useEffect(() => {
        setList([]);
        onChangeMonth(currentMonth.format('YYYY-MM-DD'))
    }, [currentMonth])

    const days = [];
    let day = startOfWeek;

    while (day <= endOfWeek) {
        days.push(day.clone());
        day = day.add(1, 'day');
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {

        weeks.push(days.slice(i, i + 7));
    }


    const getShiftsForDay = (day: any) => {
        return list.filter((shift: any) => moment(shift.start_date).isSame(day, 'day'));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => prevMonth.clone().subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => prevMonth.clone().add(1, "month"));
    };

    const chooseDay = (day: any) => {
        const formattedDay = moment(day);

        const fided = find(selectedDays, (x: Date | string) => moment(x).isSame(formattedDay, 'day'));

        if (fided) {
            const filtered = filter(selectedDays, (x: Date | string) => !moment(x).isSame(formattedDay, 'day'));
            setSelectedDays(filtered);
        } else {
            setSelectedDays([...selectedDays, formattedDay]);
        }
    };

    const transWeek = (week: any) => {
        if (week === 'Sun') {
            return 'ორშ'
        }
        else if (week === 'Mon') {
            return 'სამ'
        }
        else if (week === 'Tue') {
            return 'ოთხ'
        }
        else if (week === 'Wed') {
            return 'ხუთ'
        }
        else if (week === 'Thu') {
            return 'პარ'
        }
        else if (week === 'Fri') {
            return 'შაბ'
        }
        else if (week === 'Sat') {
            return 'კვი'
        }
        else return week;
    }


    return (
        <CalendarContainer>
            {/* <div style={{opacity: isEmpty(shifts) ? .1 : 1, padding: isEmpty(shifts) ? 5 : 0}}> */}
            <ActionControllers>
                <ShiftCountBlock>შიფტები: <span>{list?.length}</span></ShiftCountBlock>
                <ChangeMonthContainer>
                    {objects}
                    <PrevButtn onClick={handlePrevMonth}><KeyboardArrowLeftIcon /></PrevButtn>
                    <DisplayMonth>{moment(currentMonth).format('MMM, YYYY')}</DisplayMonth>
                    <NextButton onClick={handleNextMonth}><KeyboardArrowRightIcon /></NextButton>
                </ChangeMonthContainer>
            </ActionControllers>
            <ShortDaysContainer>
                {
                    moment.weekdaysShort().map(day => (
                        <ShortDay key={day}>{transWeek(day)}</ShortDay>
                    ))
                }
            </ShortDaysContainer>
            <CalBody>
                {
                    weeks.map((week, i) => (
                        <div key={i} style={{ display: 'flex', flex: 1 }}>
                            {
                                week.map((day) => {
                                    return (
                                        <DayItems key={day.format('DD-MM-YYYY')}>
                                            <span style={{ color: day.isSame(today, 'day') ? '#f04d28' : '' }}>
                                                {day.isSame(currentMonth, 'month') ? day.format('D') : null}
                                            </span>
                                            <ShiftsContainer>
                                                {getShiftsForDay(day).map((shift: any) => (
                                                    <ShiftCard
                                                        key={shift._id}
                                                        item={shift}
                                                        onRowClick={(e: any, onRow: any) => onClick(e, onRow)}
                                                    />
                                                ))}
                                            </ShiftsContainer>
                                        </DayItems>
                                    );
                                })
                            }
                        </div>
                    ))}
            </CalBody>
            {/* </div> */}
            {/* {isEmpty(shifts) && <OverlayLoading><CircularProgress size={40} /></OverlayLoading>} */}
        </CalendarContainer>
    )
}
const OverlayLoading = styled.div `
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
`
const CalendarContainer = styled.div`
    display: block;
    position: relative;
`
const ShortDaysContainer = styled.div`
    display: flex;
    border: 1px solid #b2bec3;
    border-radius: 5px 5px 0px 0px;
`
const ShortDay = styled.div`
    flex: 1;
    border-right: 1px solid #b2bec3;
    font-size: 14px;
    color: #2d3436;
    font-weight: 600;
    padding: 12px 10px;
    &:last-child {
        border: 0px;
    }
`
const CalBody = styled.div`
    display: block;
`
const DayItems = styled.div `
    flex: 1;
    background-color: #fff;
    border-bottom: 1px solid #b2bec3;
    border-left: 1px solid #b2bec3;
    border-right: 0px solid #b2bec3;
    font-size: 13px;
    padding: 8px 10px;
    height: 125px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    & > span {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -1px;
        color: #2c3e50;
    }
    &:last-child {
        border-right: 1px solid #b2bec3;
    }
    
`
const ItemChek = styled.div`
    position: absolute;
    top: 6px;
    right: 10px;
    color: #4CAF50;
`
const ShiftsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    flex-wrap: wrap;
`
const ActionControllers = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`
const ChangeMonthContainer = styled.div`
    display: flex;
`
const PrevButtn = styled.button`
    background-color: #1b5a93;
    border: 1px solid #1b5a93;
    outline: none;
    cursor: pointer;
    color: #fff;
    border-radius: 4px 0px 0px 4px;
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const DisplayMonth = styled.div`
    width: 110px;
    height: 37px;
    border-top: 1px solid #1b5a93;
    border-bottom: 1px solid #1b5a93;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
`
const NextButton = styled.button`
    background-color: #1b5a93;
    border: 1px solid #1b5a93;
    outline: none;
    cursor: pointer;
    color: #fff;
    border-radius: 0px 4px 4px 0px;
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const ShiftCountBlock = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    & > span {
        font-size: 18px;
        color: rgb(10, 63, 120);
    }
`
const CreateVacanyButton = styled.button`
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ef4044;
    border: 1px solid #ef4044;
    color: #fff;
    padding: 0px 16px;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 13px;
    outline: none;
    &:disabled {
        background-color: #ecf0f1;
        border: 1px solid #ecf0f1;
        color: #7f8c8d;
        cursor: not-allowed;
    }
`
export default CalendarView;