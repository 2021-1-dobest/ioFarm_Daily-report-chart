import {
    Box,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    ListItemIcon,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {SelectChartLabels} from "../store/ThemeManager";
import jp from "jsonpath";
import {BarChart, FiberManualRecord, Timeline} from "@material-ui/icons";

const useClasses = makeStyles((theme) => ({

    modalDenseContents: {
        padding: theme.spacing(1),
    },
    modalConfigLabel: {
        flexGrow: 2,
        width: '20%',
    },
    modalConfigInput: {
        flexGrow: 8,
        width: '80%',
        // theme.
        '& div': {
            display: 'flex',
        }
    },
}))
export default function ({title, data, onLineType, onColor, onAxis, onLabelShow, onDotShow}) {
    const classes = useClasses()
    const {t} = useTranslation()
    const labels = useSelector(SelectChartLabels)
    //
    return <Box>
        <CardContent className={classes.modalDenseContents}>
            <Typography>{title}</Typography>
        </CardContent>
        <CardActions>
            <Typography
                className={classes.modalConfigLabel}>{t('contents.chart.config.item.type')}</Typography>
            <FormControl variant="outlined" size="small"
                         className={classes.modalConfigInput}>
                <Select value={data.type} onChange={(_, v,) => {
                    if (onLineType && data.type !== v.props.value) {
                        onLineType(v.props.value)
                    }
                }}>
                    <MenuItem value="bar">

                        <ListItemIcon>
                            <BarChart fontSize="small"/>
                        </ListItemIcon>
                        <Typography variant="inherit"
                                    noWrap>{t('contents.chart.config.item.type-bar')}</Typography></MenuItem>
                    <MenuItem value="line">

                        <ListItemIcon>
                            <Timeline fontSize="small"/>
                        </ListItemIcon>
                        <Typography variant="inherit"
                                    noWrap>{t('contents.chart.config.item.type-line')}</Typography></MenuItem>
                </Select>
            </FormControl>
        </CardActions>
        <CardActions>
            <Typography
                className={classes.modalConfigLabel}>{t('contents.chart.config.item.color')}</Typography>
            <FormControl variant="outlined" size="small"
                         className={classes.modalConfigInput}>
                <Select
                    value={data.color}
                    onChange={(_, v,) => {
                        if (onColor && data.color !== v.props.value) {
                            onColor(v.props.value)
                        }
                    }}>
                    {
                        labels.map(
                            elem => <MenuItem key={jp.stringify(elem.path)}
                                              value={elem.value}>

                                <ListItemIcon>
                                    <FiberManualRecord style={{color: elem.value}} fontSize="small"/>
                                </ListItemIcon>
                                <Typography variant="inherit"
                                            noWrap>{t(`contents.chart.colors.${elem.path[1]}`, {variant: elem.path[2]})}</Typography>
                            </MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </CardActions>
        <CardActions>
            <Typography
                className={classes.modalConfigLabel}>{t('contents.chart.config.item.axis')}</Typography>
            <FormControl variant="outlined" size="small"
                         className={classes.modalConfigInput}>
                <Select value={data['y-axis']} onChange={(_, v,) => {
                    if (onAxis && data['y-axis'] !== v.props.value) {
                        onAxis(v.props.value)
                    }
                }}>
                    <MenuItem value="left">{t('contents.chart.config.item.axis-left')}</MenuItem>
                    <MenuItem value="right">{t('contents.chart.config.item.axis-right')}</MenuItem>
                </Select>
            </FormControl>
        </CardActions>
        <CardActions>
            <Typography
                className={classes.modalConfigLabel}>{t('contents.chart.config.item.label')}</Typography>
            <FormControl variant="outlined" size="small"
                         className={classes.modalConfigInput}>
                <Select value={data['label-show']} onChange={(_, v,) => {
                    if (onLabelShow && data['label-show'] !== v.props.value) {
                        onLabelShow(v.props.value)
                    }
                }}>
                    <MenuItem value={true}>{t('contents.chart.config.item.label-show')}</MenuItem>
                    <MenuItem value={false}>{t('contents.chart.config.item.label-hidden')}</MenuItem>
                </Select>
            </FormControl>
        </CardActions>
        {
            data.type === 'line' ?
                <CardActions>
                    <Typography
                        className={classes.modalConfigLabel}>{t('contents.chart.config.item.dot')}</Typography>
                    <FormControl variant="outlined" size="small"
                                 className={classes.modalConfigInput}>
                        <Select value={data['dot-show']} onChange={(_, v,) => {
                            if (onDotShow && data['dot-show'] !== v.props.value) {
                                onDotShow(v.props.value)
                            }
                        }}>
                            <MenuItem value={true}>{t('contents.chart.config.item.label-show')}</MenuItem>
                            <MenuItem value={false}>{t('contents.chart.config.item.label-hidden')}</MenuItem>
                        </Select>
                    </FormControl>
                </CardActions>
                : null
        }
        <Divider/>
    </Box>
}