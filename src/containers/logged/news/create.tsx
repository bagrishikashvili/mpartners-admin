import { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Box, Button, Switch } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Controller, useForm } from 'react-hook-form';
import MainConatiner from 'partials/Container';
import UniversalInput from 'components/Input/UniversalInput';
import { MultiLangInput } from 'components/MutliLanguageInput';
import useMutationCustom from 'hooks/useMutationCustom';
import { MultiLangTiptap } from 'components/MultiLangTiptap';

type LocalizedText = {
    ka: string;
    en: string;
    ru: string;
    zh: string;
    ar: string;
};

type FormValues = {
    title: LocalizedText;
    content: LocalizedText;
    sort_order: number;
    is_active: boolean;
};

const languages = [
    { code: 'ka', label: 'ქართული', required: true },
    { code: 'en', label: 'ინგლისური' },
    { code: 'ru', label: 'რუსული' },
    { code: 'ar', label: 'არაბული' },
    { code: 'zh', label: 'ჩინური' },
];

const emptyLocalized = (): LocalizedText => ({
    ka: '',
    en: '',
    ru: '',
    zh: '',
    ar: '',
});

const NewsCreate = () => {
    const history = useHistory();
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { control, handleSubmit, register } = useForm<FormValues>({
        defaultValues: {
            title: emptyLocalized(),
            content: emptyLocalized(),
            sort_order: 0,
            is_active: true,
        },
        mode: 'onBlur',
    });

    const createStore = useMutationCustom<any, any, FormData>(
        ['create_web_news'],
        {
            endpoint: '/news',
            options: { method: 'post' },
        },
        {
            onSuccess: () => {
                history.push('/news');
            },
        }
    );

    const onSubmit = (data: FormValues) => {
        const payload = new FormData();
        payload.append('title', JSON.stringify(data.title));
        payload.append('content', JSON.stringify(data.content));
        payload.append('sort_order', String(data.sort_order ?? 0));
        payload.append('is_active', data.is_active ? '1' : '0');
        if (imageFile) {
            payload.append('image', imageFile);
        }

        createStore.mutate(payload);
    };

    return (
        <MainConatiner
            title='სიახლის დამატება'
            button={
                <Button variant='text' size='small' className='caps' onClick={() => history.push('/news')}>
                    უკან დაბრუნება
                </Button>
            }
        >
            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                <FormBody>
                    <SectionRow>
                        <MultiLangInput
                            control={control}
                            name='title'
                            label='სათაური'
                            languages={languages}
                            defaultLang='ka'
                        />
                    </SectionRow>
                    <SectionRow>
                        <MultiLangTiptap
                            control={control}
                            name='content'
                            label='კონტენტი'
                            languages={languages}
                            defaultLang='ka'
                        />
                    </SectionRow>
                    <SectionRow>
                        <UniversalInput
                            label='პოზიცია'
                            size='small'
                            type='number'
                            {...register('sort_order', { required: true, valueAsNumber: true })}
                        />
                    </SectionRow>
                    <SectionRow>
                        <Controller
                            name='is_active'
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <SwitchRow>
                                    <Switch checked={value} onChange={onChange} />
                                    <span>აქტიურია</span>
                                </SwitchRow>
                            )}
                        />
                    </SectionRow>
                    <SectionRow>
                        <FileLabel>სურათი</FileLabel>
                        <FileInput type='file' accept='image/*' onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </SectionRow>
                </FormBody>

                <ActionRow>
                    <LoadingButton
                        sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 150 }}
                        variant='contained'
                        type='submit'
                        size='small'
                        loading={createStore.isLoading}
                    >
                        შენახვა
                    </LoadingButton>
                </ActionRow>
            </Box>
        </MainConatiner>
    );
};

const FormBody = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
`;

const SectionRow = styled.div`
    margin-top: 20px;
`;

const SwitchRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
`;

const ActionRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const FileLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
`;

const FileInput = styled.input`
    display: block;
`;

export default NewsCreate;
