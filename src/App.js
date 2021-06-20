import React from 'react';
import ExchangeToken from './components/exchangeToken';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#41b0fe'
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExchangeToken />
    </div>
  );
}

export default App;