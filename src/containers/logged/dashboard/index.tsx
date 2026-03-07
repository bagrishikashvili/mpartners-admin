import { useSelector } from "react-redux";
import { currentUserSelector } from "redux/selectors";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';
import MainConatiner from "partials/Container";
const Dashobard = () => {
    const history = useHistory();
    const currentUser = useSelector(currentUserSelector);



    return (
        <MainConatiner>
            <FormBody>

            </FormBody>
        </MainConatiner>
    )
}
const Container = styled('div') `
    margin-left: 316px;
    height: 100%;
    
`

const FormBody = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  height: calc(100vh - 130px);
`;
export default Dashobard;