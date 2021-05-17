import {
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Hidden,
    IconButton,
    InputAdornment, ListItemIcon,
    Menu,
    MenuItem,
    Modal,
    MuiThemeProvider,
    Slider,
    Tab,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import DateFnsUtils from '@date-io/date-fns';
import {DatePicker, MuiPickersUtilsProvider,} from "@material-ui/pickers";
import {useRef, useState} from "react";
import jp from "jsonpath";
import {useDispatch, useSelector} from "react-redux";
import {SelectLocale} from "../store/LocaleManager";
import FilterTreeDefaultExpand from "../res/jsons/FilterTreeDefaultExpand.json";
import {
    AspectRatio,
    ChevronRight,
    Clear,
    Close,
    Delete,
    ExpandMore,
    Filter1,
    Filter2,
    Filter3,
    Filter4,
    Filter5,
    Filter6,
    Filter7,
    Filter8,
    Filter9,
    Filter9Plus,
    FilterNone,
    GetApp,
    InsertChart, PermDataSetting,
    Search,
    SwapHoriz, Warning
} from "@material-ui/icons";
import ChartManager, {SelectChart, SelectFilterCount} from "../store/ChartManager";
import {TreeItem, TreeView} from "@material-ui/lab";
import {format as dfmt, parse} from "date-fns";
import FieldConfig from "./FieldConfig";
import xlsx from "xlsx";
import ChartView from "./ChartView";

const useClasses = makeStyles((theme) => ({
    modalBase: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
    modalCardBase: {
        margin: 'auto',
        paddingInline: theme.spacing(1),
        paddingBlock: theme.spacing(1),
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
            width: '80%',
        },
        [theme.breakpoints.up('md')]: {
            width: '420px',
        },
    },
    modalCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBlock: 'auto'
    },
    modalDenseContents: {
        padding: theme.spacing(1),
    },
    modalConfigHeader: {
        padding: theme.spacing(1),
    },
    modalConfigContents: {
        overflowY: 'hidden',
        padding: 0,
        marginInline: theme.spacing(1),
        display: "flex",
        flexDirection: 'column',
    },
    modalConfigContentsCard: {
        overflowY: 'auto',
        padding: 0,
    },
    modalConfigLabel: {
        flexGrow: 2,
    },
    modalConfigInput: {
        flexGrow: 8,
    },
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
        [theme.breakpoints.between('xs', 'sm')]: {
            width: '100%',
            height: '520px',
        },
        display: 'flex',
        flexDirection: "column",
        flex: "auto 1 auto"
    },
    chartCardSmall: {
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            aspectRatio: '8/5',
        },
    },
    chartCardLarge: {
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            aspectRatio: '32/17',
        },
    },
    datePickerCardOuter: {
        padding: 0
    },
    datePicker: {
        maxWidth: '150px',
    },
    headerButtonGroup: {
        padding: '0',
    },
    header: {
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1)
        },

        [theme.breakpoints.up('md')]: {}
    },
    chartView: {
        paddingBlock: 0,
        flexGrow : 1,
        overflowX : 'auto',
        [theme.breakpoints.down('md')]: {
            paddingInline: theme.spacing(1)
        },
    },
    zeroDateAction: {
        padding: '2px 8px'
    },
    zoomMenuPaper: {
        overflow: 'visible',
    },
    zoomMenuList: {
        padding: 0,
    },
    zoomSlider: {
        width: '300px',
        marginInline: '15px',
    },
    treeViewBase: {
        width: '100%',
        overflowY: "auto",
        padding: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
            maxHeight: '40vh',
        },
        [theme.breakpoints.up('md')]: {

            maxHeight: '560px',
        }
    },
    treeViewItem: {
        marginLeft: theme.spacing(2),
    }
}))
const zoomMarks = [
    {value: 0, label: '-20',},
    {value: 1, label: '-15',},
    {value: 2, label: '-10',},
    {value: 3, label: '-5',},
    {value: 4, label: '0',},
    {value: 5, label: '+5',},
    {value: 6, label: '+10',},
    {value: 7, label: '+15',},
    {value: 8, label: '+20',},
];
const filterCountedIcon = [
    <FilterNone/>,
    <Filter1/>,
    <Filter2/>,
    <Filter3/>,
    <Filter4/>,
    <Filter5/>,
    <Filter6/>,
    <Filter7/>,
    <Filter8/>,
    <Filter9/>,
    <Filter9Plus/>,
]
const download = (downloadName, blob) => {
    const element = document.createElement('a')
    element.href = blob;
    element.download = downloadName;
    element.click();
}

const chartDataToBook = (cd) => {
    const dates = jp.nodes(cd.chart, '$.*').map(v => v.path[1])
    const fields = jp.nodes(cd.filter, '$..*').filter(n => typeof n.value !== 'object').map(v => v.path.slice(1))
    const allComb = dates.map(dt => fields.map(fds => [dt, ...fds]))
    console.log(allComb
        .map(p =>
            p.map(v =>
                jp.value(cd.chart, jp.stringify(v)) ?? null
            )
        ))
    const wb = xlsx.utils.book_new()
    wb.Props = {
        Title: `${cd.title}`,
        Author: "iofarm-dailyreport",
        CreatedDate: new Date(),
    }
    wb.SheetNames.push('chart')
    wb.Sheets['chart'] = xlsx.utils.aoa_to_sheet([
        ['', ...fields.map(value => value.join('.'))],
        ...allComb
            .map(p =>
                p.map(v =>
                    jp.value(cd.chart, jp.stringify(v)) ?? null
                )
            )
            .map((v, i) => [dates[i], ...v])
    ])
    return wb
}
export default function ({enlarge, reduxChartId, onEnlarging, onDelete}) {
    //
    if (enlarge === undefined) {
        // undefined인 경우 자체적으로 enlarge기능 구현
        const tmp = useState(false)
        enlarge = tmp[0]
        const prevOnEnlarging = onEnlarging
        onEnlarging = (ev) => {
            tmp[1](!enlarge)
            if (prevOnEnlarging) {
                prevOnEnlarging(ev)
            }
        }
    }
    //
    const chartData = useSelector(SelectChart(reduxChartId))
    const chartDataFilterCount = useSelector(SelectFilterCount(reduxChartId))
    //
    const defaultOpened = FilterTreeDefaultExpand.map(arr => jp.stringify(['$', ...arr]))
    const totalOpened = [
        "$",
        ...jp.nodes(chartData.filter, '$..*')
            .filter(elem => typeof elem.value === 'object')
            .map(elem => jp.stringify(elem.path))
    ]
    //
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const classes = useClasses()
    // const [beginDate, setBeginDate] = useState(parse(chartData.range[0], chartData.config.dateFormat, new Date()));
    // const [endDate, setEndDate] = useState(parse(chartData.range[1], chartData.config.dateFormat, new Date()));
    const [zoomMenu, setZoomMenu] = useState(false);
    const [exportMenu, setExportMenu] = useState(false);
    const [zoom, setZoom] = useState(4);
    const [filterSearch, setFilterSearch] = useState("");
    const [filterExpand, setFilterExpand] = useState(defaultOpened);
    const [isModalFieldFilter, setModalFieldFilter] = useState(false);
    const [isModalFieldConfig, setModalFieldConfig] = useState(false);
    const [isModalYAxisConfig, setModalYAxisConfig] = useState(false);
    const {module, format} = useSelector(SelectLocale)
    const scrollRef = useRef()
    const zoomRef = useRef()
    const exportMenuRef = useRef()
    //
    const helpSliderFormat = v => `${-20 + 5 * v}`
    //
    const handleGridTransitionEnd = (ev) => {
        if (ev.propertyName === 'max-width') {
            scrollRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }
    const handleBeginDateChange = (date) => {
        dispatch(ChartManager.actions.modifyChartRangeBegin({
            id : reduxChartId,
            date : dfmt(date, chartData.config.dateFormat),
        }))
    }
    const handleEndDateChange = (date) => {
        dispatch(ChartManager.actions.modifyChartRangeEnd({
            id : reduxChartId,
            date : dfmt(date, chartData.config.dateFormat),
        }))
    }
    const handleZoomChange = (ev, number) => {
        setZoom(number)
    }
    const handleZoomChangeCommit = (ev, number) => {
        let n = 5 * (number - 4)
        dispatch(ChartManager.actions.modifyChart({
            id: reduxChartId,
            path: '$.config.zoom',
            value: n,
        }))
    }
    const handleFilterNodeSelected = (ev, sel) => {
        if (filterExpand.find(e => e === sel)) {
            setFilterExpand(filterExpand.filter(e => e !== sel))
        } else {
            setFilterExpand([...filterExpand, sel])
        }
    }
    const handleFilterReset = () => {
        setFilterExpand(defaultOpened)
    }
    const handleFilterExpandAll = () => {
        setFilterExpand(totalOpened)
    }
    const hookThemeProvider = (theme) => {
        theme.overrides.MuiFilledInput = {
            input: {
                padding: '6px 0 7px',
                textAlign: 'center',
            }
        }
        return theme
    }
    const handleFilterOpen = () => {
        setModalFieldFilter(true)
        setFilterSearch("")
        setFilterExpand(defaultOpened)
    }
    const handleFilterClose = () => {
        setModalFieldFilter(false)
    }
    const handleFieldLineType = (elem, change) => {
        dispatch(ChartManager.actions.modifyChartDisplay({
            id: reduxChartId,
            path: `${elem.json}.type`,
            value: change,
        }))
        dispatch(ChartManager.actions.modifyChartDisplay({
            id: reduxChartId,
            path: `${elem.json}["dot-show"]`,
            value: change === 'line' ? true : undefined,
        }))
    }
    const handleFieldColor = (elem, change) => {
        dispatch(ChartManager.actions.modifyChartDisplay({
            id: reduxChartId,
            path: `${elem.json}.color`,
            value: change,
        }))
    }
    const handleFieldAxis = (elem, change) => {
        dispatch(ChartManager.actions.modifyChartDisplay({
            id: reduxChartId,
            path: `${elem.json}["y-axis"]`,
            value: change,
        }))
    }
    const handleFieldLabelShow = (elem, change) => {
        dispatch(ChartManager.actions.modifyChartDisplay({
            id: reduxChartId,
            path: `${elem.json}["label-show"]`,
            value: change,
        }))
    }
    const handleFieldDotShow = (elem, change) => {
        dispatch(ChartManager.actions.modifyChartDisplay({
            id: reduxChartId,
            path: `${elem.json}["dot-show"]`,
            value: change,
        }))
    }
    const handleExportJSON = () => {
        const output = Object.assign(
            {},
            {
                title: chartData.title,
                dataset: chartData.chart,
            }
        )
        const file = new Blob([JSON.stringify(output)], {type: 'application/json'})
        download(`${chartData.title}.json`, URL.createObjectURL(file))
    }
    const handleExportCSV = () => {
        const wb = chartDataToBook(chartData)
        const title = `${wb.Props.Title}.csv`
        xlsx.writeFile(wb, title, {
            bookType: 'csv',
        })
        // download(title, f)
    }
    const handleExportXLS = () => {
        const wb = chartDataToBook(chartData)
        const title = `${wb.Props.Title}.xls`
        xlsx.writeFile(wb, title, {
            bookType: 'xls',
        })
        // download(title, f)
    }
    const handleExportXLSX = () => {
        const wb = chartDataToBook(chartData)
        const title = `${wb.Props.Title}.xlsx`
        xlsx.writeFile(wb, title, {
            bookType: 'xlsx',
        })
    }
    // effect
    // render function
    const renderTreeFilter = (curr, path) => {
        const id = jp.stringify(path)
        const children = typeof curr === 'object' ? jp.nodes(curr, `$.*`) : []
        const isTrue = typeof curr === 'boolean' ? curr : jp.query(curr, "$..*").reduce(
            (acc, n) => Boolean(typeof n === 'boolean' ? acc && n : acc),
            true,
        )
        const isIndeterminate = typeof curr === 'boolean' || isTrue ? false : jp.query(curr, "$..*").reduce(
            (acc, n) => Boolean(typeof n === 'boolean' ? acc || n : acc),
            false,
        )
        let tkey = t(
            path.length === 1 ? 'contents.chart.toolbar.filter-modal.root-filter' : `contents.chart.fields.${path.slice(1).join('.')}`,
            {returnObjects: true}
        )
        tkey = typeof tkey === 'object' ? tkey['.default'] : tkey
        const childrenNodes = children.map(child => renderTreeFilter(child.value, [...path, child.path[child.path.length - 1]]))
        const isChildrenOneOfVisible = childrenNodes.map(cn => cn.props.style.display === 'block').reduce((acc, e) => acc || e, false)
        const isVisible = filterSearch.length === 0 || (isChildrenOneOfVisible || tkey.match(filterSearch))
        return <TreeItem
            style={{display: isVisible ? 'block' : 'none'}}
            key={id} nodeId={id}
            label={
                <FormControlLabel
                    className={classes.treeViewItem}
                    margin="dense"
                    onClick={e => e.stopPropagation()}
                    control={
                        <Checkbox
                            color="primary"
                            checked={isTrue || isIndeterminate}
                            indeterminate={isIndeterminate}
                            onChange={(event, checked) => {
                                dispatch(
                                    ChartManager.actions.modifyChartFilter({
                                        id: reduxChartId,
                                        path: typeof curr === 'object' ? `${id}..*` : id,
                                        value: isIndeterminate ? true : checked,
                                    })
                                )
                            }}
                        />
                    }
                    label={tkey}
                    key={id}
                />
            }
        >
            {childrenNodes}
        </TreeItem>
    }

    const selectedFields = jp.paths(chartData.filter, '$..*[?(@==true)]').map(v => ({
        json: jp.stringify(v),
        i18n: `contents.chart.fields.${v.slice(1).join('.')}`,
        field: jp.value(chartData.display, jp.stringify(v))
    }))
    return (
        <MuiThemeProvider theme={hookThemeProvider}>
            <Grid item xs={12} lg={enlarge ? 12 : 6} className={classes.gridTransition}
                  onTransitionEnd={handleGridTransitionEnd}>
                <Box ref={scrollRef} visibility="hidden" position='relative' bottom='74px'/>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={module}>
                    <Card
                        className={`${classes.chartCard} ${enlarge ? classes.chartCardLarge : classes.chartCardSmall}`}>
                        <CardContent className={classes.header}>
                            <Box display="flex" flexDirection="row" paddingX="2px">
                                <Box display="flex" alignItems="center">
                                    <Hidden mdDown>
                                        <Typography
                                            className={classes.chartTitle}>{t('contents.chart.meta.date')}</Typography>
                                    </Hidden>
                                </Box>
                                <Box className={classes.datePickerCardOuter}>
                                    <CardActions className={classes.zeroDateAction}>
                                        <DatePicker
                                            // disableToolbar
                                            className={classes.datePicker}
                                            format={format}
                                            value={parse(chartData.range[0], chartData.config.dateFormat, new Date())}
                                            inputVariant="filled"
                                            onChange={handleBeginDateChange}
                                            style={{marginRight: '5px'}}
                                        />
                                        ~
                                        <DatePicker
                                            className={classes.datePicker}
                                            format={format}
                                            value={parse(chartData.range[1], chartData.config.dateFormat, new Date())}
                                            inputVariant="filled"
                                            onChange={handleEndDateChange}
                                        />
                                    </CardActions>
                                </Box>

                                {/* Spacer */} <Box flexGrow={1}/>
                                <CardActions className={classes.headerButtonGroup} ref={exportMenuRef}>
                                    <Hidden mdDown>
                                        <Button variant="contained"
                                                onClick={() => setExportMenu(true)}
                                                color="primary">{t('contents.chart.toolbar.export')}</Button>
                                    </Hidden>
                                    <Hidden mdUp>
                                        <Tooltip title={t('contents.chart.toolbar.export')}>
                                            <IconButton size="small" color="primary"
                                                        onClick={() => setExportMenu(true)}><GetApp/></IconButton>
                                        </Tooltip>
                                    </Hidden>
                                </CardActions>
                                <Menu
                                    open={exportMenu} onClose={() => setExportMenu(false)}
                                    anchorEl={exportMenuRef.current}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem
                                        onClick={handleExportCSV}>
                                        <ListItemIcon>
                                            <GetApp fontSize="small"/>
                                        </ListItemIcon>
                                        {t('contents.chart.toolbar.export-as', {'as': 'csv'})}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleExportJSON}>
                                        <ListItemIcon>
                                            <GetApp fontSize="small"/>
                                        </ListItemIcon>
                                        {t('contents.chart.toolbar.export-as', {'as': 'json'})}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleExportXLSX}>
                                        <ListItemIcon>
                                            <GetApp fontSize="small"/>
                                        </ListItemIcon>
                                        {t('contents.chart.toolbar.export-as', {'as': 'xlsx'})}
                                    </MenuItem>
                                    <Tooltip title={t('contents.chart.toolbar.export-not-recommended')}>
                                        <MenuItem
                                            color="error"
                                            onClick={handleExportXLS}>
                                            <ListItemIcon>
                                                <Warning fontSize="small" color="error"/>
                                            </ListItemIcon>
                                            {t('contents.chart.toolbar.export-as', {'as': 'xls'})}
                                        </MenuItem>
                                    </Tooltip>
                                </Menu>
                            </Box>
                        </CardContent>
                        <CardContent className={classes.chartView}>
                            <ChartView chartID={reduxChartId}/>
                        </CardContent>
                        <CardActions>
                            <Box flexGrow={1}/>
                            <Tooltip title={t('contents.chart.toolbar.zoom-in-hint')}>
                                <IconButton onClick={() => setZoomMenu(!zoomMenu)} ref={zoomRef}>
                                    <SwapHoriz/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                classes={{paper: classes.zoomMenuPaper, list: classes.zoomMenuList}}
                                open={zoomMenu} onClose={() => setZoomMenu(!zoomMenu)}
                                anchorEl={zoomRef.current}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                            >
                                <Box display="flex" flexDirection="row">
                                    <Box marginX="5px">
                                        <Slider
                                            className={classes.zoomSlider}
                                            getAriaValueText={helpSliderFormat}
                                            valueLabelFormat={helpSliderFormat}
                                            value={zoom}
                                            onChange={handleZoomChange}
                                            onChangeCommitted={handleZoomChangeCommit}
                                            min={0}
                                            step={1}
                                            max={zoomMarks.length - 1}
                                            valueLabelDisplay="auto"
                                            marks={zoomMarks}
                                        />
                                    </Box>
                                </Box>
                            </Menu>
                            <Tooltip title={t('contents.chart.toolbar.fields-filter-hint')}>
                                <IconButton onClick={handleFilterOpen}>
                                    {chartDataFilterCount >= filterCountedIcon.length ? filterCountedIcon[filterCountedIcon.length - 1] : filterCountedIcon[chartDataFilterCount]}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t('contents.chart.toolbar.fields-config-hint')}>
                                <IconButton onClick={() => setModalFieldConfig(true)}><PermDataSetting/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('contents.chart.toolbar.axes-config-hint')}>
                                <IconButton onClick={() => setModalFieldConfig(true)}><InsertChart/></IconButton>
                            </Tooltip>
                            <Hidden mdDown>
                                <Tooltip title={t('contents.chart.toolbar.enlarge-hint')}>
                                    <IconButton onClick={onEnlarging}><AspectRatio/></IconButton>
                                </Tooltip>
                            </Hidden>
                            <Tooltip title={t('contents.chart.toolbar.delete-hint')}>
                                <IconButton onClick={onDelete}><Delete/></IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                </MuiPickersUtilsProvider>
            </Grid>
            <Modal
                className={classes.modalBase}
                open={isModalFieldFilter} onClose={handleFilterClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500,}}>
                <Card className={classes.modalCardBase}>
                    <CardContent className={classes.modalDenseContents}>
                        <Box display="flex" flexDirection="row" justifyContent="end">
                            <Typography
                                className={classes.modalCardTitle}>{t('contents.chart.toolbar.filter-modal.title')}</Typography>
                            <Box flexGrow={1}/>
                            <Box><IconButton size="small" onClick={handleFilterClose}><Close/></IconButton></Box>
                        </Box>
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <TextField
                            // className={classes.margin}
                            // id="input-with-icon-textfield"
                            value={filterSearch}
                            onChange={ev => setFilterSearch(ev.target.value)}
                            label={t('contents.chart.toolbar.filter-modal.selected', {selected: chartDataFilterCount})}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>
                                ),
                                endAdornment: filterSearch.length === 0 ? null :
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            aria-label="toggle password visibility"
                                            onClick={() => setFilterSearch('')}
                                        >
                                            <Clear/>
                                        </IconButton>
                                    </InputAdornment>
                            }}

                        />
                    </CardActions>
                    <CardActions>
                        <Card variant="outlined" className={classes.treeViewBase}>
                            <TreeView
                                defaultCollapseIcon={<ExpandMore/>}
                                defaultExpandIcon={<ChevronRight/>}
                                expanded={filterExpand}
                                onNodeSelect={handleFilterNodeSelected}
                            >
                                {renderTreeFilter(chartData.filter, ['$'])}
                            </TreeView>
                        </Card>
                    </CardActions>
                    <CardActions>
                        <Box flexGrow={1}/>
                        <Box>
                            <Button
                                disabled={filterExpand.length === defaultOpened.length && filterExpand.every((v, i) => v === defaultOpened[i])}
                                onClick={handleFilterReset}>{t('contents.chart.toolbar.filter-modal.reset')}</Button>
                        </Box>
                        <Box>
                            <Button
                                disabled={filterExpand.length === totalOpened.length && filterExpand.every((v, i) => v === totalOpened[i])}
                                onClick={handleFilterExpandAll}>{t('contents.chart.toolbar.filter-modal.expand-all')}</Button>
                        </Box>
                    </CardActions>
                </Card>
            </Modal>
            <Modal
                className={classes.modalBase}
                open={isModalFieldConfig} onClose={() => setModalFieldConfig(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500,}}>
                <Card className={classes.modalCardBase}>
                    <CardContent className={classes.modalDenseContents}>
                        <Box display="flex" flexDirection="row" justifyContent="end">
                            <Typography
                                className={classes.modalCardTitle}>{t('contents.chart.config.head.item')}</Typography>
                            <Box flexGrow={1}/>
                            <Box><IconButton size="small"
                                             onClick={() => setModalFieldConfig(false)}><Close/></IconButton></Box>
                        </Box>
                    </CardContent>
                    <CardContent className={classes.modalConfigContents}>

                        <Card variant="outlined" className={classes.modalConfigContentsCard}>
                            {
                                selectedFields
                                    .map(
                                        elem => <FieldConfig
                                            key={elem.json} title={t(elem.i18n)} data={elem.field}
                                            onLineType={(change) => {
                                                handleFieldLineType(elem, change)
                                            }}
                                            onColor={(change) => {
                                                handleFieldColor(elem, change)
                                            }}
                                            onAxis={(change) => {
                                                handleFieldAxis(elem, change)
                                            }}
                                            onLabelShow={(change) => {
                                                handleFieldLabelShow(elem, change)
                                            }}
                                            onDotShow={(change) => {
                                                handleFieldDotShow(elem, change)
                                            }}
                                        />
                                    )
                            }
                        </Card>
                    </CardContent>
                </Card>
            </Modal>
        </MuiThemeProvider>
    )
}