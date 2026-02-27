import * as React from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

type Lang = {
  code: string;
  label: string;
  required?: boolean;
};

type MultiLangInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>; // e.g. "title"
  languages: Lang[];
  defaultLang: string; // e.g. "ka"
  label?: string;
  helperText?: string;
  placeholder?: (langCode: string) => string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
  fullWidth?: boolean;
};

function isNonEmpty(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export function MultiLangInput<T extends FieldValues>({
  control,
  name,
  languages,
  defaultLang,
  label,
  helperText,
  placeholder,
  multiline = false,
  rows = 3,
  disabled = false,
  maxLength = 255,
  fullWidth = true,
}: MultiLangInputProps<T>) {
  const requiredLang =
    languages.find((l) => l.required)?.code || defaultLang;

  const [activeLang, setActiveLang] = React.useState<string>(
    defaultLang || languages[0]?.code
  );

  React.useEffect(() => {
    if (!languages.some((l) => l.code === activeLang)) {
      setActiveLang(defaultLang || languages[0]?.code);
    }
  }, [languages, activeLang, defaultLang]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value: any) => {
          const v = value || {};
          const req = v?.[requiredLang];
          if (!isNonEmpty(req)) {
            return `აუცილებელია: ${requiredLang.toUpperCase()}`;
          }
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        const valueObj: Record<string, string> = field.value || {};

        const filledCount = languages.reduce((acc, l) => {
          return acc + (isNonEmpty(valueObj[l.code]) ? 1 : 0);
        }, 0);

        const setLangValue = (lang: string, val: string) => {
          field.onChange({
            ...valueObj,
            [lang]: val,
          });
        };

        const activeVal = valueObj[activeLang] ?? "";

        return (
          <Box>
            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" fontWeight={600}>
                  {label ?? String(name)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filledCount}/{languages.length} შევსებულია
                </Typography>
              </Stack>

              <Chip
                size="small"
                variant="outlined"
                label={`აუცილებელია: ${requiredLang.toUpperCase()}`}
              />
            </Stack>

            <Tabs
              value={activeLang}
              onChange={(_, v) => setActiveLang(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 1 }}
            >
              {languages.map((l) => {
                const filled = isNonEmpty(valueObj[l.code]);
                const Icon = filled ? CheckCircleIcon : ErrorOutlineIcon;

                return (
                  <Tab
                    key={l.code}
                    value={l.code}
                    disabled={disabled}
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight={600}>
                          {l.label}
                        </Typography>
                        <Tooltip title={filled ? "Filled" : "Empty"}>
                          <Icon fontSize="small" style={{color: filled ? 'green' : 'red'}}/>
                        </Tooltip>
                      </Stack>
                    }
                  />
                );
              })}
            </Tabs>
            <TextField
              size="small"
              value={activeVal}
              onChange={(e) => setLangValue(activeLang, e.target.value)}
              onBlur={field.onBlur}
              disabled={disabled}
              fullWidth={fullWidth}
              multiline={multiline}
              rows={multiline ? rows : undefined}
              inputProps={{ maxLength }}
              placeholder={placeholder ? placeholder(activeLang) : undefined}
              error={!!fieldState.error}
              helperText={fieldState.error?.message || helperText}
              sx={{
                "& .MuiInputBase-root": {
                  alignItems: multiline ? "flex-start" : "center",
                  height: multiline ? "auto !important" : undefined,
                },
                "& .MuiInputBase-inputMultiline": {
                  lineHeight: 1.5,
                  padding: "10px 14px",
                },
                "& .MuiInputBase-input": {
                  lineHeight: 1.5,
                },
              }}
            />
          </Box>
        );
      }}
    />
  );
}
