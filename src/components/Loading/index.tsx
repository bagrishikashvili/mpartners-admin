
import styled from 'styled-components';
import MainConatiner from 'partials/Container';
import { CircularProgress } from '@mui/material';
const LoadingScreen = () => {



    return (
        <MainConatiner>
            <LoadingContainer>
                <CircularProgress />
                <LoadingText>იტვირთება...</LoadingText>
            </LoadingContainer>
        </MainConatiner>
    )
}
const LoadingContainer = styled.div `
    background-color: #fff;
    width: 100%;
    height: calc(100vh - 130px);
    display: flex;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
const LoadingText = styled.div `
    margin-top: 10px;
`
export default LoadingScreen;