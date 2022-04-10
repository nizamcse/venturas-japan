import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
const OperatorPrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const token = localStorage.getItem('__authToken');
    if (!auth && !token) return <Navigate to="/login" />;
    return children;
};

export default OperatorPrivateRoute;
