import React, { useState, useEffect } from "react";
import { 
    DataGrid,
    GridColDef, 
    GridValueGetterParams, 
    GridToolbarContainer, 
    GridToolbarQuickFilter,
    useGridApiContext,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridPreferencePanelParams,
    gridClasses
    
} from '@mui/x-data-grid';
import { isEmpty } from "lodash";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import { dataGridLocale } from "lib/dataGridLocales";
import { useTranslation } from "react-i18next";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const GridData = ({list, columns, selection, loading, onChangeRow, onRowDoubleClick, ...rest}: any) => {
    const { t, i18n } = useTranslation();
    return (
        <Box sx={actionButtonsStyle}>
        <StyledDataGrid
            rows={list ? list : []}
            columns={columns ? columns : []}
            getRowId={(row: any) => row.id}
            checkboxSelection={selection ? true : false}
            onRowSelectionModelChange={(e) => selection ? onChangeRow(e) : null}
            disableRowSelectionOnClick
            hideFooter={true}
            loading={loading}
            hideFooterPagination
            rowHeight={60}
            onRowDoubleClick={(e: any) => onRowDoubleClick ? onRowDoubleClick(e) : null}
            autoHeight={true}
            localeText={dataGridLocale(t, i18n)}
            slots={{
                loadingOverlay: LinearProgress,
            }}
            {...rest}
        />
        </Box>
    )
}
const actionButtonsStyle = {
    '& .approveButton': {
        display: 'block',
    },
    [`& .${gridClasses.row}:hover`]: {
        '.actionButton': {
            display: 'flex',
        },
    },
};
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    backgroundColor: '#fff',
    '.MuiDataGrid-toolbarContainer': {
        backgroundColor: "#000"

    },
    '.MuiDataGrid-cell': {
        borderBottom: '1px solid #F8F8F8',
        fontSize: 13,
        fontFamily: 'BPG Arial'
    },
    '.MuiDataGrid-columnHeaderTitle': {
        fontFamily: 'BPG Arial Caps',
        fontWeight: 'bold'
    },
    '& .status-booked': {
        backgroundColor: '#b3ebcf',
        '&:hover': {
            backgroundColor: '#9acbb3',
        }
    }
}));


export default GridData;