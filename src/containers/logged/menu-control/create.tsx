import React, { useState, useEffect, Suspense } from "react"
import { useSelector } from "react-redux";
import { currentUserSelector } from "redux/selectors";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import MainConatiner from "partials/Container";
import { Box, Button, Switch } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { MultiLangInput } from "components/MutliLanguageInput";
import useQuery from "hooks/useQueryCustom";
import UniversalInput from "components/Input/UniversalInput";
import useMutationCustom from 'hooks/useMutationCustom';

const languages = [
  { code: "ka", label: "ქართული", required: true },
  { code: "en", label: "ინგლისური" },
  { code: "ru", label: "რუსული" },
  { code: "ar", label: "არაბული" },
  { code: "zh", label: "ჩინური" },
];
const MenuControlCreate = () => {
    const history = useHistory();
    const currentUser = useSelector(currentUserSelector);
    const { control, handleSubmit, register, setValue } = useForm<any>({
        defaultValues: {
            name: { ka: "", en: "", ru: "", zh: "", ar: "" },
            sort_order: 0,
            is_active: true,
        },
        mode: "onBlur",
    });

    const { data: item = { count: 0 }, isLoading } = useQuery<any>(["get_web_menus_count"], {
        endpoint: `/menus/get-positions`,
        options: { method: "get" },
    }, { enabled: true });

    const createStore  = useMutationCustom<{}, { errors: [{ field: string, message: string, }] }, any>(
        ["create_web_menu"], {
        endpoint: `/menus`,
        options: { method: "post" },
    }, {
        onSuccess: () => {
            history.push('/menu-control');
        },
        onError: (err: any) => {
       
        }
    });

    const onSubmit = (data: any) => {
        createStore.mutate(data)
    };

    useEffect(() => {
        setValue("sort_order", item.count+1);
    }, [item]);

    return (
        <MainConatiner 
            title="მენიუს დამატება" 
            button={<Button variant="text" size="small" className="caps" onClick={() => history.push('/menu-control')}>უკან დაბრუნება</Button>}  
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <FormBody>
                    <MultiLangInput
                        control={control}
                        name="name"
                        label="მენიუს დასახელება"
                        languages={languages}
                        defaultLang="ka"
                        placeholder={(lang) => (lang === "ka" ? "მაგ: მთავარი" : "Type…")}
                        multiline={false}
                    />
                    <div style={{marginTop: 20}}>
                        <UniversalInput
                            label="პოზიცია"
                            size='small'
                            {...register("sort_order", { required: true })}
                        />
                    </div>
                    <div style={{marginTop: 20}}>
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10}}>
                                    <Switch checked={value} onChange={onChange} />
                                    <span>აქტიურია</span>
                                </div>
                            )}
                        />
                    </div>
                </FormBody>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <LoadingButton
                        sx={{ marginTop: .7, fontSize: 14, padding: 2, width: 150 }}
                        variant='contained'
                        type="submit"
                        size="small"
                        >
                        შენახვა
                    </LoadingButton>
                </div>
            </Box>
        </MainConatiner>
    )
}
const FormBody = styled.div `
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
`

export default MenuControlCreate;