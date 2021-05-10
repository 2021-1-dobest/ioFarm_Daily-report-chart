import {createSelector, createSlice} from "@reduxjs/toolkit";
import defaultTheme from '../res/theme.json'
import {createMuiTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import jp from "jsonpath";

//
const ThemeManager = createSlice({
    name: 'theme',
    initialState: defaultTheme,
    reducers: {
        toDark(state) {
            state.mui.common.palette.type = 'dark'
        },
        toLight(state) {
            state.mui.common.palette.type = 'light'
        },
    }
})
export default ThemeManager
export const theme = ThemeManager.reducer
// selectors
export const SelectDefaultTheme = createSelector(
    state => {
        return state.theme.mui.common
    },
    (res) => createMuiTheme(res)
)
export const SelectChartLabels = createSelector(
    state => {
        return state.theme.chart.colors
    },
    (res) => jp.nodes(res, '$.*.*')
)
// Prebuilt - Themes
export const MUIPlusButtons = makeStyles((theme) => (
    {
        success: {
            borderColor: theme.palette.success.main,
            backgroundColor: theme.palette.success.main,
        },
        warning: {
            borderColor: theme.palette.warning.main,
            backgroundColor: theme.palette.warning.main,
        },
        error: {
            borderColor: theme.palette.error.main,
            backgroundColor: theme.palette.error.main,
        },
        info: {
            borderColor: theme.palette.info.main,
            backgroundColor: theme.palette.info.main,
        },
    }
))

