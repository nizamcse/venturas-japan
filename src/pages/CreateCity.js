/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Button,
    Typography,
    Box,
    TextField,
    CircularProgress,
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

const CreateCity = () => {
    const { state } = useLocation();
    const Navigate = useNavigate();
    const classes = useStyles();
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [cityName, setcityName] = useState('');
    const onCreateCity = async () => {
        setLoading(true);
        try {
            await axios.post(
                'https://evening-taiga-21552.herokuapp.com/api/cities',
                {
                    name: cityName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Navigate('/');
        } catch (err) {
            const message = err?.response?.data || err?.message;
            setFormError(message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    const onUpdateCity = async () => {
        setLoading(true);
        try {
            await axios.patch(
                `https://evening-taiga-21552.herokuapp.com/api/cities/${state._id}`,
                {
                    name: cityName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Navigate('/');
        } catch (err) {
            const message = err?.response?.data || err?.message;
            setFormError(message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state?.name) {
            setcityName(state.name);
        }
    }, [state]);

    return (
        <Box sx={style}>
            <Box pb={8}>
                <Typography variant="h6" gutterBottom component="h6">
                    {state?._id ? 'UPDATE CITY' : 'CREATE NEW CITY'}
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
                    if (state?._id) onUpdateCity();
                    else onCreateCity();
                }}
            >
                <div>
                    <TextField
                        autoComplete="off"
                        size="small"
                        fullWidth
                        label="City Name"
                        id="name"
                        sx={{ mb: 4 }}
                        onChange={(e) => setcityName(e.target.value)}
                        value={cityName}
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
                        {state?._id ? 'UPDATE' : 'SAVE'}
                        {loading && <CircularProgress size={24} />}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateCity;
