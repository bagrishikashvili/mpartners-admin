import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';


export interface IDialogProps extends DialogProps {
    nominalHeader?: JSX.Element,
    title?: string,
    withButtons?: boolean
    withoutHeader?: boolean
    actionLoading?: boolean,
    contentLoading?: boolean,
    actionButtonText?: string,
    actionButtonDisabled?: boolean,
    cancelButtonText?: string,
    actionButton?: () => void,
    hideActionButton?: boolean,
    hideCancelButton?: boolean,
    actionButtonTooltipText?: string,
    upperPosition?: boolean,
    preDefinedPadding?: boolean,
    customFooter?: JSX.Element | null,
    smallButton?: boolean
};

export default function DialogModal({
    children,
    nominalHeader,
    title,
    withButtons,
    withoutHeader,
    actionLoading,
    contentLoading,
    actionButtonText = 'SAVE',
    actionButtonDisabled,
    cancelButtonText = 'CANCEL',
    actionButton,
    hideActionButton,
    hideCancelButton,
    actionButtonTooltipText = '',
    smallButton,
    onClose,
    upperPosition,
    preDefinedPadding = true,
    customFooter = null,
    ...rest
}: PropsWithChildren<IDialogProps>) {

    return (
        <div>
            <Dialog
                scroll="paper"
                onClose={onClose}
                sx={{
                    '& .MuiDialog-scrollPaper': { display: 'flex', alignItems: upperPosition ? 'flex-start' : 'center', paddingTop: upperPosition ? 10 : 0 },
                    '& .MuiDialog-paperScrollBody': { display: 'flex', alignItems: upperPosition ? 'flex-start' : 'center', paddingTop: upperPosition ? 10 : 0 }
                }}
                
                {...rest}
            >
                {withoutHeader ? null : <StyledDialogTitle>
                    <MainDialogTitle>
                        {title}<StyledCloseIcon onClick={(e: any) => onClose?.(e, 'escapeKeyDown')} />
                    </MainDialogTitle>
                    {nominalHeader}
                </StyledDialogTitle>}
                <DialogContent sx={{ padding: preDefinedPadding ? '16px 24px' : 0 }} dividers={true}>
                    <Wrapper>
                        {
                            contentLoading ? 
                                <center>
                                    <CircularProgress size={30} thickness={3} />
                                </center>
                            : 
                            children
                        }
                    </Wrapper>
                </DialogContent>
                {customFooter}
                {withButtons ? <DialogActions>
                    {hideCancelButton ? null : <div style={{ minWidth: 117, marginRight: 4 }}>
                        <Button
                            tabIndex={1}
                            onClick={(e) => onClose?.(e, 'escapeKeyDown')}
                            fullWidth
                            size='small'
                            disabled={actionLoading}
                        >
                            {cancelButtonText}
                        </Button>
                    </div>}
                    {hideActionButton ? null : <div style={{ minWidth: 117 }}>
                        <Tooltip title={actionButtonTooltipText} placement="top" arrow><div>
                            <LoadingButton
                                tabIndex={0}
                                type="submit"
                                disabled={actionButtonDisabled}
                                onClick={() => actionButton?.()}
                                fullWidth
                                size='small'
                                variant='contained'
                                loading={actionLoading}
                            >
                                {actionButtonText}
                            </LoadingButton>
                        </div></Tooltip>
                    </div>}
                </DialogActions> : null}
            </Dialog>
        </div>
    );
};

const StyledDialogTitle = styled(DialogTitle)`
    display: flex;
    flex-direction: column;
    padding: 0;
`;

const MainDialogTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 54px;
    padding: 0 20px;
    background-color: #fff;
    color: #1E2932;
    font-size: 14px;
    font-weight: 400;
    font-feature-settings: "case";
    & > svg {
        margin-left: auto;
    };
`;

const StyledCloseIcon = styled(CloseIcon)`
    cursor: pointer;
    path {
        fill: #7f8c8d;
    }
`;
const Wrapper = styled.div`

`;
