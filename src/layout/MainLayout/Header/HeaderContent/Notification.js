import { useRef, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Badge,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

//graphl
import { gql, useQuery } from '@apollo/client';

// assets
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { SpinnerRoundFilled } from 'spinners-react';
// sx styles
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: '6px',
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

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const RenderListItems = (props) => {
    console.log('RenderListItems picks: ', props.latest);

    return (
        <List
            component="nav"
            sx={{
                p: 0,
                '& .MuiListItemButton-root': {
                    py: 0.5,
                    '& .MuiAvatar-root': avatarSX,
                    '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                }
            }}
        >
            {props.latest.map((pick) => (
                <>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    color: 'success.main',
                                    bgcolor: 'success.lighter'
                                }}
                            >
                                <BellOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="h6">
                                    <Typography component="span" variant="subtitle1">
                                        {pick.name}
                                    </Typography>{' '}
                                    was picked by {pick.picked_by}
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Typography variant="caption" noWrap>
                                {renderDate(pick.picked_date)}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                </>
            ))}
        </List>
    );
};

const Notification = () => {
    const id = '62ae9b2d51acdac5f9bd2147';
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
    const { data, loading } = useQuery(GET_LATEST_PICKS, {
        variables: {
            id
        }
    });

    const [picks, setPicks] = useState([]);
    const [havePicks, setHavePicks] = useState(false);
    useEffect(() => {
        //Firebase check auth State with Reach Hook
        if (loading) return;
        //Check GraphQL useQuery is still loading
        if (loading === false && data !== undefined) {
            setPicks(data.getLatestPicks.teams);
            setHavePicks(true);
        }
    }, [data, loading]);

    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                disableRipple
                color="secondary"
                sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge badgeContent={3} color="primary">
                    <BellOutlined />
                </Badge>
            </IconButton>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? -5 : 0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.customShadows.z1,
                                width: '100%',
                                minWidth: 285,
                                maxWidth: 420,
                                [theme.breakpoints.down('md')]: {
                                    maxWidth: 285
                                }
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    title="Notification"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <IconButton size="small" onClick={handleToggle}>
                                            <CloseOutlined />
                                        </IconButton>
                                    }
                                >
                                    {' '}
                                    <>
                                        {' '}
                                        {havePicks ? (
                                            <RenderListItems latest={picks} />
                                        ) : (
                                            <SpinnerRoundFilled size={50} thickness={100} speed={100} color="rgba(57, 151, 172, 1)" />
                                        )}
                                    </>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Notification;
