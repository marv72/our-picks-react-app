// material-ui
import { useMediaQuery } from '@mui/material';

// project import
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Search from './Search';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <>
            {!matchesXs && <Search />}
            {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

            <Notification />
            {!matchesXs && <Profile />}
            {matchesXs && <MobileSection />}
        </>
    );
};

export default HeaderContent;
