import React, { useState, useEffect, Suspense } from "react"
import { useSelector } from "react-redux";
import { currentUserSelector } from "redux/selectors";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';
import GridData from "components/GridData";
import useQuery from "hooks/useQueryCustom";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import MainConatiner from "partials/Container";
import { isEmpty } from "lodash";

const MenuControl = () => {
    const history = useHistory();
    const currentUser = useSelector(currentUserSelector);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            filterable: false,
            sortable: false,
            width: 50
        },
        {
            field: 'name',
            headerName: 'დასახელება',
            width: 300
        },
        {
            field: 'subs',
            headerName: 'ქვე განყოფილებები',
            flex: 1,
            renderCell: (params: any) => (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 8,
                    flexWrap: 'wrap',
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
               {renderItems(params?.row?.sub_menus)}
            </div>
        ),
        },
    ];


    const renderItems = (items: any) => {
        if(isEmpty(items)) return <span style={{color: '#999'}}>ქვე განყოფილებები არ არის</span>
        return items.map((item: any, idx: number) => (
            <span
                key={item.id}
                style={{ display: 'inline-block', maxWidth: '100%', whiteSpace: 'normal', wordBreak: 'break-word' }}
            >
                {(item?.name?.length > 20 ? `${item.name.slice(0, 20)}...` : item?.name)}{idx < items.length - 1 ? ", " : ""}
            </span>
        ));
    }

    const { data: item = [], isLoading } = useQuery<any>(["get_web_menus"], {
        endpoint: `/menus`,
        options: { method: "get" },
    }, { enabled: true });



    return (
        <MainConatiner 
            title="მენიუს კონტროლი" 
            button={
                <LoadingButton 
                    disabled={isLoading} 
                    variant="contained" 
                    size="small"
                    className="caps"
                    onClick={() => history.push('/menu-control/create')}
                    >მენიუს დამატება</LoadingButton>
                }  
        >
            <GridData
                list={item?.data || []}
                loading={isLoading}
                columns={columns}
                selection={false}
                onRowDoubleClick={(e: any) => history.push(`/menu-control/${e.id}`)}
            />
        </MainConatiner>
    )
}
export default MenuControl;

