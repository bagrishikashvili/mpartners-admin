import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import MainConatiner from 'partials/Container';
import DialogModal from 'components/Modal';
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

type TeamMember = {
  id: number;
  image: string | null;
  full_name: Partial<LocalizedText>;
  position: Partial<LocalizedText>;
  experience: Partial<LocalizedText>;
  phone?: string | null;
  email?: string | null;
};

type FormValues = {
  full_name: LocalizedText;
  position: LocalizedText;
  experience: LocalizedText;
  phone: string;
  email: string;
  sort_order: number;
};

type OurTeamBuilderProps = {
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
  full_name: emptyLocalized(),
  position: emptyLocalized(),
  experience: emptyLocalized(),
  phone: '',
  email: '',
  sort_order: 0,
};

const mapIncomingToForm = (data: any): FormValues => ({
  full_name: {
    ...emptyLocalized(),
    ...(data?.full_name || {}),
  },
  position: {
    ...emptyLocalized(),
    ...(data?.position || {}),
  },
  experience: {
    ...emptyLocalized(),
    ...(data?.experience || {}),
  },
  phone: data?.phone || '',
  email: data?.email || '',
  sort_order: Number.isFinite(Number(data?.sort_order)) ? Number(data?.sort_order) : 0,
});

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const decodeHtml = (value: string): string => {
  if (typeof window === 'undefined') {
    return value;
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
};

const pickLocalized = (value: Partial<LocalizedText> | undefined, lang: string): string => {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const order = Array.from(new Set([lang, 'ka', 'en', 'ru', 'zh', 'ar']));
  for (const code of order) {
    const text = value[code as keyof LocalizedText];
    if (typeof text === 'string' && text.trim() !== '') {
      return text.trim();
    }
  }

  return '';
};

const hasExperience = (value: Partial<LocalizedText> | undefined): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Object.values(value).some((item) => typeof item === 'string' && stripHtml(item) !== '');
};

const OurTeamBuilder = ({ menuId, pageKind = 'main' }: OurTeamBuilderProps) => {
  const history = useHistory();
  const { addToast } = useToasts();
  const location = useLocation();
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [openedMember, setOpenedMember] = useState<TeamMember | null>(null);
  const lang = localStorage.getItem('@lang') || 'ka';

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const memberId = useMemo(() => {
    const raw = searchParams.get('member_id');
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);
  const isCreateMode = useMemo(() => searchParams.get('mode') === 'create', [searchParams]);
  const isFormMode = Boolean(memberId) || isCreateMode;

  const { control, handleSubmit, reset, register } = useForm<FormValues>({
    defaultValues,
    mode: 'onBlur',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data: membersResponse, isLoading: isMembersLoading } = useQuery<any>(
    ['team_members_list', menuId, refreshSeed],
    {
      endpoint: '/team-members',
      options: {
        method: 'get',
        body: {
          menu_id: menuId,
        },
      },
    },
    { enabled: true }
  );

  const members: TeamMember[] = useMemo(() => {
    const list = membersResponse?.data;
    return Array.isArray(list) ? list : [];
  }, [membersResponse]);

  const { data, isLoading } = useQuery<any>(
    ['team_member_show', menuId, memberId],
    {
      endpoint: `/team-members/${memberId}`,
      options: {
        method: 'get',
        body: {
          menu_id: menuId,
        },
      },
    },
    { enabled: !!memberId }
  );

  const onSuccessPersist = (payload: any) => {
    setImageUrl(payload.image || '');
    setImageFile(null);
    reset(mapIncomingToForm(payload));
    setRefreshSeed((v) => v + 1);
    addToast('მონაცემები შეინახა წარმატებით', { appearance: 'success', autoDismiss: true });
    history.push(`/pages/${menuId}`);
  };

  const createMutation = useMutationCustom<any, any, FormData>(
    ['team_member_create', menuId, pageKind],
    {
      endpoint: '/team-members',
      options: { method: 'post' },
    },
    {
      onSuccess: (response: any) => onSuccessPersist(response?.data || {}),
    }
  );

  const updateMutation = useMutationCustom<any, any, FormData>(
    ['team_member_update', menuId, memberId, pageKind],
    {
      endpoint: `/team-members/${memberId}`,
      options: { method: 'post' },
    },
    {
      onSuccess: (response: any) => onSuccessPersist(response?.data || {}),
    }
  );

  useEffect(() => {
    if (!memberId) {
      setImageUrl('');
      setImageFile(null);
      reset(defaultValues);
      return;
    }

    if (!data?.data) {
      return;
    }

    const member = data.data || {};
    setImageUrl(member.image || '');
    reset(mapIncomingToForm(member));
  }, [data, memberId, reset]);

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
    if (memberId) {
        payload.append('_method', 'put');
    }
    payload.append('menu_id', String(menuId));
    payload.append('full_name', JSON.stringify(form.full_name));
    payload.append('position', JSON.stringify(form.position));
    payload.append('experience', JSON.stringify(form.experience));
    payload.append('phone', form.phone || '');
    payload.append('email', form.email || '');
    payload.append('sort_order', String(form.sort_order ?? 0));
    payload.append('is_active', '1');

    if (imageFile) {
      payload.append('image', imageFile);
    }

    if (memberId) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  };

  if (isLoading || isMembersLoading) {
    return <LoadingScreen/>
  }

  if (!isFormMode) {
    return (
      <MainConatiner
        title='ჩვენი გუნდი'
        button={
          <LoadingButton variant='contained' size='small' onClick={() => history.push(`/pages/${menuId}?mode=create`)}>
            ახალი თანამშრომელი
          </LoadingButton>
        }
      >
        <CardsGrid>
          {!isMembersLoading &&
            members.map((member) => {
              const fullName = pickLocalized(member.full_name, lang) || '-';
              const position = pickLocalized(member.position, lang) || '-';
              const canShowExperience = hasExperience(member.experience);

              return (
                <Card key={member.id} onDoubleClick={() => history.push(`/pages/${menuId}?member_id=${member.id}`)}>
                  {member.image ? <CardImage src={member.image} alt={fullName} /> : <CardImagePlaceholder>No Image</CardImagePlaceholder>}
                  <CardName>{fullName}</CardName>
                  <CardPosition>{position}</CardPosition>
                  <CardActions>
                    <ActionLink type='button' onClick={() => history.push(`/pages/${menuId}?member_id=${member.id}`)}>
                      რედაქტირება
                    </ActionLink>
                    {canShowExperience ? (
                      <ActionLink type='button' onClick={() => setOpenedMember(member)}>
                        გამოცდილება
                      </ActionLink>
                    ) : null}
                  </CardActions>
                </Card>
              );
            })}
        </CardsGrid>

        <DialogModal
          open={Boolean(openedMember)}
          onClose={() => setOpenedMember(null)}
          title={pickLocalized(openedMember?.full_name, lang) || 'Experience'}
          withButtons={false}
        >
          <ExperienceBody
            dangerouslySetInnerHTML={{
              __html: decodeHtml(pickLocalized(openedMember?.experience, lang) || ''),
            }}
          />
          <ContactInfo>
            <InfoRow>
              <InfoLabel>ტელეფონი:</InfoLabel> {openedMember?.phone?.trim() || '-'}
            </InfoRow>
            <InfoRow>
              <InfoLabel>ელ.ფოსტა:</InfoLabel> {openedMember?.email?.trim() || '-'}
            </InfoRow>
          </ContactInfo>
        </DialogModal>
      </MainConatiner>
    );
  }

  return (
    <MainConatiner
      title={memberId ? 'თანამშრომლის რედაქტირება' : 'თანამშრომლის დამატება'}
      button={
        <LoadingButton variant='text' size='small' onClick={() => history.push(`/pages/${menuId}`)}>
          უკან სიაში
        </LoadingButton>
      }
    >
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <SectionRow>
            <SectionTitle>თანამშრომლის სურათი</SectionTitle>
            <FileInput type='file' accept='image/*' onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            {imagePreview ? <PreviewImage src={imagePreview} alt='team member preview' /> : null}
          </SectionRow>

          <SectionRow>
            <MultiLangInput
              control={control}
              name='full_name'
              label='სახელი და გვარი'
              languages={languages}
              defaultLang='ka'
              multiline
              rows={2}
              maxLength={255}
            />
          </SectionRow>

          <SectionRow>
            <MultiLangInput
              control={control}
              name='position'
              label='პოზიცია'
              languages={languages}
              defaultLang='ka'
              multiline
              rows={2}
              maxLength={255}
            />
          </SectionRow>

          <SectionRow>
            <FieldLabel>ტელეფონი:</FieldLabel>
            <TextInput type='text' placeholder='ტელეფონი' {...register('phone')} />
          </SectionRow>

          <SectionRow>
            <FieldLabel>ელ.ფოსტა</FieldLabel>
            <TextInput type='email' placeholder='ელ.ფოსტა' {...register('email')} />
          </SectionRow>

          <SectionRow>
            <FieldLabel>მდებარეობა</FieldLabel>
            <TextInput type='number' min={0} {...register('sort_order', { valueAsNumber: true })} />
          </SectionRow>

          <SectionRow>
            <MultiLangTiptap
              control={control}
              name='experience'
              label='გამოცდილება'
              languages={languages}
              defaultLang='ka'
              isRequired={false}
            />
          </SectionRow>
        </FormBody>

        <ActionRow>
          <LoadingButton
            sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 180 }}
            variant='contained'
            type='submit'
            size='small'
            loading={createMutation.isLoading || updateMutation.isLoading || isLoading}
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

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const TextInput = styled.input`
  display: block;
  width: 100%;
  max-width: 420px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
`;

const PreviewImage = styled.img`
  margin-top: 12px;
  width: 100%;
  max-width: 280px;
  border-radius: 8px;
  border: 1px solid #ddd;
  object-fit: cover;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
`;

const CardImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

const CardImagePlaceholder = styled.div`
  width: 100%;
  max-width: 300px;
  height: 300px;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const CardName = styled.h4`
  margin: 12px 0 6px;
  font-size: 16px;
`;

const CardPosition = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4b5563;
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const ActionLink = styled.button`
  border: none;
  background: transparent;
  color: #2563eb;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
`;

const ExperienceBody = styled.div`
  min-width: 320px;
  max-width: 700px;
  line-height: 1.6;
  white-space: normal;

  p {
    margin: 0 0 10px;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }

  strong,
  b {
    font-weight: 700;
  }

  em,
  i {
    font-style: italic;
  }

  ul,
  ol {
    margin: 0 0 10px;
    padding-left: 1.2rem;
  }

  blockquote {
    border-left: 3px solid #d1d5db;
    margin: 0.5rem 0;
    padding-left: 0.8rem;
  }
`;

const ContactInfo = styled.div`
  margin-top: 14px;
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
`;

const InfoRow = styled.p`
  margin: 0 0 6px;
  font-size: 14px;
  color: #374151;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #111827;
`;

export default OurTeamBuilder;
