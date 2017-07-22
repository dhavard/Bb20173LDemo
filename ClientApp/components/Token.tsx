import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as TokenState from '../store/Token';
import * as Config from './Config';

// At runtime, Redux will merge together...
type TokenProps =
    TokenState.TokenState        // ... state we've requested from the Redux store
    & typeof TokenState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>;

class Token extends React.Component<TokenProps, {}> {

    componentWillMount() {
        // This method runs when the component is first added to the page
        if( this.props.token.user_id == null ) {
            let grantType = 'grantType';
            let code = 'code';
            let refreshToken = 'refreshToken';
            this.props.requestToken(grantType, code, refreshToken);
        }
    }

    public handleGetToken() : void {
        let grantType = 'grantType';
        let code = 'code';
        let refreshToken = 'refreshToken';
        this.props.requestToken(grantType, code, refreshToken);
    }

    public render() {
        return <div>
            <div className="bd-pageheader">
                <div className="container text-center">
                    <h1>Access Token</h1>
                    <p className="lead">Here we are retreving an access token from the server</p>
                </div>
            </div>
            <h2>Result</h2>
            { this.renderTokenTable() }
            { this.renderPagination() }
        </div>;
    }

    private renderTokenTable() {
        return <table className='table table-sm table-striped'>
            <thead className="thead-inverse">
                <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>User</td>
                    <td>{ this.props.token.user_id }</td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>{ this.props.token.token_type }</td>
                </tr>
                <tr>
                    <td>Expires In</td>
                    <td>{ this.props.token.expires_in }</td>
                </tr>
                <tr>
                    <td>Access Token</td>
                    <td>{ this.props.token.access_token }</td>
                </tr>
                <tr>
                    <td>Refresh Token</td>
                    <td>{ this.props.token.refresh_token }</td>
                </tr>
                <tr>
                    <td>Scope</td>
                    <td>{ this.props.token.scope }</td>
                </tr>
            </tbody>
        </table>;
    }

    private renderPagination() {
        return <p className='clearfix text-center'>
            <button className='btn btn-primary pull-right' onClick={ () => this.handleGetToken() }>Request Token</button>
            { this.props.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
}

export default connect(
    (state: ApplicationState) => state.token, // Selects which state properties are merged into the component's props
    TokenState.actionCreators                 // Selects which action creators are merged into the component's props
)(Token) as typeof Token;
