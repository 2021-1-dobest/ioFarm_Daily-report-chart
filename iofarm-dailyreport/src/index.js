import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from "react-redux";
import {CircularProgress } from "@material-ui/core";

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import {store, persist} from './store';
import {i18nObject} from './i18n';
import {I18nextProvider} from 'react-i18next';
import {PersistGate} from "redux-persist/integration/react";

// 플러그인 기능 이용 현황
// =============:===========:===================================================================
// variable     : plugin    : 설명
// =============:===========:===================================================================
// i18nObject   : i18n      : 로케일을 이용한 다국어화 지원
// store        : redux     : redux를 이용한 전역 변수 관리 및 비동기화된 자원 동기화
//                          : 대표적으로 온라인에서 CSV 파일로딩 등에 이용
// reportWebVitals          : 퍼포먼스 측정용, 추후 릴리즈 단계에서 제거해야 함


ReactDOM.render(

    <I18nextProvider i18n={i18nObject}>
        <Provider store={store}>
            <PersistGate loading={<CircularProgress/>} persistor={persist}>
                <App/>
            </PersistGate>
        </Provider>
    </I18nextProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
