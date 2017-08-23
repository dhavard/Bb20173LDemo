import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Token from './components/Token';
import Config from './components/Config';
import Code from './components/Code';
import LearnRequest from './components/LearnRequest';
import LearnResponse from './components/LearnResponse';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/token' component={ Token } />
    <Route path='/config' component={ Config } />
    <Route path='/code' component={ Code } />
    <Route path='/learnRequest' component={ LearnRequest } />
    <Route path='/learnResponse' component={ LearnResponse } />
</Layout>;
