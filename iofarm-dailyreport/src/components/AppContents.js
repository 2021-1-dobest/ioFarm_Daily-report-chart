import {useTranslation} from "react-i18next";
import {Container, Grid, Typography} from "@material-ui/core";
import Chart from "../containers/Chart";
import {makeStyles} from "@material-ui/core/styles";

const useClasses = makeStyles((theme) => ({
    container: {
        paddingTop : 24,
        backgroundColor : theme.palette.background.default,
    }
}))
export default function () {
    //
    const classes = useClasses()
    const {t} = useTranslation()
    //
    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" color="textPrimary">{t('contents.title')}</Typography>
                    <Grid/>
                </Grid>
                <Chart justTxt="1"/>
                <Chart justTxt="2"/>
                <Chart justTxt="3"/>
            </Grid>
        </Container>
    );
}