import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Avatar, Box, Button, Toolbar, Typography} from '@material-ui/core';
import Logo from '../res/iocrops.webp'
import SettingDrawer from '../containers/SettingDrawer'

const useStyles = makeStyles((theme) => {
        return ({
            menuButton: {
                marginRight: theme.spacing(2),
            },
            logo: {
                textTransform: 'none',
                borderRadius: '50vh',
                backgroundColor: '#FFF',
                color : "#000",
                paddingRight: 20

            },
            spacer: {
                flexGrow: 1,
            }
        })
    },
);

export default function () {
    const classes = useStyles();
    return (
        <AppBar position="fixed" color='default'>
            <Toolbar>
                <Button className={classes.logo}>
                    <Avatar src={Logo}/>
                    <Box m={1}/>
                    <Typography variant="h6">
                        ioFarm
                    </Typography>
                </Button>
                <Box className={classes.spacer}/>
                <SettingDrawer/>
            </Toolbar>
        </AppBar>
    );
}