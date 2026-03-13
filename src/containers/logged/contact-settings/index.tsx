import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useForm, useFieldArray } from 'react-hook-form';
import MainConatiner from 'partials/Container';
import UniversalInput from 'components/Input/UniversalInput';
import { MultiLangInput } from 'components/MutliLanguageInput';
import useQuery from 'hooks/useQueryCustom';
import useMutationCustom from 'hooks/useMutationCustom';
import LoadingScreen from 'components/Loading';
import { useToasts } from 'react-toast-notifications';

const languages = [
  { code: 'ka', label: 'ქართული', required: true },
  { code: 'en', label: 'ინგლისური' },
  { code: 'ru', label: 'რუსული' },
  { code: 'zh', label: 'ჩინური' },
  { code: 'ar', label: 'არაბული' },
];

type PhoneItem = { value: string };

type FormValues = {
  phones: PhoneItem[];
  email: string;
  address: { ka: string; en: string; ru: string; zh: string };
  footer_text: { ka: string; en: string; ru: string; zh: string };
  social: {
    linkedin: string;
  };
  map: {
    link: string;
  };
};

const defaultValues: FormValues = {
  phones: [],
  email: '',
  address: { ka: '', en: '', ru: '', zh: '' },
  footer_text: { ka: '', en: '', ru: '', zh: '' },
  social: {
    linkedin: '',
  },
  map: {
    link: '',
  },
};

const mapIncomingToForm = (data: any): FormValues => ({
  phones: (data?.phones || []).map((item: string) => ({ value: item })),
  email: data?.email || '',
  address: {
    ka: data?.address?.ka || '',
    en: data?.address?.en || '',
    ru: data?.address?.ru || '',
    zh: data?.address?.zh || '',
  },
  footer_text: {
    ka: data?.footer_text?.ka || '',
    en: data?.footer_text?.en || '',
    ru: data?.footer_text?.ru || '',
    zh: data?.footer_text?.zh || '',
  },
  social: {
    linkedin: data?.social?.linkedin || '',
  },
  map: {
    link: data?.map?.link || '',
  },
});

const ContactSettings = () => {
  const { control, handleSubmit, register, reset } = useForm<FormValues>({
    defaultValues,
    mode: 'onBlur',
  });
  const { addToast } = useToasts();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phones',
  });

  const { data, isLoading } = useQuery<any>(
    ['contact_settings_show'],
    {
      endpoint: '/settings/contact',
      options: { method: 'get' },
    },
    { enabled: true }
  );

  const updateMutation = useMutationCustom<any, any, any>(
    ['contact_settings_update'],
    {
      endpoint: '/settings/contact',
      options: { method: 'put' },
    },
    {
      onSuccess: () => {
        addToast('მონაცემები შეინახა წარმატებით', { appearance: 'success', autoDismiss: true });
      },
    }
  );

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    reset(mapIncomingToForm(data.data));
  }, [data, reset]);

  const onSubmit = (form: FormValues) => {
    debugger;
    const payload = {
      phones: form.phones.map((item) => item.value),
      email: form.email || null,
      address: form.address,
      footer_text: form.footer_text,
      social: {
        linkedin: form.social.linkedin || null,
      },
      map: {
        link: form.map.link === '' ? null : form.map.link,
      },
    };

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return <LoadingScreen/>
  }

  return (
    <MainConatiner title='საკონტაქტო მონაცემები'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <SectionRow>
            <UniversalInput
              label='ელ-ფოსტა'
              size='small'
              type='email'
              {...register('email')}
            />
          </SectionRow>

          <SectionRow>
            <SectionTitle>ტელეფონები</SectionTitle>
            {fields.map((field, index) => (
              <PhoneRow key={field.id}>
                <UniversalInput
                  label={`ტელეფონი #${index + 1}`}
                  size='small'
                  {...register(`phones.${index}.value` as const)}
                />
                <Button variant='text' color='error' onClick={() => remove(index)}>
                  წაშლა
                </Button>
              </PhoneRow>
            ))}
            <Button variant='outlined' size='small' onClick={() => append({ value: '' })}>
              ტელეფონის დამატება
            </Button>
          </SectionRow>

          <SectionRow>
            <MultiLangInput
              control={control}
              name='address'
              label='მისამართი'
              languages={languages}
              defaultLang='ka'
              placeholder={() => 'შეიყვანე მისამართი'}
            />
          </SectionRow>
          <SectionRow>
            <SectionTitle>სოციალური ქსელები</SectionTitle>
            <Grid2>
              <UniversalInput label='ლინკდინი' size='small' {...register('social.linkedin')} />
            </Grid2>
          </SectionRow>
          <SectionRow>
            <MultiLangInput
              control={control}
              name='footer_text'
              label='ფუტერის ტექსტი'
              languages={languages}
              defaultLang='ka'
              placeholder={() => 'შეიყვანე ფუტერის ტექსტი'}
            />
          </SectionRow>
          <SectionRow>
            <SectionTitle>რუკა</SectionTitle>
            <Grid2>
              <UniversalInput label='Iframe ლინკი' size='small'{...register('map.link')} />
            </Grid2>
          </SectionRow>
        </FormBody>

        <ActionRow>
          <LoadingButton
            sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 160 }}
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

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const PhoneRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 10px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
`;

export default ContactSettings;
