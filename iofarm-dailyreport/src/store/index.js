import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";

import {theme} from "./ThemeManager";
import {locale} from "./LocaleManager";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from "redux-persist"
import storage from "redux-persist/lib/storage"


const rootReducer = combineReducers(
    {
        theme,
        locale
    }
)

const store = configureStore({
    reducer: persistReducer(
        {
            key: "iofarm",
            version: 0,
            storage,
            whitelist: ["theme"]
        },
        rootReducer
    ),
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })


})
const persist = persistStore(
    store
)
export {
    store, persist
}