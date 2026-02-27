import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Provider } from "react-redux";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyles from "./assets/global-style";
import { theme, colors } from './theme';
import Routes from './containers/route';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import moment from 'moment';
import 'moment/locale/ka' 
import { useJsApiLoader } from '@react-google-maps/api';
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastProvider } from 'react-toast-notifications';
import CustomToast from "./components/Toast";

const App = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAUSPHpWNaK448UlErp9KVzIRB6gKZ2cm8'
    });

    const queryClient = new QueryClient();

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <StyledThemeProvider theme={colors}>
                    <ToastProvider placement='top-center' components={{ Toast: CustomToast }}>
                        <Provider store={store}>
                            <GlobalStyles />
                            <QueryClientProvider client={queryClient}>
                                    <Routes />
                                    <Toaster />
                            </QueryClientProvider>
                        </Provider>
                    </ToastProvider>
                </StyledThemeProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
export default App;
