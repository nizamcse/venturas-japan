import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, orange } from '@mui/material/colors';
import { AuthProvider } from './context/AuthContext';
import Main from './Main';

const theme = createTheme({
    palette: {
        primary: {
            main: orange[500],
        },
        secondary: {
            main: green[500],
        },
    },
});
const App = () => (
    <ThemeProvider theme={theme}>
        <AuthProvider>
            <Router>
                <Main />
            </Router>
        </AuthProvider>
    </ThemeProvider>
);
export default App;
