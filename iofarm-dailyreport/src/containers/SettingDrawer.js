import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Switch,
    useTheme
} from "@material-ui/core"
import {Brightness4, Language, Settings} from "@material-ui/icons";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import ThemeManager from "../store/ThemeManager";

export default function () {
    // Redux
    const dispatch = useDispatch()
    const theme = useTheme()
    //
    const {t, i18n} = useTranslation()
    const [isDark, setIsDark] = useState(theme.palette?.type === 'dark')
    const [openSetting, setOpenSetting] = useState(false)
    const [openLanguage, setOpenLanguage] = useState(false)
    const settingAnchorEl = useRef()
    const languageAnchorEl = useRef()
    // handlers
    const enterSetting = () => {
        setOpenSetting(true)
    }
    const closeSetting = () => {
        setOpenSetting(false)
    }
    const enterLanguage = () => {
        setOpenLanguage(true)
    }
    const closeLanguage = () => {
        setOpenLanguage(false)
    }
    const selectLanguage = async (key) => {
        await i18n.changeLanguage(key)
        setOpenLanguage(false)
    }
    const switchDarkMode = () => {
        if (isDark) {
            dispatch(ThemeManager.actions.toLight())
        } else {
            dispatch(ThemeManager.actions.toDark())
        }
    }
    // effect
    useEffect(
        () => setIsDark(theme.palette?.type === 'dark'),
        [theme]
    )
    //
    return (
        <div>
            <IconButton ref={settingAnchorEl} onClick={enterSetting}>
                <Settings/>
            </IconButton>
            <Menu
                keepMounted
                anchorReference="anchorEl"
                anchorEl={settingAnchorEl.current}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={openSetting}
                onClose={closeSetting}
            >
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Brightness4/>
                        </ListItemIcon>
                        <ListItemText primary={t('nav.menus.dark')}/>
                        <Switch checked={isDark} onChange={switchDarkMode}/>
                    </ListItem>
                    <ListItem button
                              ref={languageAnchorEl}
                              onClick={enterLanguage}>
                        <ListItemIcon>
                            <Language/>
                        </ListItemIcon>
                        <ListItemText primary={t('nav.menus.language')}/>
                    </ListItem>
                </List>
            </Menu>
            {/* 언어 설정 Menu 창 : */}
            <Menu
                keepMounted
                anchorReference="anchorEl"
                anchorEl={languageAnchorEl.current}
                getContentAnchorEl={null}
                open={openLanguage}
                onClose={closeLanguage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {
                    Object.keys(i18n.store.data).map((lang) => {
                        return <MenuItem key={lang}
                                         onClick={() => selectLanguage(lang)}>{t('language', {lng: lang})}</MenuItem>
                    })
                }
            </Menu>
        </div>
    )
}