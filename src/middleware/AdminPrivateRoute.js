import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    if (!auth) return <Navigate to="/login" />;
    // if (auth && role === 'ADMIN') return <Navigate to="/" replace />;
    // if (auth && role === 'OPERATOR') return <Navigate to="/account" replace />;
    return children;
};

export default PrivateRoute;
