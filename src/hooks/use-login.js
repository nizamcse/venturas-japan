import axios from 'axios';

const useLogin = () => {
    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            try {
                axios
                    .post(
                        'https://evening-taiga-21552.herokuapp.com/api/login',
                        {
                            email,
                            password,
                        }
                    )
                    .then((result) => {
                        resolve({
                            token: result.data.token,
                            user: result.data.user,
                        });
                    });
            } catch (err) {
                const message =
                    err?.response?.data.msg ||
                    err?.response?.msg ||
                    err.msg ||
                    err.toString();
                reject(message || 'Unexpected Error!');
            }
        });
    };

    return {
        login,
    };
};
export { useLogin };
