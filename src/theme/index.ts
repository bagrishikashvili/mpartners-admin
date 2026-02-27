import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { } from '@mui/lab/themeAugmentation';
import { t } from 'i18next';

export const colors: Record<string, any> = {
    colors: {
        primary: {
            green: '#ef4044',
            white: '#FFFFFF',
            black: '#00101A',
            red: '#F46A6A',
            gray: '#9C9C9C',
            blue: '#172B37',
        },
        secondary: {
            darkenWhite: '#F8F8F7',
            lightGray: '#EEEEEE',
            lightRed: '#FDEDEE',
            darkenRed: '#C54343',
            lightGreen: '#EAF5EB',
            darkenGreen: '#1F6B45',
            successGreen: '#ef4044',
            lightOrange: '#FCF2E4',
            warningOrange: '#F4906A',
            bluePurple: '#6666FF',
            lightBluePurple: '#9999FF',
        }
    }
}

export const theme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ef4044',
        },
        secondary: {
            light: '#0066ff',
            main: '#0044ff',
            contrastText: '#ffcc00',
        },
        contrastThreshold: 3,
        tonalOffset: .3,
    },
    typography: {
        fontFamily: ['Plus Jakarta Sans', 'BPG Arial', 'Helvetica', 'sans-serif'].join(','),
    },
    zIndex: {
        modal: 999,
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiButton: {
            defaultProps: {
                disableRipple: false,
                disableElevation: true,
                disableFocusRipple: true,
                disableTouchRipple: true,
            },
            variants: [
                {
                    props: { size: 'medium' },
                    style: {
                        height: 45,
                        marginTop: 0,
                        backgroundColor: '#ee3942',
                        color: '#fff',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        textTransform: 'inherit',
                        fontSize: 13,
                        '&:hover': { backgroundColor: '#ee3942' },
                        '&:focus': { backgroundColor: '#ee3942' },
                    },
                },
                {
                    props: { size: 'large' },
                    style: {
                        height: 50,
                        marginTop: 0,
                        backgroundColor: '#ee3942',
                        color: '#fff',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        textTransform: 'inherit',
                        fontSize: 13,
                        '&:hover': { backgroundColor: '#ee3942' },
                        '&:focus': { backgroundColor: '#ee3942' },
                    },
                },
                {
                    props: { size: 'small' },
                    style: {
                        height: 37,
                        marginTop: 0,
                        backgroundColor: '#ee3942',
                        color: '#fff',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        textTransform: 'inherit',
                        fontSize: 12,
                        '&:hover': { backgroundColor: '#ee3942' },
                        '&:focus': { backgroundColor: '#ee3942' },
                    },
                },
                {
                    props: { variant: 'text' },
                    style: {
                        backgroundColor: 'transparent',
                        color: '#6666FF',
                        fontFamily: 'inherit',
                        fontWeight: 'inherit',
                        textTransform: 'inherit',
                        '&:focus, &:hover': { backgroundColor: 'transparent', color: '#6666FF', textDecoration: 'underline' },
                    }
                },
                {
                    props: { variant: 'outlined' },
                    style: {
                        height: 38,
                        marginTop: 0,
                        backgroundColor: '#1b5a93',
                        borderColor: '#1b5a93',
                        color: '#fff',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        textTransform: 'inherit',
                        '&:hover': { backgroundColor: '#1b5a93', borderColor: '#1b5a93' },
                        '&:focus': { backgroundColor: '#1b5a93', borderColor: '#1b5a93' },
                    },
                },
            ],
        },
        MuiLoadingButton: {
            styleOverrides: {
                loadingIndicator: {
                    color: '#FFF',
                },
                root: {
                    '&.MuiLoadingButton-loading': {
                        backgroundColor: '#D6D6D6',
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    transition: 'none !important',
                    boxShadow: '0px 3px 6px #00000029',
                    border: '1px solid #D6D6D6',
                },
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: '0 0',
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: '#00101A',
                    height: 40,
                    "&:hover, &.Mui-focused, &:focus": {
                        color: "#000",
                        backgroundColor: "rgba(243, 116, 45, 0.08)"
                    }
                }
            }
        },
        MuiSelect: {
            variants: [
                {
                    props: { size: 'medium' },
                    style: {
                        height: '50px',
                        backgroundColor: '#FFF'
                    },
                },
                {
                    props: { size: 'small' },
                    style: {
                        height: '40px',
                        backgroundColor: '#FFF'
                    }
                }
            ],
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: 12,
                    fontWeight: 'inherit',
                    backgroundColor: '#6C787F',
                    color: '#FFF',
                    padding: '8px 10px',
                },
                arrow: {
                    color: '#6C787F',
                }
            },
            defaultProps: {
                arrow: true,
                placement: 'bottom-start'
            }
        },
        MuiTextField: {
            variants: [
                {
                    props: { size: 'medium' },
                    style: {
                        '& .MuiInputBase-root': {
                            height: 50
                        }
                    },
                },
                {
                    props: { size: 'small' },
                    style: {
                        '& .MuiInputBase-root': {
                            height: 40
                        }
                    }
                }
            ],
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#D6D6D6'
                        },
                        '&:hover fieldset': {
                            borderColor: '#ef4044'
                        },
                        '&.Mui-focused fieldset': {
                            border: '1px solid #ef4044'
                        }
                    }
                }
            }
        },
        MuiInputBase: {
            variants: [
                {
                    props: { size: 'medium' },
                    style: {
                        height: 50
                    },
                },
                {
                    props: { size: 'small' },
                    style: {
                        height: 40
                    }
                }
            ],
        },
        MuiDialog: {
            defaultProps: {
                onClick: (e) => e.stopPropagation(),
                BackdropProps: {
                    sx: {
                        pointerEvents: 'none',
                    },
                },
            },
            styleOverrides: {
                paper: {
                    border: 0,
                },
                container: {
                    backgroundColor: 'rgba(0,0,0, .1)'
                }
            }
        },
        MuiModal: {
            defaultProps: {
                onClick: (e) => e.stopPropagation(),
                BackdropProps: {
                    sx: {
                        pointerEvents: 'none',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    transition: 'none !important',
                    boxShadow: '0px 0px 0px #00000029',
                    borderColor: '#eed7d7'
                },
            }
        }
    }
}));