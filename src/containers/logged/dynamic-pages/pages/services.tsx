import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useForm } from 'react-hook-form';
import MainConatiner from 'partials/Container';
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
  content: LocalizedText;
};

type ServicePageBuilderProps = {
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
  content: emptyLocalized(),
};

const mapIncomingToForm = (data: any): FormValues => ({
  content: {
    ...emptyLocalized(),
    ...(data?.content || {}),
  },
});

const ServicePageBulder = ({ menuId }: ServicePageBuilderProps) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
    mode: 'onBlur',
  });
  const { addToast } = useToasts();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const subMenuId = menuId;

  const { data, isLoading } = useQuery<any>(
    ['service_page_content_show', subMenuId],
    {
      endpoint: '/service-pages/content',
      options: {
        method: 'get',
        body: {
          sub_menu_id: subMenuId,
        },
      },
    },
    { enabled: true }
  );

  const updateMutation = useMutationCustom<any, any, FormData>(
    ['service_page_content_update', subMenuId],
    {
      endpoint: '/service-pages/content',
      options: { method: 'post' },
    },
    {
      onSuccess: (response: any) => {
        const payload = response?.data?.content || {};
        setImageUrl(payload.image || '');
        setImageFile(null);
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
    setImageUrl(content.image || '');
    reset(mapIncomingToForm(content));
  }, [data, reset]);

  const imagePreview = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return imageUrl;
  }, [imageFile, imageUrl]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onSubmit = (form: FormValues) => {
    const payload = new FormData();
    payload.append('sub_menu_id', String(subMenuId));
    payload.append('content', JSON.stringify(form.content));

    if (imageFile) {
      payload.append('image', imageFile);
    }

    updateMutation.mutate(payload);
  };
  if (isLoading) {
    return <LoadingScreen/>
  }
  return (
    <MainConatiner title='სერვისის გვერდის მართვა'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
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
            <SectionTitle>სურათის ატვირთვა</SectionTitle>
            <FileInput type='file' accept='image/*' onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            {imagePreview ? <PreviewImage src={imagePreview} alt='service page preview' /> : null}
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

export default ServicePageBulder;
