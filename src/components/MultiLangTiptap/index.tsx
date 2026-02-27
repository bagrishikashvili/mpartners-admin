import * as React from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Lang = {
  code: string;
  label: string;
  required?: boolean;
};

type MultiLangTiptapProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  languages: Lang[];
  defaultLang: string;
  isRequired?: boolean;
  label?: string;
  helperText?: string;
  disabled?: boolean;
};

type TiptapFieldProps = {
  activeLang: string;
  valueObj: Record<string, string>;
  disabled: boolean;
  onBlur: () => void;
  onValueChange: (next: Record<string, string>) => void;
  errorText?: string;
  helperText?: string;
};

function extractText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNonEmpty(v: unknown) {
  return typeof v === "string" && extractText(v).length > 0;
}

function TiptapField({
  activeLang,
  valueObj,
  disabled,
  onBlur,
  onValueChange,
  errorText,
  helperText,
}: TiptapFieldProps) {
  const activeLangRef = React.useRef(activeLang);
  const valueObjRef = React.useRef(valueObj);

  React.useEffect(() => {
    activeLangRef.current = activeLang;
  }, [activeLang]);

  React.useEffect(() => {
    valueObjRef.current = valueObj;
  }, [valueObj]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: valueObj[activeLang] || "",
    editorProps: {
      attributes: {
        class: "tiptap-content",
      },
    },
    onBlur: () => onBlur(),
    onUpdate: ({ editor: currentEditor }) => {
      const lang = activeLangRef.current;
      onValueChange({
        ...valueObjRef.current,
        [lang]: currentEditor.getHTML(),
      });
    },
  });

  React.useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  React.useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = valueObj[activeLang] || "";
    const normalizedCurrent = extractText(editor.getHTML());
    const normalizedNext = extractText(nextContent);

    if (normalizedCurrent !== normalizedNext) {
      editor.commands.setContent(nextContent || "<p></p>", { emitUpdate: false });
    }
  }, [editor, activeLang, valueObj]);

  return (
    <Box>
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        {[1, 2, 3, 4].map((level) => (
          <IconButton
            key={level}
            size="small"
            disabled={disabled || !editor?.can().chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()}
            onClick={() => editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()}
            sx={{ fontSize: 13, fontWeight: 700 }}
          >
            h{level}
          </IconButton>
        ))}
        <IconButton
          size="small"
          disabled={disabled || !editor?.can().chain().focus().toggleBold().run()}
          color={editor?.isActive("bold") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <FormatBoldIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          disabled={disabled || !editor?.can().chain().focus().toggleItalic().run()}
          color={editor?.isActive("italic") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          disabled={disabled || !editor?.can().chain().focus().toggleBulletList().run()}
          color={editor?.isActive("bulletList") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          disabled={disabled || !editor?.can().chain().focus().toggleOrderedList().run()}
          color={editor?.isActive("orderedList") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          disabled={disabled || !editor?.can().chain().focus().toggleBlockquote().run()}
          color={editor?.isActive("blockquote") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box
        sx={{
          border: "1px solid",
          borderColor: errorText ? "error.main" : "divider",
          borderRadius: 1,
          minHeight: 140,
          px: 1.5,
          py: 1.2,
          "& .tiptap-content": {
            minHeight: 110,
            outline: "none",
            lineHeight: 1.5,
          },
          "& .tiptap-content p": {
            margin: 0,
          },
          "& .tiptap-content h1": {
            fontSize: "2rem",
            fontWeight: 700,
            margin: "0.5rem 0",
          },
          "& .tiptap-content h2": {
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: "0.5rem 0",
          },
          "& .tiptap-content h3": {
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: "0.5rem 0",
          },
          "& .tiptap-content h4": {
            fontSize: "1.1rem",
            fontWeight: 700,
            margin: "0.5rem 0",
          },
          "& .tiptap-content strong, & .tiptap-content b": {
            fontWeight: 700,
          },
          "& .tiptap-content em, & .tiptap-content i": {
            fontStyle: "italic",
          },
          "& .tiptap-content ul": {
            margin: "0.5rem 0",
            paddingLeft: "1.4rem",
            listStyleType: "disc",
          },
          "& .tiptap-content ol": {
            margin: "0.5rem 0",
            paddingLeft: "1.4rem",
            listStyleType: "decimal",
          },
          "& .tiptap-content li": {
            display: "list-item",
            margin: "0.2rem 0",
          },
          "& .tiptap-content ul ul": {
            listStyleType: "circle",
          },
          "& .tiptap-content blockquote": {
            borderLeft: "3px solid #d1d5db",
            margin: "0.5rem 0",
            paddingLeft: "0.8rem",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {(errorText || helperText) && (
        <Typography variant="caption" color={errorText ? "error.main" : "text.secondary"}>
          {errorText || helperText}
        </Typography>
      )}
    </Box>
  );
}

export function MultiLangTiptap<T extends FieldValues>({
  control,
  name,
  languages,
  defaultLang,
  isRequired = true,
  label,
  helperText,
  disabled = false,
}: MultiLangTiptapProps<T>) {
  const requiredLang = languages.find((l) => l.required)?.code || defaultLang;

  const [activeLang, setActiveLang] = React.useState<string>(defaultLang || languages[0]?.code);

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
          if (!isRequired) {
            return true;
          }
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

        return (
          <Box>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" fontWeight={600}>
                  {label ?? String(name)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filledCount}/{languages.length} შევსებულია
                </Typography>
              </Stack>

              {isRequired ? <Chip size="small" variant="outlined" label={"Required: " + requiredLang.toUpperCase()} /> : null}
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
                          <Icon fontSize="small" style={{ color: filled ? "green" : "red" }} />
                        </Tooltip>
                      </Stack>
                    }
                  />
                );
              })}
            </Tabs>

            <TiptapField
              activeLang={activeLang}
              valueObj={valueObj}
              disabled={disabled}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              errorText={fieldState.error?.message}
              helperText={helperText}
            />
          </Box>
        );
      }}
    />
  );
}


