import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserCapitals, getPriceList } from '../Actions/index';
import { Grid, Card, CardContent, Typography, TextField, Button, Menu, MenuItem, ListItemIcon, ListItemText, Icon, IconButton } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
    card: {
        padding: 40,
        width: '40vw',
        height: '60vh',
        borderRadius: 25,
    },
    actionsContainer: {
        display: "flex",
        flexDirection: "column"
    },
    fromContainer: {
        paddingTop: '10vh',
        paddingBottom: '1vh',
    },
    toContainer: {
        paddingBottom: '10vh',
    },
    input: {
        width: '100%',
        "& .MuiInputBase-root.Mui-disabled": {
            color: "rgba(0, 0, 0, 1)"
        }
    },
    selectedButton: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 30,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: 1,
        fontWeight: 'bold',
    },
    button: {
        color: 'white',
        backgroundColor: '#0d6ff8',
        borderRadius: 30,
        textTransform: 'none',
        width: '100%',
        boxShadow: 1,
        fontWeight: 'bold',
    },
    swapButton: {
        borderRadius: 30,
        textTransform: 'none',
        width: '100%',
        color: 'black',
        backgroundColor: '#ffce00',
        padding: '6px 12px',
        lineHeight: 2.5,
        fontSize: 20,
        boxShadow: 'none',
        fontWeight: 'bold',
        "&:disabled": {
            color: '#bcbbbe',
            backgroundColor: "#ffeea5"
        }
    },
    resizeInput: {
        fontSize: 30
    },
    resizeHelperText: {
        fontSize: 15,
        color: '#b8b8b8',
    },
});
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));
const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

function ExchangeToken(props) {
    const classes = useStyles();
    const { userCapitals, tokenList, priceList } = useSelector(state => ({
        userCapitals: state.reducer.userCapitals,
        tokenList: state.reducer.tokenList,
        priceList: state.reducer.priceList,
    }));
    const dispatch = useDispatch()

    const [fromNumber, setFromNumber] = useState('');
    const [fromTokenType, setFromTokenType] = useState('');
    const [fromError, setFromError] = useState(false);
    const [fromHelperText, setFromHelperText] = useState("");
    const [toNumber, setToNumber] = useState('');
    const [toTokenType, setToTokenType] = useState('');
    const [toHelperText, setToHelperText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [buttonType, setButtonType] = useState();
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        // Fetch Data by APIs
        if (!!userCapitals && userCapitals.length === 0) {
            dispatch(getUserCapitals());
            dispatch(getPriceList());
        }

        // When recevied data, initial fromTokenType, fromHelperText and isClicked
        if (!!userCapitals && userCapitals.length > 0 && !fromTokenType && !isClicked) {
            setFromTokenType({ token: userCapitals[0].token, url: userCapitals[0].logoUrl })
            setFromHelperText(`Balance: ${userCapitals[0].amount} ${userCapitals[0].token}`)
            setIsClicked(true)
        }
    }, [dispatch, userCapitals, fromTokenType, isClicked])

    const _handleOpenMenu = (event, position) => {
        setButtonType(position)
        setAnchorEl(event.currentTarget);
    };
    const _handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const _handleMenuItemClicked = (event, index) => {
        // Based on new fromTokenType, get relative balance
        const balance = userCapitals.filter(element => element.token === tokenList[index].token)[0]
        const newToken = tokenList[index]
        setAnchorEl(null);
        if (buttonType === "from") {
            // When new fromTokenType is equal to toTokenType, swap their valus
            if (JSON.stringify(newToken) === JSON.stringify(toTokenType)) {
                _handleMoreIconClicked()
            }
            // When fromNumber is greater than balance, display error message
            else if (Number(fromNumber) > Number(balance.amount)) {
                setFromTokenType(newToken)
                setFromError(true)
                setFromHelperText("You don't have enough balance for Swap.")
            }
            // Based on new fromTokenType, update all relative values
            else {
                setFromTokenType(newToken)
                _calculateToValue(fromNumber, newToken, toTokenType)
                setFromError(false)
                setFromHelperText(`Balance: ${balance.amount} ${newToken.token}`)
            }
        } else {
            // When new toTokenType is equal to fromTokenType, swap their valus
            if (JSON.stringify(newToken) === JSON.stringify(fromTokenType)) {
                _handleMoreIconClicked()
            }
            // Based on new toTokenType, update all relative values
            else {
                // Check if fromNumber valid. If yes, update toNumber
                if (!!fromNumber) {
                    _calculateToValue(fromNumber, fromTokenType, newToken)
                }
                setToTokenType(newToken);
                setToHelperText(`Balance: ${balance.amount} ${newToken.token}`)
            }
        }
    };
    const _handleFromChange = (e) => {
        const value = e.target.value
        //  Check if fromTokenType valid. If yes, get relative balance
        const balance = !!fromTokenType ? userCapitals.filter(element => element.token === fromTokenType.token)[0].amount : 0
        if (!!value) {
            setFromNumber(value)
            _calculateToValue(value, fromTokenType, toTokenType)
            // When new fromNumber is greater than balance, display error message
            if (Number(value) > Number(balance)) {
                setFromError(true)
                setFromHelperText("You don't have enough balance for Swap.")
            } else {
                setFromError(false)
                //  Check if fromTokenType valid. If yes, update fromHelperText
                setFromHelperText(!!fromTokenType ? `Balance: ${balance} ${fromTokenType.token}` : "")
            }
        } else {
            setFromNumber('')
            setToNumber('')
            setFromError(false)
            //  Check if fromTokenType valid. If yes, update fromHelperText
            setFromHelperText(!!fromTokenType ? `Balance: ${balance} ${fromTokenType.token}` : "")
        }
    };
    // Calculate and set To text field value
    const _calculateToValue = (value, fToken, tToken) => {
        let result = ''
        if (!!priceList && priceList.length > 0 && !!fToken && !!tToken && !!value) {
            // Based on priceList to get each price and calculate the new toNumber
            let fromPrice = priceList.filter(element => element.token === fToken.token)[0]
            let toPrice = priceList.filter(element => element.token === tToken.token)[0]
            result = Number(value) * Number(fromPrice.price) / Number(toPrice.price)
        }
        setToNumber(result)
    };
    // Swapping text field value and token type
    const _handleMoreIconClicked = () => {
        const fromNum = fromNumber
        const fromTT = fromTokenType
        const fromBalance = !!fromTokenType ? userCapitals.filter(element => element.token === fromTokenType.token)[0].amount : 0
        const toBalance = !!toTokenType ? userCapitals.filter(element => element.token === toTokenType.token)[0].amount : 0
        setFromNumber(toNumber)
        setFromTokenType(toTokenType)
        setFromError(!!toNumber ? Number(toNumber) > Number(toBalance) : false)
        setFromHelperText(toHelperText)
        setToNumber(fromNum)
        setToTokenType(fromTT)
        setToHelperText(!!fromTokenType ? `Balance: ${fromBalance} ${fromTokenType.token}` : "")
    };
    // Swap button click function
    const _handleSwapButtonClicked = (event) => {

    };
    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Card className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                            Swap
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p" >
                            The Slippage Tolerance is 10% by default.
                        </Typography>
                        <Grid container spacing={0} direction="column">
                            <Grid container spacing={2} direction="row" className={classes.fromContainer}>
                                <Grid item xs={!!fromTokenType ? 8 : 7}>
                                    <TextField
                                        id="standard-basic"
                                        className={classes.input}
                                        InputProps={{
                                            classes: {
                                                input: classes.resizeInput,
                                            },
                                        }}
                                        FormHelperTextProps={{
                                            classes: {
                                                root: classes.resizeHelperText
                                            },
                                        }}
                                        placeholder="0.00"
                                        type="number"
                                        value={fromNumber}
                                        error={fromError}
                                        helperText={fromHelperText}
                                        onChange={_handleFromChange}
                                    />
                                </Grid>
                                {!!fromTokenType ?
                                    <Grid item xs={4}>
                                        <Button
                                            className={classes.selectedButton}
                                            size="large"
                                            variant="contained"
                                            startIcon={<Icon><img src={fromTokenType.url} height={25} width={25} alt={""} /></Icon>}
                                            endIcon={<ExpandMoreIcon />}
                                            onClick={e => _handleOpenMenu(e, "from")}
                                        >
                                            {fromTokenType.token}
                                        </Button>
                                    </Grid> :
                                    <Grid item xs={5}>
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                            endIcon={<ExpandMoreIcon />}
                                            onClick={e => _handleOpenMenu(e, "from")}
                                        >
                                            Select a token
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                            <Grid container justify="center">
                                <IconButton
                                    edge="end"
                                    onClick={_handleMoreIconClicked}
                                >
                                    <ExpandMoreIcon
                                        style={{ color: '#1975f8' }}
                                        fontSize="large"
                                    />
                                </IconButton>
                            </Grid>
                            <Grid container spacing={2} direction="row" className={classes.toContainer}>
                                <Grid item xs={!!toTokenType ? 8 : 7}>
                                    <TextField
                                        id="standard-basic"
                                        className={classes.input}
                                        InputProps={{
                                            classes: {
                                                input: classes.resizeInput,
                                            },
                                        }}
                                        FormHelperTextProps={{
                                            classes: {
                                                root: classes.resizeHelperText
                                            },
                                        }}
                                        placeholder="0.00"
                                        disabled={true}
                                        value={toNumber}
                                        helperText={toHelperText}
                                    />
                                </Grid>
                                {!!toTokenType ?
                                    <Grid item xs={4}>
                                        <Button
                                            className={classes.selectedButton}
                                            size="large"
                                            variant="contained"
                                            startIcon={<Icon><img src={toTokenType.url} height={25} width={25} alt={""} /></Icon>}
                                            endIcon={<ExpandMoreIcon />}
                                            onClick={e => _handleOpenMenu(e, "to")}
                                        >
                                            {toTokenType.token}
                                        </Button>
                                    </Grid> :
                                    <Grid item xs={5}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            className={classes.button}
                                            endIcon={<ExpandMoreIcon />}
                                            onClick={e => _handleOpenMenu(e, "to")}
                                        >
                                            Select a token
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    disabled={fromError || !fromNumber}
                                    variant="contained"
                                    className={classes.swapButton}
                                    onClick={e => _handleSwapButtonClicked(e)}
                                >
                                    Swap
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid >
            <StyledMenu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={_handleCloseMenu}
            >
                {!!tokenList && tokenList.length > 0 && tokenList.map((option, index) => (
                    <StyledMenuItem
                        key={option.token}
                        onClick={(event) => _handleMenuItemClicked(event, index)}
                    >
                        <ListItemIcon>
                            <Icon>
                                <img src={option.url} height={25} width={25} alt={""} />
                            </Icon>
                        </ListItemIcon>
                        <ListItemText primary={option.token} />
                    </StyledMenuItem>
                ))}
            </StyledMenu>
        </>
    )
}

export default ExchangeToken;