import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Authentication from './components/Authentication';
import Token from './components/Token';
import Config from './components/Config';
import LearnRequest from './components/LearnRequest';
import LearnResponse from './components/LearnResponse';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/token' component={ Token } />
    <Route path='/config' component={ Config } />
    <Route path='/learnRequest' component={ LearnRequest } />
    <Route path='/learnResponse' component={ LearnResponse } />
    <Route path='/counter' component={ Counter } />
    <Route path='/authentication/:authDataIndex?' component={ Authentication } />
    <Route path='/fetchdata/:startDateIndex?' component={ FetchData } />
</Layout>;
