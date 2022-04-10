/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
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
import { AuthContext } from '../context/AuthContext';

const OperatorCarList = () => {
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cars, setCars] = useState([]);
    const { token } = useContext(AuthContext);

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
                <Alert severity="error">
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
            </Box>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OperatorCarList;
