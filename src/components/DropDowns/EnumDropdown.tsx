import React, {useState, useMemo} from 'react';
import { PropsWithChildren } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectProps } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import styled from '@mui/system/styled';
import { default as styledComp } from 'styled-components';
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow.svg';
import { ReactComponent as CloseIcon } from 'assets/svg/close-x.svg';
import { useTranslation } from "react-i18next";
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';

type TOption = {
    id: number,
    name: string | undefined,
    id_name: string
};


// @ts-ignore Comment
const StyledSelect: typeof Select = styled(Select) <{ error: boolean }>`
    & .MuiOutlinedInput-notchedOutline {
        border-color: #D6D6D6;
    }
    &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${({ error }) => error ? 'var(--red)' : '#f04d28'};
    }
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border: ${({ error }) => error ? '1px solid var(--red)' : '1px solid #f04d28'};
    }
`;

const CustomListSubheader = styled(ListSubheader)({
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 3
  });
// @ts-ignore Comment
const StyledMenuItem: typeof MenuItem = styled(MenuItem)`
    color: #00101A;
    font-size: 14px;
    background-color: #FFF;
    height: 40px;
    &:hover, &:focus {
        color: #f04d28;
        background-color: rgba(243, 116, 45, 0.08);
    }
`;

const MenuProps = {
    autoFocus: false,
    PaperProps: {
        style: {
            padding:0,
            boxShadow: '0px 3px 6px #00000029',
            border: '1px solid #D6D6D6',
            borderRadius: 4,
            marginTop: 2,
            maxHeight: '35%',
        },
    },
    MenuListProps: {
        style: {
            padding: 0,
            backgroundColor: '#FFF',
        }
    },
};

const StyledHelperText = styled(FormHelperText)`
    color: var(--red);
    font-size: 12px;
    display: inline-block;
    margin-left: 0px;
`;

const CloseIconContainer = styledComp.div`
    position: absolute;
    right: 31px;
    bottom: 11px;
    cursor: pointer;
`;

function EnumDropdown({
    onChange,
    value,
    options,
    errorText,
    placeholder = '',
    size = 'small',
    children,
    searchable,
    $showClearIcon = true,
    ...rest
}: PropsWithChildren<any>) {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState<string>("");
  
    const containsText = (text: any, searchText: string) => text?.name?.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    const displayedOptions = options.filter((option: any) => containsText(option, searchText))
      
    return (
        <FormControl fullWidth error={errorText ? true : false}>
            {!value &&
                <InputLabel
                    style={{ color: '#9C9C9C', top: size === 'small' ? -5 : 0 }}
                    shrink={false}
                    id="enum-select-label-placeholder">
                    {placeholder}
                </InputLabel>}
            <StyledSelect
                size={size}
                labelId="enum-select"
                id="enum-select"
                value={value}
                onChange={onChange}
                onClose={() => {
                    setSearchText("")
                }}
                fullWidth
                MenuProps={MenuProps}
                IconComponent={(props: any) => <ArrowIcon {...props} style={{ marginRight: 7.8, marginTop: 1 }} />}
                error={!!errorText}
                {...rest}
            >
                {searchable && <CustomListSubheader>
                    <TextField
                        size="small"
                        placeholder="ძებნა..."
                        fullWidth
                        autoFocus
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== "Escape") {
                              e.stopPropagation();
                            }
                         }}
                    />
                </CustomListSubheader>}
                {children ? children : displayedOptions.map((option: TOption) => {
                    return (
                        <StyledMenuItem key={option.id} value={option.id}>{option.name}</StyledMenuItem>
                    )
                })}
            </StyledSelect>
            
            {value && $showClearIcon ? <CloseIconContainer
                style={{ bottom: size === 'small' ? (value && errorText ? 32.5 : 9.5) : (value && errorText ? 37.5 : 14.5) }}
                onClick={() => onChange?.({ target: { value: '' } } as any, {})}
        
            >
                <CloseIcon />
            </CloseIconContainer> : null}
            {errorText ? <StyledHelperText error>{errorText}</StyledHelperText> : null}
        </FormControl>
    )
};

export default EnumDropdown;