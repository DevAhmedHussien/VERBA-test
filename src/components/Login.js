//** import React 
import { useState, useEffect, useContext } from 'react';

//** Router 
import { useNavigate } from 'react-router-dom';

//** third party mui 
import { Box, Button, TextField, Typography, CircularProgress, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';

//** Redux 
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';

//** Context
import { SnackbarContext } from '../context/SnackbarContext';

const Login = () => {

    //** States 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    //** Redux 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector(state => state.auth);

    //** Context
    const { showSnackbar } = useContext(SnackbarContext);

    //** secu page   
    useEffect(() => {
        if (user) {
            navigate('/todos');
        }
    }, [user]);

    //** handle Login method
    const handleLogin = async () => {
        const result = await dispatch(loginUser({ username, password }));
        if (loginUser.fulfilled.match(result)) {
            navigate('/todos');
        }
        showSnackbar('Login successful!', 'success');
    };

    // showing and hide password
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p:10
            }}
        >
            <Paper 
                elevation={10} 
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#ffffffee',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                    }
                }}
            >
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{
                        fontWeight: 600,
                        color: '#001D4A',
                        mb: 2,
                    }}
                >
                    Login
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    disabled={loading}
                    fullWidth
                    startIcon={!loading && <LoginIcon />}
                    sx={{
                        mt: 2,
                        p: 1,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #00A6FB, #001D4A)',
                        color: '#fff',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #001D4A, #00A6FB)',
                            transform: 'scale(1.02)',
                            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                        },
                        '& .MuiButton-startIcon': {
                            transition: 'transform 0.3s ease',
                        },
                        '&:hover .MuiButton-startIcon': {
                            transform: 'rotate(360deg)',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
                {error && (
                    <Typography color="error" sx={{ mt: 2, fontSize: '0.875rem' }}>
                        {error}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Login;
