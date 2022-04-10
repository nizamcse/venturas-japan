import axios from 'axios';
import { useState, useEffect } from 'react';

const useCityApi = (token) => {
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const pullCities = async () => {
        setLoading(true);
        try {
            const result = await axios.get(
                'https://evening-taiga-21552.herokuapp.com/api/cities',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

    useEffect(() => {
        pullCities();
    }, []);

    return {
        cities,
        error,
        loading,
    };
};
export { useCityApi };
