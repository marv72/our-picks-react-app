import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import MlbTable from './MlbTable';
import LatestPicks from './LatestPicks';
import MainCard from 'components/MainCard';

//check user profile
import { gql, useLazyQuery } from '@apollo/client';

const GET_PLAYER = gql`
    query GetPlayer($email: String) {
        getPlayer(email: $email) {
            player_id
            username
            email
            subscription
            firstName
            lastName
        }
    }
`;

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    //GraphQL query to get player by email
    const [getPlayer, { playerLoading, data }] = useLazyQuery(GET_PLAYER);

    useEffect(() => {
        if (loading) return;
        console.log('got response from firebase: ', user);
        if (!user) return navigate('/login');

        getPlayer({ variables: { email: user.email } });
        if (playerLoading) return;
        if (data) {
            if (data.getPlayer.subscription !== true) {
                console.log('No Active Subscription');
                return navigate('/register');
            }
        }

        //todo add redux to store profile
        console.log('Got Player data: ', data);
    }, [user, loading, navigate, data, playerLoading]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Major League Baseball</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <MlbTable />
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Last Picks</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <LatestPicks id="62ae9b2d51acdac5f9bd2147" />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;
