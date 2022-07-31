// material-ui
import { Divider, Grid, Typography } from '@mui/material';

// project import
import FirebaseSocial from './FirebaseSocial';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Divider>
                        <Typography variant="caption"> Login with</Typography>
                    </Divider>
                </Grid>
                <Grid item xs={12}>
                    <FirebaseSocial />
                </Grid>
            </Grid>
        </>
    );
};

export default AuthLogin;
