import {useTranslation} from "react-i18next";
import {Box, Button, Container, Grid, IconButton, Typography} from "@material-ui/core";
import Chart from "../containers/Chart";
import {makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import {AddCircleOutline} from "@material-ui/icons";
import ChartManager, {SelectChart} from "../store/ChartManager";
import {useDispatch, useSelector} from "react-redux";
import {SelectChartLabels} from "../store/ThemeManager";

const useClasses = makeStyles((theme) => ({
    container: {
        paddingTop: 24,
    },
    containerWrapper: {
        backgroundColor: theme.palette.background.default,
        height: 'auto',
    },
    addChartButton: {
        width: '100%'
    }
}))
export default function () {
    //
    const dispatch = useDispatch()
    const classes = useClasses()
    const {t} = useTranslation()
    const [charts, setCharts] = useState([])
    const themeLabels = useSelector(SelectChartLabels)
    //
    const handleAddChart = () => {
        const res = dispatch(ChartManager.actions.createChart({
            dataset: {
                "2021-01-01 00:00:00": {
                    "Outside_weather": {
                        "Sun": {
                            "sunrise": "07:47",
                            "sunset": "17:24",
                        }
                    },
                    "Grh_humidity": {
                        "RT_hum": {
                            "avg": 32,
                            "day_avg": 33,
                            "night_avg": 32,
                            "max": 36,
                            "min": 29,
                        }
                    }
                },
                "2021-01-02 00:00:00": {
                    "Outside_weather": {
                        "Sun": {
                            "sunrise": "08:47",
                            "sunset": "17:34",
                        }
                    },
                    "Grh_temp": {
                        "RT_temp": {
                            "avg": 19.9,
                            "day_avg": 21.4,
                            "night_avg": 18.8,
                            "diff": 2.5,
                            "max": 24,
                            "min": 17.7,
                        }
                    },
                    "Grh_humidity": {
                        "RT_hum": {
                            "avg": 33,
                            "day_avg": 34,
                            "night_avg": 33,
                            "max": 37,
                            "min": 30,
                        }
                    }
                }
            },
            colors: themeLabels.map(v => v.value)
        }))
        setCharts([...charts, res.return])
    }

    return (
        <Box className={classes.containerWrapper} flexGrow={1}>
            <Container maxWidth="xl" className={classes.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="textPrimary">{t('contents.title')}</Typography>
                    </Grid>
                    {
                        charts
                            .map((elem) =>
                                <Chart
                                    key={elem}
                                    reduxChartId={elem}
                                    onDelete={() => setCharts(charts.filter(v => v !== elem))}
                                />)
                    }
                    <Grid item xs={12}>
                        <Button className={classes.addChartButton} color="primary" variant="contained"
                                onClick={handleAddChart}><AddCircleOutline/>{' '}<Typography>{t('contents.buttons.add-chart')}</Typography></Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}