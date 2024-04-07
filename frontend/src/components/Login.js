// src/components/Login.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 hook

const Login = () => {
    const { loginWithRedirect } = useAuth0(); // Get login function from Auth0

    return (
        <div>
            <h2>Login</h2>
            <button onClick={() => loginWithRedirect()}>Log In with Auth0</button> {/* Use loginWithRedirect function */}
        </div>
    );
};

export default Login;

