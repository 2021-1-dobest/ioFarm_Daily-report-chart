import {Box, Button, Card, CardActions, CardContent, Grid, Typography,} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from "@material-ui/pickers";
import {useState} from "react";
import {useSelector} from "react-redux";
import {SelectLocale} from "../store/LocaleManager";

const useClasses = makeStyles((theme) => ({
    gridTransition: {
        transition: theme.transitions.create("all",
            {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }
        )
    },
    chartTitle: {
        fontSize: 20,
        paddingInline: theme.spacing(2),
    },
    chartTitleWrapper: {

        display: 'flex',
        verticalAlign: 'middle'
    },
    chartCard: {
        [theme.breakpoints.between('xs', 'md')]: {
            width: '100%',
            height: '480px',
        },
        [theme.breakpoints.up('md')]: {
            width: '100%',
            aspectRatio: '4/3'
        },
    },
    datePickerCardOuter: {
        padding: 0
    },
    datePickerCardInner: {
        backgroundColor: theme.palette.background.default
    },
    datePicker: {
        maxWidth: '180px',
    },
    header: {},
    headerButtonGroup: {
        marginTop: "auto",
        marginBottom: "auto",
    }
}))

export default function ({justTxt}) {
    //
    const classes = useClasses()
    // const muiPlusButtons = MUIPlusButtons()
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [grid, setGrid] = useState(6);
    const {t} = useTranslation()
    const {module, format} = useSelector(SelectLocale)
    //
    const handleBeginDateChange = (date) => {
        setBeginDate(date)
    }
    const handleEndDateChange = (date) => {
        setEndDate(date)
    }
    return (
        <Grid item xs={12} lg={grid} className={classes.gridTransition}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={module}>
                <Card className={classes.chartCard}>
                    <CardContent className={classes.header}>
                        <Box display="flex" flexDirection="row" paddingX="2px">
                            <Box display="flex" alignItems="center">
                                <Typography className={classes.chartTitle}>{t('contents.chart.meta.date')}</Typography>
                            </Box>
                            <Box className={classes.datePickerCardOuter}>
                                <Card variant="outlined" className={classes.datePickerCardInner}>
                                    <CardActions>
                                        <KeyboardDatePicker
                                            // disableToolbar
                                            className={classes.datePicker}
                                            format={format}
                                            value={beginDate}
                                            onChange={handleBeginDateChange}
                                        />
                                        ~
                                        <KeyboardDatePicker
                                            className={classes.datePicker}
                                            format={format}
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                        />
                                    </CardActions>
                                </Card>
                            </Box>

                            {/* Spacer */} <Box flexGrow={1}/>
                            <Box>
                                <CardActions className={classes.headerButtonGroup}>
                                    <Button variant="outlined"
                                            color="primary">{t('contents.chart.toolbar.import')}</Button>
                                    <Button variant="contained"
                                            color="primary">{t('contents.chart.toolbar.export')}</Button>
                                </CardActions>
                            </Box>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {
                            setGrid(grid === 12 ? 6 : 12)
                        }}>click</Button>
                    </CardActions>
                    <CardContent>{justTxt}</CardContent>
                </Card>
            </MuiPickersUtilsProvider>
        </Grid>
    )
}