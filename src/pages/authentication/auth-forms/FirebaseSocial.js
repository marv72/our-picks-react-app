import { auth, signInWithGoogle } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';

// assets
import Google from 'assets/images/icons/google.svg';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const FirebaseSocial = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) navigate('/dashboard/default');
    }, [user, loading, navigate]);

    return (
        <Stack
            direction="row"
            spacing={matchDownSM ? 1 : 2}
            justifyContent={matchDownSM ? 'space-around' : 'space-between'}
            sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
        >
            <Button
                variant="outlined"
                color="secondary"
                fullWidth={!matchDownSM}
                startIcon={<img src={Google} alt="Google" />}
                onClick={signInWithGoogle}
            >
                {!matchDownSM && 'Google'}
            </Button>
        </Stack>
    );
};

export default FirebaseSocial;
