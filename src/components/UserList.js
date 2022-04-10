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

const UserList = () => {
    const Navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const { token } = useContext(AuthContext);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);

    const pullUsers = async () => {
        setLoading(true);
        try {
            const result = await axios.get(
                'https://evening-taiga-21552.herokuapp.com/api/users',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(result.data?.users || []);
        } catch (err) {
            setError(err.message || 'Unexpected Error!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        pullUsers();
    }, []);

    const deleteUser = async (index, id) => {
        setLoadingDelete(true);
        try {
            await axios.delete(
                `https://evening-taiga-21552.herokuapp.com/api/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            users.splice(index, 1);
            setDeleteMessage({
                status: true,
                message: 'User Deleted.',
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

    const onClickCreateUser = () => {
        Navigate('/create-user');
    };

    const onClickEditUser = (data) => {
        Navigate(`/edit-user/${data._id}`, { state: data });
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
                    LIST OF USERS
                </Typography>
                <Box
                    sx={{ display: 'flex' }}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Button
                        onClick={onClickCreateUser}
                        className={classes.buttonAdd}
                        startIcon={<AddIcon size={24} />}
                        variant="outlined"
                    >
                        Create User
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
                            <TableCell>Email</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row, index) => (
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
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.userType}</TableCell>
                                <TableCell align="right">
                                    <Box
                                        sx={{ display: 'flex' }}
                                        alignItems="center"
                                        justifyContent="end"
                                    >
                                        <Box mr={1} sx={{ width: 100 }}>
                                            <Button
                                                onClick={() =>
                                                    onClickEditUser(row)
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
                                                    deleteUser(index, row._id)
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

export default UserList;
