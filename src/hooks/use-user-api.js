import axios from 'axios';
import { useState, useEffect } from 'react';

const useUserApi = (token) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

    return {
        users,
        error,
        loading,
    };
};
export { useUserApi };
