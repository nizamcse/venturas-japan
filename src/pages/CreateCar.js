/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Button,
    Typography,
    Box,
    TextField,
    CircularProgress,
    Autocomplete,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useCityApi } from '../hooks/use-city-api';
import { useUserApi } from '../hooks/use-user-api';

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

const CreateCar = () => {
    const { state } = useLocation();
    const Navigate = useNavigate();
    const classes = useStyles();
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [carName, setCarName] = useState('');
    const [carModel, setCarModel] = useState('');
    const [user, setUser] = useState(null);
    const [city, setCity] = useState(null);
    const {
        users,
        error: userPullError,
        loading: userLoading,
    } = useUserApi(token);
    const {
        cities,
        error: cityPullError,
        loading: citiesLoading,
    } = useCityApi(token);

    const [validationError, setValidationError] = useState({
        name: '',
        model: '',
        modelNo: '',
        city: '',
        user: '',
    });

    const onCreateCar = async () => {
        setLoading(true);
        try {
            const car = await axios.post(
                'https://evening-taiga-21552.herokuapp.com/api/cars',
                {
                    name: carName,
                    modelNo: carModel,
                    user: user?._id,
                    city: city?._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Navigate('/cars', {
                state: { car: car.data.car, password: car.data.password },
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

    const onUpdateCar = async () => {
        setLoading(true);
        try {
            await axios.patch(
                `https://evening-taiga-21552.herokuapp.com/api/cars/${state._id}`,
                {
                    name: carName,
                    modelNo: carModel,
                    user: user?._id,
                    city: city?._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Navigate('/cars');
        } catch (err) {
            const message = err?.response?.data?.message || err.message;
            setFormError(message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state?._id) {
            setCarName(state.name);
            setCarModel(state.modelNo);
            setUser(state.user);
            setCity(state.city);
        }
    }, [state]);

    useEffect(() => {
        if (userPullError || cityPullError) {
            setFormError(userPullError || cityPullError);
        }
    }, [userPullError, cityPullError]);

    const validateName = (name) => name?.length >= 3;

    const onChangeName = (e) => {
        const name = e.target.value;
        if (!validateName(name))
            setValidationError({
                ...validationError,
                name: 'Name should be at least 3 character.',
            });
        else setValidationError({ ...validationError, name: '' });
        setCarName(name);
    };

    const onChangeModel = (e) => {
        setCarModel(e.target.value);
    };

    return (
        <Box sx={style}>
            <Box pb={8}>
                <Typography variant="h6" gutterBottom component="h6">
                    {state?._id ? 'UPDATE CAR' : 'CREATE NEW CAR'}
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
                    if (state?._id) onUpdateCar();
                    else onCreateCar();
                }}
            >
                <div>
                    <TextField
                        error={validationError.name?.length > 0}
                        autoComplete="off"
                        size="small"
                        fullWidth
                        label="Car Name"
                        id="name"
                        sx={{ mb: 4 }}
                        onChange={onChangeName}
                        value={carName}
                        helperText={validationError.name || ''}
                    />
                </div>
                <div>
                    <TextField
                        error={validationError.carModel?.length > 0}
                        autoComplete="off"
                        size="small"
                        fullWidth
                        label="Car Model"
                        id="model"
                        sx={{ mb: 4 }}
                        onChange={onChangeModel}
                        value={carModel}
                        helperText={validationError.name || ''}
                    />
                </div>
                {!userLoading && (
                    <div>
                        <Autocomplete
                            loading={userLoading}
                            isOptionEqualToValue={(option, value) => {
                                return option.id === value.id;
                            }}
                            value={user}
                            onChange={(event, value) => {
                                setUser(value);
                                console.log('setUser', value);
                            }}
                            sx={{ mb: 4 }}
                            fullWidth
                            size="small"
                            disablePortal
                            id="user-search"
                            options={users}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField {...params} label="Operator" />
                            )}
                        />
                    </div>
                )}
                {!citiesLoading && (
                    <div>
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => {
                                return option.id === value.id;
                            }}
                            loading={citiesLoading}
                            value={city}
                            onChange={(event, value) => {
                                setCity(value);
                                console.log('setCity', value);
                            }}
                            fullWidth
                            size="small"
                            disablePortal
                            id="city-search"
                            options={cities}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField {...params} label="City" />
                            )}
                        />
                    </div>
                )}

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

export default CreateCar;
