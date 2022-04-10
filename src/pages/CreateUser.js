/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Button,
    Typography,
    Box,
    TextField,
    CircularProgress,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const style = {
    width: 460,
    maxWidth: '100%',
    bgcolor: 'background.paper',
    p: 4,
    backgroundColor: '#FFFFFF',
    margin: '0 auto',
};
const useStyles = makeStyles({
    underlineShort: {
        width: 75,
        height: 2,
        backgroundColor: '#03A9F4',
    },
    root: {
        color: '#FFFFFF',
    },
    errorText: {
        color: 'red',
        margin: '16px 0',
    },
});

const CreateUser = () => {
    const { state } = useLocation();
    const Navigate = useNavigate();
    const classes = useStyles();
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userType, setUserType] = useState('ADMIN');
    const [validationError, setValidationError] = useState({
        name: '',
        email: '',
    });
    const onCreateUser = async () => {
        setLoading(true);
        try {
            const user = await axios.post(
                'https://evening-taiga-21552.herokuapp.com/api/users/signup',
                {
                    name: userName,
                    email: userEmail,
                    userType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Navigate('/users', {
                state: { user: user.data.user, password: user.data.password },
            });
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response.message ||
                err.toString();
            setFormError(message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    const onUpdateUser = async () => {
        setLoading(true);
        try {
            await axios.patch(
                `https://evening-taiga-21552.herokuapp.com/api/users/update/${state._id}`,
                {
                    name: userName,
                    email: userEmail,
                    userType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Navigate('/users');
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response.message ||
                err.toString();
            setFormError(message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state?._id) {
            setUserName(state.name);
            setUserEmail(state.email);
            setUserType(state.userType);
        }
    }, [state]);

    const validateMail = (email) => {
        return email.match(
            // eslint-disable-next-line no-useless-escape
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validateName = (name) => name?.length >= 3;

    const onChangeEmail = (e) => {
        const email = e.target.value;
        if (!validateMail(email)) {
            setValidationError({
                ...validationError,
                email: 'Please enter valid email.',
            });
        } else setValidationError({ ...validationError, email: '' });
        setUserEmail(email);
    };

    const onChangeName = (e) => {
        const name = e.target.value;
        if (!validateName(name))
            setValidationError({
                ...validationError,
                name: 'Name should be at least 3 character.',
            });
        else setValidationError({ ...validationError, name: '' });
        setUserName(name);
    };

    const onChangeUserType = (event) => {
        setUserType(event.target.value);
    };

    return (
        <Box sx={style}>
            <Box pb={8}>
                <Typography variant="h6" gutterBottom component="h6">
                    {state?._id ? 'UPDATE USER' : 'CREATE NEW USER'}
                </Typography>
                <div className={classes.underlineShort} />
                {formError && (
                    <Box>
                        {' '}
                        <Typography className={classes.errorText}>
                            {formError}
                        </Typography>
                    </Box>
                )}
            </Box>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (state?._id) onUpdateUser();
                    else onCreateUser();
                }}
            >
                <div>
                    <TextField
                        error={validationError.name?.length > 0}
                        autoComplete="off"
                        size="small"
                        fullWidth
                        label="User Name"
                        id="name"
                        sx={{ mb: 4 }}
                        onChange={onChangeName}
                        value={userName}
                        helperText={validationError.name || ''}
                    />
                </div>
                <div>
                    <TextField
                        error={validationError.email?.length > 0}
                        autoComplete="off"
                        size="small"
                        fullWidth
                        label="Email"
                        id="email"
                        sx={{ mb: 4 }}
                        onChange={onChangeEmail}
                        value={userEmail}
                        helperText={validationError.email || ''}
                    />
                </div>
                <div>
                    <FormControl>
                        <FormLabel id="user-type">User Type</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="user-type"
                            name="user_type"
                            value={userType}
                            onChange={onChangeUserType}
                        >
                            <FormControlLabel
                                value="ADMIN"
                                control={<Radio />}
                                label="Admin"
                            />
                            <FormControlLabel
                                value="OPERATOR"
                                control={<Radio />}
                                label="Operator"
                            />
                        </RadioGroup>
                    </FormControl>
                </div>

                <Box mt={4}>
                    <Button
                        type="submit"
                        classes={{ root: classes.root }}
                        fullWidth
                        variant="contained"
                        component="button"
                    >
                        {state?._id ? 'UPDATE' : 'CREATE'}
                        {loading && <CircularProgress size={24} />}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateUser;
