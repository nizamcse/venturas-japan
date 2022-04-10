import { createContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

function parseJwt(token) {
    const b64DecodeUnicode = (str) =>
        decodeURIComponent(
            // eslint-disable-next-line prefer-template
            Array.prototype.map
                .call(
                    atob(str),
                    // eslint-disable-next-line prefer-template
                    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );
    const user = JSON.parse(
        b64DecodeUnicode(
            token.split('.')[1].replace('-', '+').replace('_', '/')
        )
    );
    return user;
}

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const logOut = () => {
        setAuth(false);
        setToken(null);
        setRole(null);
        localStorage.removeItem('__authToken');
    };
    useEffect(() => {
        const authToken = localStorage.getItem('__authToken') || null;
        if (authToken) {
            const user = parseJwt(authToken);
            console.log(user, authToken);
            setAuth(true);
            setToken(authToken);
            setRole(user.userType);
        }
    });
    const value = useMemo(
        () => ({
            setToken,
            token,
            setRole,
            role,
            setAuth,
            auth,
            logOut,
        }),
        [auth, token, role]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export { AuthProvider, AuthContext };
