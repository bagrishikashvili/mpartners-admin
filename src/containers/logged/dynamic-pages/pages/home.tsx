import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useForm } from 'react-hook-form';
import MainConatiner from 'partials/Container';
import { MultiLangInput } from 'components/MutliLanguageInput';
import useQuery from 'hooks/useQueryCustom';
import useMutationCustom from 'hooks/useMutationCustom';
import { useToasts } from 'react-toast-notifications';

type LocalizedText = {
  ka: string;
  en: string;
  ru: string;
  zh: string;
  ar: string;
};

type FormValues = {
  home_page_text: LocalizedText;
};

type HomePageBuilderProps = {
  menuId: number;
  pageKind?: 'main' | 'service';
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
  home_page_text: emptyLocalized(),
};

const mapIncomingToForm = (data: any): FormValues => ({
  home_page_text: {
    ...emptyLocalized(),
    ...(data?.home_page_text || {}),
  },
});

const HomePageBuilder = ({ menuId, pageKind = 'main' }: HomePageBuilderProps) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
    mode: 'onBlur',
  });
  const { addToast } = useToasts();

  const [wallpaperFile, setWallpaperFile] = useState<File | null>(null);
  const [wallpaperUrl, setWallpaperUrl] = useState<string>('');

  const { data, isLoading } = useQuery<any>(
    ['page_content_home_show', menuId, pageKind],
    {
      endpoint: '/pages/content',
      options: {
        method: 'get',
        body: {
          menu_id: menuId,
          template: 'home',
        },
      },
    },
    { enabled: true }
  );

  const updateMutation = useMutationCustom<any, any, FormData>(
    ['page_content_home_update', menuId, pageKind],
    {
      endpoint: '/pages/content',
      options: { method: 'post' },
    },
    {
      onSuccess: (response: any) => {
        const payload = response?.data?.content || {};
        setWallpaperUrl(payload.home_page_wallpaper || '');
        setWallpaperFile(null);
        addToast('მონაცემები შეინახა წარმატებით', { appearance: 'success', autoDismiss: true });
        reset(mapIncomingToForm(payload));
      },
    }
  );

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    const content = data.data?.content || {};
    setWallpaperUrl(content.home_page_wallpaper || '');
    reset(mapIncomingToForm(content));
  }, [data, reset]);

  const wallpaperPreview = useMemo(() => {
    if (wallpaperFile) {
      return URL.createObjectURL(wallpaperFile);
    }

    return wallpaperUrl;
  }, [wallpaperFile, wallpaperUrl]);

  useEffect(() => {
    return () => {
      if (wallpaperPreview && wallpaperPreview.startsWith('blob:')) {
        URL.revokeObjectURL(wallpaperPreview);
      }
    };
  }, [wallpaperPreview]);

  const onSubmit = (form: FormValues) => {
    const payload = new FormData();
    payload.append('menu_id', String(menuId));
    payload.append('type', pageKind);
    payload.append('template', 'home');
    if (wallpaperFile) {
      payload.append('home_page_wallpaper', wallpaperFile);
    }
    payload.append(
      'content',
      JSON.stringify({
        home_page_text: form.home_page_text,
      })
    );

    updateMutation.mutate(payload);
  };

  return (
    <MainConatiner title='მთავარი გვერდის მართვა'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <SectionRow>
            <SectionTitle>თავარი გევრდის სურათი</SectionTitle>
            <FileInput type='file' accept='image/*' onChange={(e) => setWallpaperFile(e.target.files?.[0] || null)} />
            {wallpaperPreview ? <PreviewImage src={wallpaperPreview} alt='home wallpaper preview' /> : null}
          </SectionRow>
                <SectionRow>
                  <MultiLangInput
                    control={control}
                    name='home_page_text'
                    label='ჩვენ შესახებ აღწერა'
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

export default HomePageBuilder;
