import {useTranslation} from "react-i18next";
import {Box, Button, Container, Grid, IconButton, Input, Typography} from "@material-ui/core";
import Chart from "../containers/Chart";
import {makeStyles} from "@material-ui/core/styles";
import {useRef, useState} from "react";
import {AddCircleOutline} from "@material-ui/icons";
import ChartManager, {SelectChart, SelectChartIDs} from "../store/ChartManager";
import {useDispatch, useSelector} from "react-redux";
import {SelectChartLabels} from "../store/ThemeManager";
import jp from "jsonpath";

const virtualFileInput = (accects) => {
    const fileSelector = document.createElement('input')
    fileSelector.setAttribute('type', 'file')
    fileSelector.setAttribute('accept', accects.join(', '))
    fileSelector.setAttribute('multiple', "")
    return fileSelector
}

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
    const ids = useSelector(SelectChartIDs)
    const dispatch = useDispatch()
    const classes = useClasses()
    const {t} = useTranslation()
    const themeLabels = useSelector(SelectChartLabels)
    // const ifileRef = useRef()
    const fselect = virtualFileInput([
        'application/json', // JSON
        'text/csv', // CSV
        'application/vnd.ms-excel', // XLX, MS-Excel
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // XLSX, MS-Excel
    ])
    //
    const handleAddChart = (e) => {
        e.preventDefault()
        fselect.click()
    }
    const handleDeleteChart = (e, chartID) => {
        dispatch(ChartManager.actions.deleteChart({id: chartID}))
    }
    //
    fselect.onchange = async ev => {
        for (const file of ev.target.files) {
            switch (file.type) {
                case 'application/json':
                    const result = await new Promise((resolve, reject) => {
                        const fr = new FileReader()
                        fr.onload = () => {
                            resolve(JSON.parse(fr.result))
                        }
                        fr.readAsText(file)
                    })
                    if (result.colors === undefined) {
                        result.colors = themeLabels.map(v => v.value)
                    }
                    dispatch(ChartManager.actions.createChart(result))
                    break
                case 'text/csv':
                    break
                case 'application/vnd.ms-excel':
                    break
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    break
            }
        }
    }
    //
    return (
        <Box className={classes.containerWrapper} flexGrow={1}>
            <Container maxWidth="xl" className={classes.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="textPrimary">{t('contents.title')}</Typography>
                    </Grid>
                    {
                        ids
                            .map((elem) =>
                                <Chart
                                    key={elem}
                                    reduxChartId={elem}
                                    onDelete={(ev) => handleDeleteChart(ev, elem)}
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