import {createSelector, createSlice} from "@reduxjs/toolkit";
import {ko, enUS,} from 'date-fns/locale'

const dateFnsLocale = {
    'ko': ko,
    'en-US': enUS
}
const LocaleManager = createSlice({
    name: 'locale',
    initialState: {},
    reducers: {
        setLocale(state, {payload}) {
            Object.assign(
                state,
                payload,
            )
        },
    }
})
export default LocaleManager
export const locale = LocaleManager.reducer

export const SelectLocale = createSelector(
    state => state.locale,
    (res) => {
        try {
            return {
                language: res.language,
                module: dateFnsLocale[res.module],
                format: res.format
            }
        } catch (e) {
            return {
                language: res.language,
                module: dateFnsLocale.enUS,
                format: "yyyy/MM/dd"
            }
        }
    }
)