import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import MainConatiner from "partials/Container";
import { Box, Button, Switch } from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { MultiLangInput } from "components/MutliLanguageInput";
import useQuery from "hooks/useQueryCustom";
import UniversalInput from "components/Input/UniversalInput";
import useMutationCustom from "hooks/useMutationCustom";

const languages = [
  { code: "ka", label: "ქართული", required: true },
  { code: "en", label: "ინგლისური" },
  { code: "ru", label: "რუსული" },
  { code: "ar", label: "არაბული" },
  { code: "zh", label: "ჩინური" },
];

const emptyMultiLangName = { ka: "", en: "", ru: "", zh: "", ar: "" };
const normalizeName = (value: any) => ({
  ka: value?.ka ?? "",
  en: value?.en ?? "",
  ru: value?.ru ?? "",
  zh: value?.zh ?? "",
  ar: value?.ar ?? "",
});

const MenuControlEdit = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();


  const { control, handleSubmit, register, reset } = useForm<any>({
    defaultValues: {
      name: { ...emptyMultiLangName },
      sort_order: 0,
      is_active: true,
      sub_menus: [],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_menus",
  });

  const { data: item, isLoading: detailsLoading } = useQuery<any>(
    ["get_web_menu_details", id],
    {
      endpoint: `/menus/get-menu-details/${id}`,
      options: { method: "get" },
    },
    { enabled: true }
  );
  

  const createStore = useMutationCustom<
    {},
    { errors: [{ field: string; message: string }] },
    any
  >(
    ["update_web_sub_menu"],
    {
      endpoint: `/menus/${id}`,
      options: { method: "put" },
    },
    {
      onSuccess: () => {
        history.push("/menu-control");
      },
    }
  );

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      name: normalizeName(data?.name),
      sub_menus: (data?.sub_menus || []).map((sub: any) => ({
        ...sub,
        name: normalizeName(sub?.name),
      })),
    };
    createStore.mutate(payload);
  };

  useEffect(() => {
    const menu = item?.data;
    if (!menu) {
      return;
    }

    reset({
      name: normalizeName(menu.name_object),
      sort_order: menu.sort_order ?? 0,
      is_active: menu.is_active ?? true,
      sub_menus: (menu.sub_menus || []).map((sub: any, index: number) => ({
        id: sub.id,
        name: normalizeName(sub.name_object),
        sort_order: sub.sort_order ?? index + 1,
        is_active: sub.is_active ?? true,
      })),
    });
  }, [item, reset]);

  const handleAddSubMenu = () => {
    append({
      name: { ...emptyMultiLangName },
      sort_order: fields.length + 1,
      is_active: true,
    });
  };

  return (
    <MainConatiner
      title={`რედაქტირება: ${item?.data?.name_object?.ka || ""}`}    
      button={
        <Button
          variant="text"
          size="small"
          className="caps"
          onClick={() => history.push("/menu-control")}
        >
          უკან დაბრუნება
        </Button>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <MultiLangInput
            control={control}
            name="name"
            label="მენიუს დასახელება"
            languages={languages}
            defaultLang="ka"
            placeholder={(lang) => (lang === "ka" ? "მაგ: მთავარი" : "Type...")}
            multiline={false}
          />

          <SectionRow>
            <UniversalInput
              label="პოზიცია"
              size="small"
              type="number"
              {...register("sort_order", { required: true, valueAsNumber: true })}
            />
          </SectionRow>

          <SectionRow>
            <Controller
              name="is_active"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SwitchRow>
                  <Switch checked={value} onChange={onChange} />
                  <span>აქტიურია</span>
                </SwitchRow>
              )}
            />
          </SectionRow>

          <SubMenuHeader>
            <span>ქვე მენიუები</span>
            <Button size="small" variant="outlined" onClick={handleAddSubMenu}>
              ქვე მენუს დამატება
            </Button>
          </SubMenuHeader>

          {fields.map((field, index) => (
            <SubMenuCard key={field.id}>
              <MultiLangInput
                control={control}
                name={`sub_menus.${index}.name`}
                label={`ქვე მენიუ #${index + 1}`}
                languages={languages}
                defaultLang="ka"
                placeholder={(lang) =>
                  lang === "ka" ? "მაგ: ექსკურსიები" : "Type..."
                }
                multiline={false}
              />

              <SubMenuActions>
                <UniversalInput
                  label="პოზიცია"
                  size="small"
                  type="number"
                  {...register(`sub_menus.${index}.sort_order`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                <Controller
                  name={`sub_menus.${index}.is_active`}
                  control={control}
                  defaultValue={true}
                  render={({ field: { onChange, value } }) => (
                    <SwitchRow>
                      <Switch checked={!!value} onChange={onChange} />
                      <span>აქტიურია</span>
                    </SwitchRow>
                  )}
                />
                <Button color="error" variant="text" onClick={() => remove(index)}>
                  წაშლა
                </Button>
              </SubMenuActions>
            </SubMenuCard>
          ))}
        </FormBody>

        <ActionRow>
          <LoadingButton
            sx={{ marginTop: 0.7, fontSize: 14, padding: 2, width: 150 }}
            variant="contained"
            type="submit"
            size="small"
            loading={detailsLoading || createStore.isLoading}
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

const SubMenuHeader = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubMenuCard = styled.div`
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 5px;
`;

const SubMenuActions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default MenuControlEdit;
