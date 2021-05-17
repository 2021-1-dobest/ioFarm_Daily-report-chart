import {useTranslation} from "react-i18next";
import {
    Bar,
    Brush,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {useSelector} from "react-redux";
import {SelectFilteredRechart} from "../store/ChartManager";
import {makeStyles, useTheme} from "@material-ui/core";

const useClasses = makeStyles(theme => {
    return ({
        ChartSVG: {
            "& > div": {
                overflowX: 'auto',
                overflowY: 'hidden',
            },
            "& > div svg": {
            },
        }
    })
})
const formatDate = (val) => {
    return `${('0' + Math.floor(val / 100)).slice(-2)}:${('0' + val % 100).slice(-2)}`
}
const CustomLabel = (props) => {
    const theme = useTheme()
    const {x, y, stroke, value, width} = props
    return (
        <text
            x={x} y={y} dx={width !== undefined ? width / 2 : 0} dy={-8}
            fill={theme.palette.text.primary} fontSize={20}
            textAnchor="middle" fontWeight="bold"
        >
            {value}
        </text>
    );
}

export default ({chartID}) => {
    const classes = useClasses()
    const {t} = useTranslation()
    const rechartsData = useSelector(SelectFilteredRechart(chartID))
    for (const [k, v] of Object.entries(rechartsData.configs)) {
        v['locale'] = t(`contents.chart.fields.${k}`)
    }
    const tooltipFormatDate = (value, name, props) => {
        const hint = rechartsData.typeHint[name]
        if (hint === 'time') {
            return formatDate(value)
        }
        return value
    }
    return (
        <ResponsiveContainer width="100%" height="100%" className={classes.ChartSVG}>
            <ComposedChart data={rechartsData.data} >
                <XAxis dataKey="name"/>
                <YAxis yAxisId="left" orientation="left" type="number"/>
                <YAxis yAxisId="right" orientation="right" type="number" tickFormatter={formatDate}/>
                <Tooltip formatter={tooltipFormatDate}/>
                <Legend/>
                <Brush dataKey="name"/>
                <CartesianGrid stroke="#f5f5f5"/>
                {
                    Object.entries(rechartsData.configs)
                        .filter(([_, v]) => v.type === 'bar')
                        .map(
                            ([k, v]) => {
                                return <Bar
                                    key={k} dataKey={k}
                                    type="monotone" name={t(`contents.chart.fields.${k}`)}
                                    fill={v.color}
                                    barSize={v.barSize}
                                    label={v.label ? <CustomLabel/> : undefined}
                                    yAxisId={v.yAxisId}/>
                            }
                        )
                }
                {
                    Object.entries(rechartsData.configs)
                        .filter(([_, v]) => v.type === 'line')
                        .map(
                            ([k, v]) => {
                                return <Line
                                    key={k} dataKey={k}
                                    type="monotone" name={t(`contents.chart.fields.${k}`)}
                                    stroke={v.color}
                                    label={v.label ? <CustomLabel/> : undefined}
                                    dot={v.dot}
                                    yAxisId={v.yAxisId}/>
                            }
                        )
                }
            </ComposedChart>
        </ResponsiveContainer>
    )
}