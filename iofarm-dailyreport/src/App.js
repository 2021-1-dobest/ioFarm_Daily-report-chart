import AppNav from "./components/AppNav"
import AppContents from "./components/AppContents"
import {Box, Fab, MuiThemeProvider, Toolbar, useScrollTrigger, Zoom} from "@material-ui/core";
import {SelectDefaultTheme} from "./store/ThemeManager";
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {KeyboardArrowUp} from "@material-ui/icons";
import {useEffect, useState} from "react";

const useClasses = makeStyles((theme) => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));

export default function (props) {
    const classes = useClasses()
    const mui = useSelector(SelectDefaultTheme)
    const trigger = useScrollTrigger({
        target: props.window ? props.window() : undefined,
        disableHysteresis: true,
        threshold: 100
    })
    const [multiClickBlocker, setMultiClickBlocker] = useState(false)
    //handle
    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        );
        if (!multiClickBlocker && anchor) {
            anchor.scrollIntoView({behavior: "smooth"})
        }
    }
    //
    useEffect(
        () => {
            if (trigger) {
                setMultiClickBlocker(false)
            }
        },
        [trigger]
    )
    return (
        <MuiThemeProvider theme={mui}>
            <AppNav/>
            <Toolbar id="back-to-top-anchor"/>
            <AppContents/>

            <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation" className={classes.root}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUp/>
                    </Fab>
                </div>
            </Zoom>
        </MuiThemeProvider>
    );
}
