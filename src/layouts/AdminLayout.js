/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import { AuthContext } from '../context/AuthContext';

const useStyles = makeStyles({
    link: {
        textDecoration: 'none',
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

const MainAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function AdminLayout() {
    const classes = useStyles();
    const { logOut } = React.useContext(AuthContext);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const onLogOut = async () => {
        logOut();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <MainAppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Persistent drawer
                    </Typography>
                </Toolbar>
            </MainAppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    ASSIGNMENT
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <List>
                    <Link to="/users" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <AccessibilityIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    </Link>
                    <Link to="/" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <LocationCityIcon />
                            </ListItemIcon>
                            <ListItemText primary="City" />
                        </ListItem>
                    </Link>
                    <Link to="/cars" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <ElectricCarIcon />
                            </ListItemIcon>
                            <ListItemText primary="Car" />
                        </ListItem>
                    </Link>
                    <Link to="/reports" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Report" />
                        </ListItem>
                    </Link>
                    <Link to="/tracking" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <AssistantDirectionIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tracking" />
                        </ListItem>
                    </Link>
                    <ListItem onClick={onLogOut} button>
                        <ListItemIcon>
                            <LogoutRounded />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
}
