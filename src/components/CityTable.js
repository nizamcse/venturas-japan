/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext, useRef } from 'react';
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
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
const CityTable = () => {
    const fileInputRef = useRef(null);
    const Navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cities, setCities] = useState([]);
    const { token } = useContext(AuthContext);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const pullCities = async () => {
        const tkn = localStorage.getItem('__authToken') || token;
        setLoading(true);
        try {
            const result = await axios.get(
                'https://evening-taiga-21552.herokuapp.com/api/cities',
                {
                    headers: {
                        Authorization: `Bearer ${tkn}`,
                    },
                }
            );
            setCities(result.data?.results || []);
        } catch (err) {
            setError(err.message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    const deleteCity = async (index, id) => {
        setLoadingDelete(true);
        try {
            await axios.delete(
                `https://evening-taiga-21552.herokuapp.com/api/cities/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            cities.splice(index, 1);
            setDeleteMessage({
                status: true,
                message: 'City Deleted.',
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
    const handleClick = () => {
        fileInputRef.current.click();
    };

    const onUploadFile = async (data) => {
        setLoadingUpload(true);
        try {
            await axios.post(
                `https://evening-taiga-21552.herokuapp.com/api/cities/upload`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setDeleteMessage({
                status: true,
                message: 'File Uploaded',
            });
            pullCities();
        } catch (err) {
            setDeleteMessage({
                status: false,
                message: err.message || 'Unexpected Error!',
            });
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleChange = (event) => {
        const fileUploaded = event.target.files[0];
        const formData = new FormData();
        formData.append('csvFile', fileUploaded);
        onUploadFile(formData);
    };

    useEffect(() => {
        pullCities();
    }, []);

    const onCloseAlert = () => {
        setDeleteMessage(null);
    };

    const onClickCreateCity = () => {
        Navigate('/create-city');
    };

    const onClickEditCity = (data) => {
        Navigate(`edit-city/${data._id}`, { state: data });
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
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
            <Box
                p={2}
                sx={{ display: 'flex' }}
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography component="h5" variant="h6">
                    LIST OF CITIES
                </Typography>
                <Box
                    sx={{ display: 'flex' }}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Button
                        onClick={onClickCreateCity}
                        className={classes.buttonAdd}
                        startIcon={<AddIcon size={24} />}
                        variant="outlined"
                    >
                        Create City
                    </Button>
                    <LoadingButton
                        loading={loadingUpload}
                        onClick={handleClick}
                        loadingPosition="start"
                        startIcon={<UploadFileIcon />}
                        variant="contained"
                    >
                        Upload file
                    </LoadingButton>
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
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cities.map((row, index) => (
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
                                <TableCell align="right">
                                    <Box
                                        sx={{ display: 'flex' }}
                                        alignItems="center"
                                        justifyContent="end"
                                    >
                                        <Box mr={1} sx={{ width: 100 }}>
                                            <Button
                                                onClick={() =>
                                                    onClickEditCity(row)
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
                                                    deleteCity(index, row._id)
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
        </>
    );
};

export default CityTable;
