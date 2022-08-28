import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Link,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// project import
import MakePick from './pick-forms/MakePick';
import PickWrapper from './PickWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from 'components/MainCard';
// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
/*
 GraphQL Mutation to update a pick with the username 
*/
const MAKE_PICK = gql`
    mutation Mutation($id: ID!, $name: String!, $username: String!) {
        makePick(id: $id, name: $name, username: $username) {
            success
            message
        }
    }
`;

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// ================================|| LOGIN ||================================ //

const MakeMyPick = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [errors, setErrors] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('Unexpected Error has occured');
    const [setPick, { data, loading }] = useMutation(MAKE_PICK);
    const handleClick = async () => {
        try {
            const { data } = await setPick({
                variables: { id: '630b3c347caf58b5a3e7c9fd', name: location.state.pick, username: 'martin@arndts.co.nz' }
            });
            console.log('data: ', data);
            if (data.makePick.success === false) {
                setErrorMessage(data.makePick.message);
                setErrors(true);
            } else {
                navigate('/', { replace: true });
                window.location.reload();
            }
        } catch (e) {
            setErrors(true);
            console.log('e:', e);
            console.log('error');
        }
    };
    return (
        <>
            <PickWrapper>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Last Picks</Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <List
                                component="nav"
                                sx={{
                                    px: 0,
                                    py: 0,
                                    '& .MuiListItemButton-root': {
                                        py: 1.5,
                                        '& .MuiAvatar-root': avatarSX,
                                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                    }
                                }}
                            >
                                <ListItemButton divider>
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                color: 'success.main',
                                                bgcolor: 'success.lighter'
                                            }}
                                        >
                                            <GiftOutlined />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">Order #002434</Typography>}
                                        secondary="Today, 2:00 AM"
                                    />
                                    <ListItemSecondaryAction>
                                        <Stack alignItems="flex-end">
                                            <Typography variant="subtitle1" noWrap>
                                                + $1,430
                                            </Typography>
                                            <Typography variant="h6" color="secondary" noWrap>
                                                78%
                                            </Typography>
                                        </Stack>
                                    </ListItemSecondaryAction>
                                </ListItemButton>
                                <ListItemButton divider>
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                color: 'primary.main',
                                                bgcolor: 'primary.lighter'
                                            }}
                                        >
                                            <MessageOutlined />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">Order #984947</Typography>}
                                        secondary="5 August, 1:45 PM"
                                    />
                                    <ListItemSecondaryAction>
                                        <Stack alignItems="flex-end">
                                            <Typography variant="subtitle1" noWrap>
                                                + $302
                                            </Typography>
                                            <Typography variant="h6" color="secondary" noWrap>
                                                8%
                                            </Typography>
                                        </Stack>
                                    </ListItemSecondaryAction>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                color: 'error.main',
                                                bgcolor: 'error.lighter'
                                            }}
                                        >
                                            <SettingOutlined />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">Order #988784</Typography>}
                                        secondary="7 hours ago"
                                    />
                                    <ListItemSecondaryAction>
                                        <Stack alignItems="flex-end">
                                            <Typography variant="subtitle1" noWrap>
                                                + $682
                                            </Typography>
                                            <Typography variant="h6" color="secondary" noWrap>
                                                16%
                                            </Typography>
                                        </Stack>
                                    </ListItemSecondaryAction>
                                </ListItemButton>
                            </List>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            <Typography variant="h3">Choose {location.state.pick}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                fullWidth
                                size="large"
                                onClick={handleClick}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Make Pick
                            </Button>
                        </AnimateButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            {errors === false ? (
                                <Typography variant="h3"> </Typography>
                            ) : (
                                <Typography variant="h3">{errorMessage}</Typography>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </PickWrapper>
        </>
    );
};

export default MakeMyPick;
