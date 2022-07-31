import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

// material-ui
import {
    Avatar,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

import { gql, useQuery } from '@apollo/client';
// assets
import { CheckSquareOutlined, CloseSquareOutlined } from '@ant-design/icons';
import { SpinnerRoundFilled } from 'spinners-react';

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

const renderDate = (pickedDate) => {
    const prettyDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(pickedDate);
    return prettyDate;
};

const RenderListItems = (props) => {
    console.log('RenderListItems picks: ', props.latest);

    return (
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
            {props.latest.map((pick) => (
                <ListItemButton divider>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: 'success.main',
                                bgcolor: 'success.lighter'
                            }}
                        >
                            <CheckSquareOutlined />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Typography variant="subtitle1">{pick.picked_by}</Typography>}
                        secondary={renderDate(pick.picked_date)}
                    />
                    <ListItemSecondaryAction>
                        <Stack alignItems="flex-end">
                            <Typography variant="subtitle1" noWrap>
                                {pick.name}
                            </Typography>
                        </Stack>
                    </ListItemSecondaryAction>
                </ListItemButton>
            ))}
        </List>
    );
};

export default function LatestPicks(props) {
    const id = props.id;
    const GET_LATEST_PICKS = gql`
        query GetLatestPicks($id: ID) {
            getLatestPicks(id: $id) {
                success
                message
                teams {
                    picked_by
                    picked_date
                    name
                }
            }
        }
    `;
    //GraphQL query to get picks by Id
    const { data, loading, error } = useQuery(GET_LATEST_PICKS, {
        variables: {
            id
        }
    });
    //Firebase check auth State with Reach Hook
    const [user, authLoading] = useAuthState(auth);
    const navigate = useNavigate();
    const [picks, setPicks] = React.useState([]);
    const [havePicks, setHavePicks] = React.useState(false);
    React.useEffect(() => {
        //Firebase check auth State with Reach Hook
        if (authLoading) return;
        if (!user) return navigate('/login');
        //GraphQL get lstest picks
        if (loading) return;
        //Check GraphQL useQuery is still loading
        if (loading === false && data !== undefined) {
            setPicks(data.getLatestPicks.teams);
            setHavePicks(true);
        }
    }, [user, authLoading]);

    if (loading) {
        return <SpinnerRoundFilled size={50} thickness={100} speed={100} color="rgba(57, 151, 172, 1)" />;
    }

    return (
        <>
            {' '}
            {havePicks ? (
                <RenderListItems latest={picks} />
            ) : (
                <SpinnerRoundFilled size={50} thickness={100} speed={100} color="rgba(57, 151, 172, 1)" />
            )}
        </>
    );
}
