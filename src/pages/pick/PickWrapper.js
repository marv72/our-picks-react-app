import PropTypes from 'prop-types';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import PickCard from './PickCard';
//import Logo from 'components/Logo';
//import AuthFooter from 'components/cards/AuthFooter';

// assets
//import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const PickWrapper = ({ children }) => (
    <Box sx={{ minHeight: '100vh' }}>
        <Grid
            container
            direction="column"
            justifyContent="flex-end"
            sx={{
                minHeight: '100vh'
            }}
        >
            <Grid item xs={12}>
                <Grid
                    item
                    xs={12}
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
                >
                    <Grid item>
                        <PickCard>{children}</PickCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Box>
);

PickWrapper.propTypes = {
    children: PropTypes.node
};

export default PickWrapper;
