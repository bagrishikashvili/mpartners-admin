import React, {useEffect, useState} from "react";
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import styled from "styled-components";
import UniversalInput from "components/Input/UniversalInput";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { ReactComponent as FlexupLogo } from 'assets/svg/logo.svg';
import { LoginService, getCurrentUser} from "services";
import { useDispatch } from "react-redux";
import { setToken, setCurrentUser } from "redux/authSlice";
import { saveStorageObject } from 'lib/storage'
import { setAuthorizationToken } from 'services/mainAxios';
import toast from 'react-hot-toast';
const Login = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const watchEmail = watch('email', false);
    const watchPassword = watch('password', false)
    const [isPass, setIsPass] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = (data: any) => {
        setIsLoading(true);
        LoginService(data?.email, data?.password).then((res) => {
            saveStorageObject('token', res.data.token);
            saveStorageObject('token_type', res.data.token_type);
            setAuthorizationToken(res.data.token);
            dispatch(setToken(res.data.token));

            getCurrentUser().then( async (res: any) => {
                dispatch(setCurrentUser(res.data));
            })
            setTimeout(() => {
                setIsLoading(false);
                history.push('/dashboard');
            }, 100)
        }).catch((err: any) => {
            toast.error(t('Signin.invalidate'), {
                position: 'top-center',
            });
            setIsLoading(false);
        })
    }

    return (
        <LoginContainer>
            <RightContainer>
                <FormText>
                    {t('Signin.SigninText')}
                    <p>{t('Signin.fill_values')}</p>
                </FormText>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <UniversalInput
                        size='medium'
                        placeholder={t('Signin.email')}
                        errorText={errors?.email?.message}
                        {...register("email", { 
                            required: "", 
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    <UniversalInput
                        size='medium'
                        placeholder={t('Signin.password')}
                        style={{marginTop: 15}}
                        withEyeAdornment={true}
                        onEyeAdornmentClick={() => setIsPass(!isPass)}
                        {...register("password", { required: true })}
                        type={isPass ? 'password' : 'text'}
                    />
                    <LoadingButton
                        loading={isLoading}
                        sx={{ marginTop: 2.5, fontSize: 14, padding: 2 }}
                        fullWidth
                        variant='contained'
                        type="submit"
                        >
                        {t('Signin.enter')}
                    </LoadingButton>
                </form>
            </RightContainer>
        </LoginContainer>
    )
}
const FlexBlock = styled.div `
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    & > p {
        padding: 0px;
        margin: 0px;
        margin-top: 2px;
        display: block;
        font-size: 13px;
        color: #757A98;
    }
`
const FormText = styled.div `
    font-size: 20px;
    color: #1E2932;
    font-weight: 600;
    margin-bottom: 20px;
    font-feature-settings: "case";
    & > p {
        color: #757A98;
        font-size: 13px;
        font-weight: 300;
        margin-top: 10px;
        font-feature-settings: "none";
    }
`
const FormTopContainer = styled.div `
    text-align: center;
    margin-top: 0px;
    margin-bottom: 30px;
    & > h2 {
        margin-top: 10px;
        font-size: 35px;
        color: #fff;
        font-weight: 600;
        font-feature-settings: "case";
    }
`
const LoginContainer = styled.div `
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    @media (max-width: 768px) { 
        padding: 16px;
    }
`
const RightContainer = styled.div `
    background-color: #fff;
    border-radius: 10px;
    padding: 26px;
    min-width: 480px;
    @media (max-width: 768px) { 
        width: 100%;
        min-width: auto;
    }
`
const ForgotPasswordLink = styled(Link)`
  color: #F3742D;
  text-decoration: underline;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

const CreateAccountLink = styled(Link)`
  color: #F3742D;
  text-decoration: underline;
  font-size: 13px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;
const CubicBox = styled.div `
    width: 276px;
    height: 233px;
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: #D9D9D9;
    opacity: 10%;
    border-bottom-left-radius: 20px;
    z-index: 2;
    @media (max-width: 768px) { 
        display: none;
    }
`
const CubicBoxTwo = styled.div `
    width: 276px;
    height: 233px;
    position: absolute;
    top: 120px;
    right: -100px;
    background-color: #D9D9D9;
    opacity: .6;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
    z-index: 1;
    opacity: 10%;
    @media (max-width: 768px) { 
        display: none;
    }
`
export default Login;