import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { gql, useQuery } from '@apollo/client';

const GET_PICKS = gql`
    query GetPick($id: ID) {
        getPick(id: $id) {
            _id
            name
            sport
            country
            code
            last_pick
            teams {
                picked_by
                picked_date
                name
                team_code
                conference
                division
            }
        }
    }
`;

const id = '62ae9b2d51acdac5f9bd2147';

let tableMessages = '';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Team Name'
    },
    {
        id: 'conference',
        numeric: true,
        disablePadding: false,
        label: 'Conference'
    },
    {
        id: 'division',
        numeric: true,
        disablePadding: false,
        label: 'Division'
    },
    {
        id: 'picked_by',
        numeric: true,
        disablePadding: false,
        label: 'Picked By'
    },
    {
        id: 'picked_date',
        numeric: true,
        disablePadding: false,
        label: 'Date Picked'
    }
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <>
                        <h4>Action</h4>
                    </>
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                {tableMessages}
            </Typography>

            <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('conference');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [pick, setPick] = React.useState('');
    //GraphQL query to get picks by Id
    const { data, loading, error } = useQuery(GET_PICKS, {
        variables: {
            id
        }
    });
    //Firebase check auth State with Reach Hook
    const [user, authLoading] = useAuthState(auth);
    const [nextPick, setNextPick] = React.useState(true);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (error) {
            setRows([]);
            tableMessages = 'Sorry we could not find the game';
        }
        //Check GraphQL useQuery is still loading
        if (loading === false && data !== undefined) {
            setRows(data.getPick.teams);
        }
        //Firebase check auth State with Reach Hook
        if (authLoading) return;
        if (!user) return navigate('/login');
        if (data && user) {
            if (data.getPick.last_pick && user.email) {
                if (user.email === data.getPick.last_pick) {
                    console.log('matched email and last_pick');
                    setNextPick(false);
                    tableMessages = 'It is not your Pick!!';
                }
            }
        }
    }, [loading, data, user, authLoading]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        if (nextPick === true) {
            setPick(name);
            navigate('/pick', { state: { pick: name, username: 'someone@twat.com', id: id } });
        } else {
            console.log('it is not your pick');
        }

        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const renderButton = (row) => {
        console.log(pick);
        if (row.picked_by?.length > 2 || !nextPick)
            return (
                <Button variant="contained" endIcon={<SendIcon />} disabled>
                    Pick
                </Button>
            );
        return (
            <Button variant="contained" endIcon={<SendIcon />}>
                Pick
            </Button>
        );
    };

    const renderDate = (row) => {
        if (row.picked_date > 0) {
            const pickDate = new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(row.picked_date);
            return pickDate;
        } else {
            return '';
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell>{renderButton(row)}</TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.conference}</TableCell>
                                            <TableCell align="right">{row.division}</TableCell>
                                            <TableCell align="right">{row.picked_by}</TableCell>
                                            <TableCell align="right">{renderDate(row)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
