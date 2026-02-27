import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useForm } from 'react-hook-form';
import MainConatiner from 'partials/Container';
import { MultiLangInput } from 'components/MutliLanguageInput';
import useQuery from 'hooks/useQueryCustom';
import useMutationCustom from 'hooks/useMutationCustom';

type LocalizedText = {
  ka: string;
  en: string;
  ru: string;
  zh: string;
  ar: string;
};

type FormValues = {
  title: LocalizedText;
  description: LocalizedText;
  button_text: LocalizedText;
  link: string;
};

const languages = [
  { code: 'ka', label: 'ქართული', required: true },
  { code: 'en', label: 'ინგლისური' },
  { code: 'ru', label: 'რუსული' },
  { code: 'zh', label: 'ჩინური' },
  { code: 'ar', label: 'არაბული' },
];

const emptyLocalized = (): LocalizedText => ({
  ka: '',
  en: '',
  ru: '',
  zh: '',
  ar: '',
});

const defaultValues: FormValues = {
  title: emptyLocalized(),
  description: emptyLocalized(),
  button_text: emptyLocalized(),
  link: '',
};

const mapIncomingToForm = (content: any): FormValues => ({
  title: {
    ka: content?.title?.ka || '',
    en: content?.title?.en || '',
    ru: content?.title?.ru || '',
    zh: content?.title?.zh || '',
    ar: content?.title?.ar || '',
  },
  description: {
    ka: content?.description?.ka || '',
    en: content?.description?.en || '',
    ru: content?.description?.ru || '',
    zh: content?.description?.zh || '',
    ar: content?.description?.ar || '',
  },
  button_text: {
    ka: content?.button_text?.ka || '',
    en: content?.button_text?.en || '',
    ru: content?.button_text?.ru || '',
    zh: content?.button_text?.zh || '',
    ar: content?.button_text?.ar || '',
  },
  link: content?.link || '',
});

const Recomentation = ({}: any) => {
    const { control, handleSubmit, reset, register } = useForm<FormValues>({
        defaultValues,
        mode: 'onBlur',
    });
    const [wallpaperFile, setWallpaperFile] = useState<File | null>(null);
    const [wallpaperUrl, setWallpaperUrl] = useState<string>('');
    
    const { data, isLoading } = useQuery<any>(
        ['recomendation_page_show'],
        {
        endpoint: '/recomendation',
            options: {
                method: 'get'
            },
        },
        { enabled: true }
    );

    const updateMutation = useMutationCustom<any, any, FormData>(
        ['recomendation_page_update'],
        {
            endpoint: '/recomendation',
            options: { method: 'put' },
        },
        {
        onSuccess: (response: any) => {
            const payload = response?.data?.content || {};
            setWallpaperUrl(payload.wallpaper || '');
            setWallpaperFile(null);
            reset(mapIncomingToForm(payload));
        },
        }
    );


    useEffect(() => {
        if (!data?.data) {
            return;
        }
        const content = data.data?.content || {};
        setWallpaperUrl(content.wallpaper || '');
        reset(mapIncomingToForm(content));
    }, [data, reset]);

    const wallpaperPreview = useMemo(() => {
        if (wallpaperFile) {
            return URL.createObjectURL(wallpaperFile);
        }
        return wallpaperUrl;
    }, [wallpaperFile, wallpaperUrl]);

    const onSubmit = (form: FormValues) => {
            const payload = new FormData();
            payload.append('key', 'recomendation');
            payload.append('title', JSON.stringify(form.title));
            payload.append('description', JSON.stringify(form.description));
            payload.append('button_text', JSON.stringify(form.button_text));
            payload.append('link', form.link);
            if (wallpaperFile) {
                payload.append('wallpaper', wallpaperFile);
            }

            updateMutation.mutate(payload);
    };

    return (
        <MainConatiner title='რეკომენდაციების მართვა'>
            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                <FormBody>
                    <SectionRow>
                        <SectionTitle>შიდა ფონი (სურათი)</SectionTitle>
                        <FileInput type='file' accept='image/*' onChange={(e) => setWallpaperFile(e.target.files?.[0] || null)} />
                        {wallpaperPreview ? <PreviewImage src={wallpaperPreview} alt='home wallpaper preview' /> : null}
                    </SectionRow>
                    <SectionRow>
                        <MultiLangInput
                            control={control}
                            name='title'
                            label='დასახელება'
                            languages={languages}
                            defaultLang='ka'
                        />
                    </SectionRow>
                    <SectionRow>
                        <MultiLangInput
                            control={control}
                            name='description'
                            label='აღწერა'
                            languages={languages}
                            defaultLang='ka'
                            multiline
                            rows={2}
                            maxLength={255}
                        />
                    </SectionRow>
                    <SectionRow>
                        <FieldLabel>ლინკი:</FieldLabel>
                        <TextInput type='text' placeholder='ლინკი' {...register('link')} />
                    </SectionRow>
                    <SectionRow>
                        <MultiLangInput
                            control={control}
                            name='button_text'
                            label='ღილაკის ტექსტი'
                            languages={languages}
                            defaultLang='ka'
                        />
                    </SectionRow>
                </FormBody>
                <ActionRow>
                    <LoadingButton
                        sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 180 }}
                        variant='contained'
                        type='submit'
                        size='small'
                        loading={updateMutation.isLoading || isLoading}
                    >
                        განახლება
                    </LoadingButton>
                </ActionRow>
            </Box>
        </MainConatiner>
    )
}
const FormBody = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
`;

const SectionRow = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
`;
const TextInput = styled.input`
  display: block;
  width: 100%;
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
`;
export default Recomentation;
