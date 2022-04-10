import { useState, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    Typography,
    InputAdornment,
    TextField,
    IconButton,
    Button,
    CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLogin } from '../hooks/use-login';
import { AuthContext } from '../context/AuthContext';

const useStyles = makeStyles({
    loginCard: {
        backgroundColor: '#f5f5f5',
        padding: '64px 32px',
    },
    underlineShort: {
        width: 75,
        height: 2,
        backgroundColor: '#03A9F4',
    },
    root: {
        color: '#FFFFFF',
    },
    container: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        margin: '16px 0',
    },
});

const Login = () => {
    const navigate = useNavigate();
    const { setToken, setRole, setAuth } = useContext(AuthContext);
    const classes = useStyles();
    const [visibility, setVisibility] = useState(false);
    const { login } = useLogin();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangeEmail = (e) => setEmail(e.target.value || '');
    const onChangePassword = (e) => setPassword(e.target.value || '');

    const onClickVisibility = () => {
        setVisibility((prev) => !prev);
    };

    const onClickLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data) {
                localStorage.setItem('__authToken', data.token);
                localStorage.setItem('userType', data.user.userType);
                setToken(data.token);
                setAuth(true);
                setRole(data.user.userType);
                setError(null);
                setLoading(false);
                if (data.user.userType === 'ADMIN') navigate('/');
                else navigate('/my-account');
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className={classes.container}>
            <Box sx={{ width: 360, maxWidth: '100%' }}>
                <Card className={classes.loginCard} variant="outlined">
                    <Box pb={8}>
                        <Typography variant="h6" gutterBottom component="h3">
                            LOGIN TO CONTINUE
                        </Typography>
                        <div className={classes.underlineShort} />
                        <Box>
                            {error && (
                                <Typography className={classes.errorText}>
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <form onSubmit={(e) => onClickLogin(e)}>
                        <div>
                            <TextField
                                size="small"
                                fullWidth
                                label="Email"
                                id="email"
                                sx={{ mb: 4 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChangeEmail}
                            />
                        </div>
                        <div>
                            <TextField
                                autoComplete="off"
                                type={visibility ? 'text' : 'password'}
                                size="small"
                                fullWidth
                                label="password"
                                id="password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyIcon sx={{ fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={onClickVisibility}
                                                color="primary"
                                                aria-label="upload picture"
                                                component="span"
                                            >
                                                {visibility ? (
                                                    <VisibilityIcon
                                                        sx={{ fontSize: 18 }}
                                                    />
                                                ) : (
                                                    <VisibilityOffIcon
                                                        sx={{ fontSize: 18 }}
                                                    />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChangePassword}
                            />
                        </div>
                        <Box mt={4}>
                            <Button
                                type="submit"
                                classes={{ root: classes.root }}
                                fullWidth
                                variant="contained"
                                component="button"
                            >
                                Sign In
                                {loading && <CircularProgress size={24} />}
                            </Button>
                        </Box>
                    </form>
                </Card>
            </Box>
        </div>
    );
};

export default Login;
