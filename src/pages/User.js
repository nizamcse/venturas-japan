import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Alert, Paper } from '@mui/material';
import UserList from '../components/UserList';

const User = () => {
    const { state } = useLocation();
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (state?.user) setShowAlert(true);
    }, [state]);

    const onCloseAlert = () => setShowAlert(false);

    return (
        <div>
            <Paper>
                {showAlert && state?.user && (
                    <Box mt={2} mb={2} p={2}>
                        <Alert onClose={onCloseAlert} severity="success">
                            The password for {state.user.name} -{' '}
                            <strong>[ {state.password} ]</strong>
                        </Alert>
                    </Box>
                )}
                <UserList />
            </Paper>
        </div>
    );
};

export default User;
