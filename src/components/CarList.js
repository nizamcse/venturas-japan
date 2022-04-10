/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    CircularProgress,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
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

const CarList = () => {
    const Navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cars, setCars] = useState([]);
    const { token } = useContext(AuthContext);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);

    // eslint-disable-next-line consistent-return
    const pullCars = async () => {
        setLoading(true);
        try {
            const tkn = localStorage.getItem('__authToken') || token;
            if (!tkn) return <Navigate to="/login" />;
            const result = await axios.get(
                'https://evening-taiga-21552.herokuapp.com/api/cars',
                {
                    headers: {
                        Authorization: `Bearer ${tkn}`,
                    },
                }
            );
            setCars(result.data?.results || []);
        } catch (err) {
            setError(err.message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        pullCars();
    }, []);

    const deleteCar = async (index, id) => {
        setLoadingDelete(true);
        try {
            await axios.delete(
                `https://evening-taiga-21552.herokuapp.com/api/cars/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            cars.splice(index, 1);
            setDeleteMessage({
                status: true,
                message: 'Car Deleted.',
            });
        } catch (err) {
            setDeleteMessage({
                status: false,
                message: err.message || 'Unexpected Error!',
            });
        } finally {
            setLoadingDelete(false);
        }
    };
    const onCloseAlert = () => {
        setDeleteMessage(null);
    };

    const onClickCreateCar = () => {
        Navigate('/create-car');
    };

    const onClickEditCar = (data) => {
        Navigate(`/edit-car/${data._id}`, { state: data });
    };
    if (loading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                }}
            >
                <CircularProgress size={36} />
            </Box>
        );

    if (error)
        return (
            <Box mt={2} mb={2} p={2}>
                <Alert onClose={onCloseAlert} severity="error">
                    <strong>{error}</strong>
                </Alert>
            </Box>
        );
    return (
        <div>
            <Box
                p={2}
                sx={{ display: 'flex' }}
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography component="h5" variant="h6">
                    LIST OF CARS
                </Typography>
                <Box
                    sx={{ display: 'flex' }}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Button
                        onClick={onClickCreateCar}
                        className={classes.buttonAdd}
                        startIcon={<AddIcon size={24} />}
                        variant="outlined"
                    >
                        Create Car
                    </Button>
                </Box>
            </Box>
            {deleteMessage?.message && (
                <Box mt={2} mb={2} p={2}>
                    <Alert
                        onClose={onCloseAlert}
                        severity={`${
                            deleteMessage.status ? 'success' : 'error'
                        }`}
                    >
                        <strong>
                            {deleteMessage?.message || 'Something went wrong.'}
                        </strong>
                    </Alert>
                </Box>
            )}
            <TableContainer component="div">
                <Table
                    size="small"
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>SL</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Operator</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cars.map((row, index) => (
                            <TableRow
                                key={row._id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.modelNo}</TableCell>
                                <TableCell>{row.user?.name}</TableCell>
                                <TableCell>{row.city?.name}</TableCell>
                                <TableCell align="right">
                                    <Box
                                        sx={{ display: 'flex' }}
                                        alignItems="center"
                                        justifyContent="end"
                                    >
                                        <Box mr={1} sx={{ width: 100 }}>
                                            <Button
                                                onClick={() =>
                                                    onClickEditCar(row)
                                                }
                                                size="small"
                                                variant="outlined"
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                        <Box ml={1}>
                                            <Button
                                                onClick={() =>
                                                    deleteCar(index, row._id)
                                                }
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                startIcon={<DeleteIcon />}
                                            >
                                                Delete
                                                {loadingDelete && (
                                                    <CircularProgress
                                                        size={24}
                                                    />
                                                )}
                                            </Button>
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default CarList;
