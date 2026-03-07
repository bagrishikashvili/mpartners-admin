import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useForm } from 'react-hook-form';
import MainConatiner from 'partials/Container';
import { MultiLangInput } from 'components/MutliLanguageInput';
import { MultiLangTiptap } from 'components/MultiLangTiptap';
import useQuery from 'hooks/useQueryCustom';
import useMutationCustom from 'hooks/useMutationCustom';
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
  about_page_title: LocalizedText;
  about_page_description: LocalizedText;
  about_page_bottom_text: LocalizedText;
};

type AboutPageBuilderProps = {
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
  about_page_title: emptyLocalized(),
  about_page_description: emptyLocalized(),
  about_page_bottom_text: emptyLocalized(),
};

const mapIncomingToForm = (data: any): FormValues => ({
  about_page_title: {
    ...emptyLocalized(),
    ...(data?.about_page_title || {}),
  },
  about_page_description: {
    ...emptyLocalized(),
    ...(data?.about_page_description || {}),
  },
  about_page_bottom_text: {
    ...emptyLocalized(),
    ...(data?.about_page_bottom_text || {}),
  },
});

const AboutPageBuilder = ({ menuId, pageKind = 'main' }: AboutPageBuilderProps) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
    mode: 'onBlur',
  });
  const { addToast } = useToasts();

  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImageUrl, setAboutImageUrl] = useState<string>('');

  const { data, isLoading } = useQuery<any>(
    ['page_content_about_show', menuId, pageKind],
    {
      endpoint: '/pages/content',
      options: {
        method: 'get',
        body: {
          menu_id: menuId,
          template: 'about_page',
        },
      },
    },
    { enabled: true }
  );

  const updateMutation = useMutationCustom<any, any, FormData>(
    ['page_content_about_update', menuId, pageKind],
    {
      endpoint: '/pages/content',
      options: { method: 'post' },
    },
    {
      onSuccess: (response: any) => {
        const payload = response?.data?.content || {};
        setAboutImageUrl(payload.about_page_image || '');
        setAboutImageFile(null);
        reset(mapIncomingToForm(payload));
        addToast('მონაცემები შეინახა წარმატებით', { appearance: 'success', autoDismiss: true });
      },
    }
  );

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    const content = data.data?.content || {};
    setAboutImageUrl(content.about_page_image || '');
    reset(mapIncomingToForm(content));
  }, [data, reset]);

  const aboutImagePreview = useMemo(() => {
    if (aboutImageFile) {
      return URL.createObjectURL(aboutImageFile);
    }

    return aboutImageUrl;
  }, [aboutImageFile, aboutImageUrl]);

  useEffect(() => {
    return () => {
      if (aboutImagePreview && aboutImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(aboutImagePreview);
      }
    };
  }, [aboutImagePreview]);

  const onSubmit = (form: FormValues) => {
    const payload = new FormData();
    payload.append('menu_id', String(menuId));
    payload.append('type', pageKind);
    payload.append('template', 'about_page');
    payload.append(
      'content',
      JSON.stringify({
        about_page_title: form.about_page_title,
        about_page_description: form.about_page_description,
        about_page_bottom_text: form.about_page_bottom_text,
      })
    );

    if (aboutImageFile) {
      payload.append('about_page_image', aboutImageFile);
    }

    updateMutation.mutate(payload);
  };
  if (isLoading) {
    return <LoadingScreen/>
  }
  return (
    <MainConatiner title='ჩვენ შესახებ გვერდის მართვა'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <SectionRow>
            <MultiLangInput
              control={control}
              name='about_page_title'
              label='დასახელება'
              languages={languages}
              defaultLang='ka'
            />
          </SectionRow>

          <SectionRow>
            <MultiLangTiptap
              control={control}
              name='about_page_description'
              label='ჩვენ შესახებ აღწერა'
              languages={languages}
              defaultLang='ka'
            />
          </SectionRow>

          <SectionRow>
            <SectionTitle>სურათის ატვირთვა</SectionTitle>
            <FileInput type='file' accept='image/*' onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)} />
            {aboutImagePreview ? <PreviewImage src={aboutImagePreview} alt='about page preview' /> : null}
          </SectionRow>

          <SectionRow>
            <MultiLangInput
              control={control}
              name='about_page_bottom_text'
              label='იხილედ სრულად ტექსტი'
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

export default AboutPageBuilder;
