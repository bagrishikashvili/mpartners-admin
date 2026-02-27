import { useState, Fragment, useEffect, forwardRef, Ref } from 'react';
import Autocomplete, { autocompleteClasses, AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Popper from '@mui/material/Popper'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import { default as styledComp } from 'styled-components';
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow.svg';
import { ReactComponent as CloseIcon } from 'assets/svg/close-x.svg';
import { ReactComponent as PlusIcon } from 'assets/svg/plus.svg';
import { useTranslation } from "react-i18next";
import { AxiosResponse } from 'axios';

interface ISelectDropdown<
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
> extends Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>> {
    inputPlaceholder?: string,
    loadRemoteData?: () => Promise<AxiosResponse<any>>,
    withPic?: boolean,
    errorText?: string | any,
    label?: string,
    required?: boolean,
    onAddItem?: () => void,
};

const StyledOption = styledComp.p`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const StyledAddOption = styledComp.p`
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #339966;
    font-size: 14px;
    background-color: #FFF;
    height: 40px;
    padding: 0 13px;
    cursor: pointer;
    border-top: 1px solid #D6D6D6;
    &:hover {
        background-color: #DCEEE5;
    }
`;

const StyledInputLabel = styledComp(InputLabel)`
    color: #000;
    margin-bottom: 5px;
    & > sup {
        color: #C54343;
    }
`;
// @ts-ignore Comment
const StyledAutocomplete: typeof Autocomplete = styled(Autocomplete)`
    .${autocompleteClasses.popupIndicator} {
        background-color: transparent;
    }
    .${autocompleteClasses.clearIndicator} {
        background-color: transparent;
        visibility: visible;
    }
    .${autocompleteClasses.endAdornment} {
        margin: 4px 4px;
    }
    .${autocompleteClasses.inputRoot} {
        background-color: #FFF;
        color: #00101A;
        height: 50px;
        & .MuiOutlinedInput-notchedOutline {
            /* border-color: #D6D6D6; */
        }
        &:hover .MuiOutlinedInput-notchedOutline {
            border-color: #F3742D;
        }
        &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border: 1px solid #F3742D;
        }
         &.Mui-disabled .MuiOutlinedInput-notchedOutline {
            border: 1px solid #D6D6D6;
        }
    }
`;

const StyledAutocompletePopper: any = styled(Popper)`
    & .${autocompleteClasses.paper} {
        margin-top: 2px;
    }
    & .${autocompleteClasses.listbox} {
        padding: 0 0;
        background-color: #FFF;
    }
    & .${autocompleteClasses.option} {
        color: #00101A;
        font-size: 14px;
        background-color: #FFF;
        height: 40px;
        &:hover, &.Mui-focused{
            color: #000;
            background-color: rgba(243, 116, 45, 0.08);
        }
        &[aria-selected="true"] {
            background-color: transparent;
        }
    }
`;

const CustomPaperComponent = ({ onClick, children, ...rest }: any) => {
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'components.autocomplete' });
    return (
        <Paper {...rest}>
            {children}
            <StyledAddOption onMouseDown={(e: any) => e.preventDefault()} onClick={onClick}>
                <PlusIcon style={{ marginRight: 8 }} />{t('add_item')}
            </StyledAddOption>
        </Paper>
    );
};

const MultiSelect = forwardRef(function MultiSelect<
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
>(props: ISelectDropdown<T, Multiple, DisableClearable, FreeSolo>, ref: Ref<unknown>) {
    const {
        inputPlaceholder = 'No Selection',
        loadRemoteData,
        errorText,
        options: staticOptions,
        withPic,
        freeSolo,
        size = 'medium',
        open: openFromProps,
        label,
        required,
        onAddItem,
        ...rest
    } = props;

    const [open, setOpen] = useState<boolean | undefined>(openFromProps ?? false);
    const [options, setOptions] = useState<T[]>([]);
    const loading = open && loadRemoteData && options.length === 0;
    const [reqLoading, setReqLoading] = useState<boolean>(false);

    useEffect(() => {
        let active = true;
        if (loadRemoteData) {
            if (!loading) return undefined;
            (async () => {
                setReqLoading(true);
                const res: any = await loadRemoteData?.();
                setReqLoading(false);
                if (active && res) {
                    setOptions([...res.data.list]);
                }
            })();
        }
        return () => { active = false; }
    }, [loadRemoteData, loading]);

    useEffect(() => {
        if (!open) setOptions([]);
    }, [open]);

    return (
        <Fragment>
            {label ? <StyledInputLabel>{label}{required && <sup>*</sup>}</StyledInputLabel> : null}
            <StyledAutocomplete
                size={size}
                isOptionEqualToValue={(option: any, value: any) => option.name !== value.id}
                getOptionLabel={!freeSolo ? (option: any) => option.name ?? option :
                    (option: any) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.name;
                    }
                }
                onKeyDown={(event: any) => {
                    if (event.key === 'Enter') {
                        setOpen(true);
                    }
                }}
                open={open}
                options={loadRemoteData ? options : staticOptions || []}
                onOpen={() => openFromProps === true || openFromProps === false ? null : setOpen(true)}
                onClose={() => openFromProps === true || openFromProps === false ? null : setOpen(false)}
                loading={loading && reqLoading}
                id="select_dropdown"
                handleHomeEndKeys
                forcePopupIcon
                fullWidth
                autoHighlight
                PopperComponent={StyledAutocompletePopper}
                PaperComponent={freeSolo ? CustomPaperComponent : Paper}
                componentsProps={{ paper: { onClick: freeSolo ? onAddItem : () => null } }}
                popupIcon={<ArrowIcon />}
                clearIcon={<CloseIcon />}
                renderOption={(props: any, option: any, value: any) => {
                    return (
                    <Box component="li" {...props} aria-selected={null} style={{ paddingLeft: 13 }} key={option.id ?? props.key}>
                        <StyledOption>{option.name}</StyledOption>
                    </Box>
                )}}
                freeSolo={freeSolo}
                renderInput={(params: any) => (
                    <TextField
                        error={errorText ? true : false}
                        helperText={errorText}
                        inputRef={ref}
                        {...params}
                        placeholder={inputPlaceholder}
                        FormHelperTextProps={{
                            style: {
                                marginLeft: 0,
                                marginTop: 5,
                                color: 'var(--red)',
                                fontSize: 12,
                                lineHeight: 'initial'
                            }
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading && reqLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            ),
                        }}
                    />
                )}
                {...rest}
            />
        </Fragment>
    )
});

export default MultiSelect;