import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Switch } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Controller, useForm } from 'react-hook-form';
import MainConatiner from 'partials/Container';
import UniversalInput from 'components/Input/UniversalInput';
import { MultiLangInput } from 'components/MutliLanguageInput';
import useMutationCustom from 'hooks/useMutationCustom';
import useQuery from 'hooks/useQueryCustom';
import { MultiLangTiptap } from 'components/MultiLangTiptap';
import LoadingScreen from 'components/Loading';
import { useToasts } from 'react-toast-notifications';

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

const mapIncomingToForm = (item: any): FormValues => ({
    title: {
        ka: item?.title?.ka || '',
        en: item?.title?.en || '',
        ru: item?.title?.ru || '',
        zh: item?.title?.zh || '',
        ar: item?.title?.ar || '',
    },
    content: {
        ka: item?.content?.ka || '',
        en: item?.content?.en || '',
        ru: item?.content?.ru || '',
        zh: item?.content?.zh || '',
        ar: item?.content?.ar || '',
    },
    sort_order: Number(item?.sort_order ?? 0),
    is_active: Boolean(item?.is_active ?? true),
});

const NewsEdit = () => {
    const history = useHistory();
    const { addToast } = useToasts();
    const { id } = useParams<{ id: string }>();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const { control, handleSubmit, register, reset } = useForm<FormValues>({
        defaultValues: {
            title: emptyLocalized(),
            content: emptyLocalized(),
            sort_order: 0,
            is_active: true,
        },
        mode: 'onBlur',
    });

    const { data: item, isLoading } = useQuery<any>(
        ['get_web_news_details', id],
        {
            endpoint: `/news/admin/${id}`,
            options: { method: 'get' },
        },
        { enabled: true }
    );

    const updateStore = useMutationCustom<any, any, FormData>(
        ['update_web_news', id],
        {
            endpoint: `/news/${id}`,
            options: { method: 'post' },
        },
        {
            onSuccess: () => {
                addToast('მონაცემები შეინახა წარმატებით', { appearance: 'success', autoDismiss: true });
                history.push('/news');
            },
        }
    );

    const deleteStore = useMutationCustom<any, any, any>(
        ['delete_web_news', id],
        {
            endpoint: `/news/${id}`,
            options: { method: 'delete' },
        },
        {
            onSuccess: () => {
                history.push('/news');
            },
        }
    );

    useEffect(() => {
        if (!item?.data) {
            return;
        }

        setImageUrl(item.data?.image || '');
        reset(mapIncomingToForm(item.data));
    }, [item, reset]);

    const imagePreview = useMemo(() => {
        if (imageFile) {
            return URL.createObjectURL(imageFile);
        }

        return imageUrl;
    }, [imageFile, imageUrl]);

    const onSubmit = (data: FormValues) => {
        const payload = new FormData();
        payload.append('_method', 'put');
        payload.append('title', JSON.stringify(data.title));
        payload.append('content', JSON.stringify(data.content));
        payload.append('sort_order', String(data.sort_order ?? 0));
        payload.append('is_active', data.is_active ? '1' : '0');
        if (imageFile) {
            payload.append('image', imageFile);
        }

        updateStore.mutate(payload);
    };

    if (isLoading) {
        return <LoadingScreen/>
    }
    return (
        <MainConatiner
            title='სიახლის რედაქტირება'
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
                        {imagePreview ? <PreviewImage src={imagePreview} alt='news preview' /> : null}
                    </SectionRow>
                </FormBody>

                <ActionRow>
                    <LoadingButton
                        sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 150 }}
                        variant='contained'
                        type='submit'
                        size='small'
                        loading={updateStore.isLoading || isLoading}
                    >
                        შენახვა
                    </LoadingButton>
                    <LoadingButton
                        sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 150 }}
                        variant='outlined'
                        color='error'
                        size='small'
                        loading={deleteStore.isLoading}
                        onClick={() => deleteStore.mutate({})}
                    >
                        სიახლის წაშლა
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
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
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

const PreviewImage = styled.img`
    margin-top: 12px;
    width: 100%;
    max-width: 420px;
    border-radius: 8px;
    border: 1px solid #ddd;
    object-fit: cover;
`;

export default NewsEdit;
