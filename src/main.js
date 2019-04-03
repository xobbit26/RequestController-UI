import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Switch } from 'react-router'; 

import App from '../src/App/App';

ReactDOM.render(
	<Router>
        <App />
    </Router>,
	document.getElementById('app')
);