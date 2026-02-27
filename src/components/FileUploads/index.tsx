'use client';
import styled from 'styled-components';
import React, { useState, useRef } from 'react';
import { isEmpty } from "lodash";
import { ReactComponent as Plusicon } from 'assets/svg/plus.svg';
import Popover from '@mui/material/Popover';
interface PropsStyle {
    $error: boolean;
}


const UploadInput = styled.div<PropsStyle>  `
    display: flex;
    justify-content: center;
    align-items: center;
    border: ${props => props.$error ? '1px dashed red' : '1px dashed rgba(243, 116, 45, .1)'};
    background-color: rgba(243, 116, 45, .1);
    width: 80px;
    height: 80px;
    border-radius: 8px;
    cursor: pointer;
    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 8px;
    }
    @media (max-width: 768px) {
        flex-direction: column;
    }
`


const FileUploads = ({ onChange, errorText, label}: any) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<any>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = () => {
        if (hiddenFileInput.current !== null) {
            hiddenFileInput.current.click();
        }
    };

    const handleFileIniputChange = async (event: any) => {
        if(event.target.files.length !== 0){
            const file = event.target.files[0];
            let reader = new FileReader();
            reader.onload = (e: any) => {
                file.base64 = e.target.result;
            };
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFile(file);
                onChange(file);
            }
        }
    };

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <UploadInput 
            onClick={() => handleClick()} 
            $error={errorText ? true : false}
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
        >
            {isEmpty(file) && <Plusicon/>}
            {
                !isEmpty(file) && 
                <img
                    srcSet={`${file?.base64}`}
                    src={`${file?.base64}`}
                    alt={'image'}
                    loading="lazy"
                />
            }
            <input 
                type="file" 
                name="file" 
                ref={hiddenFileInput} 
                onChange={handleFileIniputChange} 
                style={{display: 'none', position: 'absolute', top: 0, left: -100000}}
                accept="image/png, image/jpeg, image/jpg"
            />
            <Popover
            id="mouse-over-popover"
            sx={{
                pointerEvents: 'none',
            }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
                transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >{label}</Popover>
        </UploadInput>
        
    );
}

export default FileUploads;