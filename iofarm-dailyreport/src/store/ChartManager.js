import {createSelector, createSlice} from "@reduxjs/toolkit";
import jp from "jsonpath";
import {format, parse} from 'date-fns'
import ChartDisplayDefault from '../res/jsons/ChartDisplayDefault.json'

const DEFAULT_IMPORT_DATEFORMAT = 'yyyy-MM-dd HH:mm:ss'
const DEFAULT_USING_DATEFORMAT = 'yyyy-MM-ddxxxx'

const ChartManager = createSlice({
    name: 'chart',
    initialState: {
        id: 0,
        datas: {},
    },
    reducers: {
        createChart: (state, action) => {
            // Redix-Toolkit은 immutable 관리를 직접 해줌 : [Link](https://soyoung210.github.io/redux-toolkit/tutorials/intermediate-tutorial/#mutable-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EB%A1%9C%EC%A7%81)
            // 따라서 그냥 push 해줘도 됨
            let now = new Date()
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            action.payload.importFormat = action.payload.importFormat ?? DEFAULT_IMPORT_DATEFORMAT
            action.payload.usingFormat = action.payload.usingFormat ?? DEFAULT_USING_DATEFORMAT
            action.payload.title = action.payload.title ?? `Chart ${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}`
            action.payload.range = action.payload.range ?? action.payload.dataset ?
                Object.keys(action.payload.dataset)
                    .reduce(
                        ([minD, maxD], key) => {
                            const d = parse(key, action.payload.importFormat, new Date())
                            return [
                                minD.getTime() > d.getTime() ? d : minD,
                                maxD.getTime() < d.getTime() ? d : minD,
                            ]
                        },
                        [parse(Object.keys(action.payload.dataset)[0], action.payload.importFormat, new Date()), parse(Object.keys(action.payload.dataset)[0], action.payload.importFormat, new Date())]
                    ) : [now, now]
            const {title, range, dataset, filter, config, colors} = action.payload
            action.return = state.id
            state.id += 1
            let chart = {
                title,
                range: [format(range[0], action.payload.usingFormat), format(range[1], action.payload.usingFormat)],
                chart: {},
                filter: {},
                display: {},
                config: {
                    zoom: 0,
                    dateFormat: action.payload.usingFormat,
                },
            }
            if (typeof dataset === 'object') {
                jp.nodes(dataset, '$..*')
                    .forEach((v) => {
                        const [first, ...lefts] = v.path.slice(1)
                        const at = parse(first, action.payload.importFormat, new Date())
                        const atField = format(at, action.payload.usingFormat)
                        jp.value(
                            chart,
                            jp.stringify(['$', 'chart', atField, ...lefts]),
                            typeof v.value === 'object' ? {} : v.value
                        )
                    })
                jp.nodes(dataset, '$.*..*')
                    .forEach((v) => {
                        jp.value(
                            chart.filter,
                            jp.stringify(['$', ...v.path.slice(2)]),
                            typeof v.value === 'object' ? {} : true
                        )
                    })
                jp.nodes(dataset, '$.*..*')
                    .forEach((v) => {
                        jp.value(
                            chart.display,
                            jp.stringify(['$', ...v.path.slice(2)]),
                            typeof v.value === 'object' ? {} : Object.assign({}, jp.value(ChartDisplayDefault, jp.stringify(['$', ...v.path.slice(2)])) ?? ChartDisplayDefault['.undefined'])
                        )
                    })
            }
            if (typeof filter === 'object') {
                jp.nodes(filter, '$..*')
                    .forEach((v) => {
                        jp.apply(
                            chart,
                            jp.stringify(['$', 'filter', ...v.path.slice(2)]),
                            _ => typeof v.value === 'object' ? {} : true
                        )
                    })
            }
            if (typeof config === 'object') {
                jp.nodes(config, '$..*[?(@)]')
                    .forEach((v) => {
                        jp.apply(
                            chart,
                            jp.stringify(['$', 'config', ...v.path.slice(2)]),
                            e => e ?? typeof v.value === 'object' ? {} : true
                        )
                    })
            }
            // null 로 된 색을 모두 랜덤 설정
            jp.apply(chart.display, '$..*.color', v => v ?? colors[Math.floor(Math.random() * colors.length)])
            //
            state.datas[action.return] = chart
        },
        importChart: {
            reducer: (state, action) => {
                const {title, range, filter, data, dataType} = action.payload
                switch (dataType) {
                    case 'XML':
                    case 'xml':
                        break
                    case 'csv':
                        break
                    case 'json':
                        break
                    case 'xls':
                        break
                    case 'xlsx':
                        break
                    case undefined:
                    case null:
                        action.return = `unknown dataType : '${dataType}', unknown data extension`
                        break
                }

            },
            prepare: ({title, range, filter, data, dataType}) => {
                dataType = dataType ?? data instanceof File ? data.name.split('.').pop() : null
                return {title, range, filter, data, dataType}
            },
        },
        modifyChart: (state, action) => {
            const {id, target, path, value} = action.payload
            if (target !== undefined) {
                jp.apply(jp.value(state.datas[id], target), path, _ => value)
            } else {
                jp.value(state.datas[id], path, value)
            }
        },
        modifyChartFilter: (state, action) => {
            const {id, path, value} = action.payload
            jp.apply(
                state.datas[id].filter,
                path,
                prev => {
                    if (typeof prev === 'object') {
                        return prev
                    } else {
                        return value
                    }
                }
            )
        },
        modifyChartDisplay: (state, action) => {
            const {id, path, value} = action.payload
            const applied = jp.apply(
                state.datas[id].display,
                path,
                prev => {
                    if (typeof prev === 'object') {
                        return prev
                    } else {
                        return value
                    }
                }
            )
            if(applied.length === 0){
                jp.value(
                    state.datas[id].display,
                    path,
                    value
                )
            }
        },
    }
})
export default ChartManager
export const chart = ChartManager.reducer
// selectors
export const SelectChart = (id) => createSelector(
    (state) => {
        return state.chart.datas[id]
    },
    (res) => res,
)
export const SelectFilterCount = (id) => createSelector(
    (state) => {
        return state.chart.datas[id]
    },
    (res) => {
        return jp.nodes(res, '$.filter..*').filter(v => typeof v.value === 'boolean' ? v.value : false).length
    },
)
export const SelectCountDataToNivo = (id) => createSelector(
    (state) => {
        return state.chart.datas[id]
    },
    (res) => {

    },
)