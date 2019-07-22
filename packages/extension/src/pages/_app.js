import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Home from './index';
import Vault from './vault';
import { history } from '../state/utils';

const App = () => {
    return (
        <React.Fragment>
            <Router history={history}>
                <div>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/vault" exact component={Vault} />
                    </Switch>
                </div>
            </Router>
        </React.Fragment>
    );
};

export default App;
