import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import KoKr from './res/locales/ko-KR.json'
import EnUs from './res/locales/en-US.json'

import {store} from './store';
import LocaleManager from './store/LocaleManager';

// 언어 변경시 관련 로케일 변경 작업역시 동시에 수행
i18n.on(
    'languageChanged',
    (lng) => {
        store.dispatch(LocaleManager.actions.setLocale({
            language: lng,
            module: i18n.store.data[lng].config.date.locale,
            format: i18n.store.data[lng].config.date.format,
        }))
    }
)
i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: EnUs,
            ko: KoKr,
        },
        fallbackLng: 'en',
        // // 따로 건드릴 필요는 없을 듯
        // // detection : {}
        interpolation: {
            escapeValue: false,
        },
    });

export {i18n as i18nObject};

