import { useHistory } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import MainConatiner from 'partials/Container';
import GridData from 'components/GridData';
import useQuery from 'hooks/useQueryCustom';

const NewsList = () => {
    const history = useHistory();

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            filterable: false,
            sortable: false,
            width: 60,
        },
        {
            field: 'title_ka',
            headerName: 'სათაური',
            flex: 1,
            renderCell: (params: any) => params?.row?.title?.ka || params?.row?.title?.en || '-',
        },
        {
            field: 'sort_order',
            headerName: 'პოზიცია',
            width: 120,
        },
        {
            field: 'is_active',
            headerName: 'აქტიურია',
            width: 120,
            renderCell: (params: any) => (params?.row?.is_active ? 'კი' : 'არა'),
        },
    ];

    const { data: item = [], isLoading } = useQuery<any>(
        ['get_news_admin_list'],
        {
            endpoint: '/news/admin',
            options: { method: 'get' },
        },
        { enabled: true }
    );

    return (
        <MainConatiner
            title='სიახლეები'
            button={
                <LoadingButton
                    variant='contained'
                    size='small'
                    className='caps'
                    onClick={() => history.push('/news/create')}
                >
                    სიახლის დამატება
                </LoadingButton>
            }
        >
            <GridData
                list={item?.data || []}
                loading={isLoading}
                columns={columns}
                selection={false}
                onRowDoubleClick={(e: any) => history.push(`/news/${e.id}`)}
            />
        </MainConatiner>
    );
};

export default NewsList;
