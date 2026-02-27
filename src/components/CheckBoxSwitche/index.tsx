
import styled from 'styled-components';
interface PropsStyle {
    errorInput?: boolean;
    focusedInput?: boolean;
}

const CheckBoxSwitche = ({ onChnageData, value }: any) => {
    return (
        <InputContainer>
            <SwitcherContainer>
                <ConsiderItem onClick={() => onChnageData(true)}>
                    <ConsiderCircle isActive={value}/>
                    <span>კი</span>
                </ConsiderItem>
                <ConsiderItem onClick={() => onChnageData(false)}>
                    <ConsiderCircle isActive={!value}/>
                    <span>არა</span>
                </ConsiderItem>
            </SwitcherContainer>
        </InputContainer>
    );
}

///   
const InputContainer = styled.div<PropsStyle> `
    position: relative;
`
const SwitcherContainer = styled.div`
    width: 668px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
`
const ConsiderItem = styled.div `
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    transition: 250ms;
    cursor: pointer;
    & > span {
        font-size: 13px;
    }
`
const ConsiderCircle = styled.div<{ isActive: boolean }> `
    width: 23px;
    height: 23px;
    background-color: ${props => props.isActive ? '#fff' : '#eceef0'};
    border-radius: 50%;
    border: 8px solid ${props => props.isActive ? '#0b3f78' : '#eceef0'};
    transition: 250ms;
`
export default CheckBoxSwitche;