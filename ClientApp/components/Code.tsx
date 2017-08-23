import * as queryString from 'query-string';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CodeState from '../store/Code';

type CodeProps =
    CodeState.CodeState
    & typeof CodeState.actionCreators
    & RouteComponentProps<{}>;

class Code extends React.Component<CodeProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        var qps = queryString.parse(this.props.location.search);
        //console.log(JSON.stringify(qps, null, 2));
        if( qps.code ) {
            this.props.receiveCode( {
                authCode: qps.code,
                errorState: false,
                errorType: '',
                errorMessage: ''
            });
        } else {
            this.props.receiveCode( {
                authCode: '',
                errorState: true,
                errorType: qps.error,
                errorMessage: qps.error_description
            });
        }
    }

    public handleGetAccessToken() : void {
        this.props.useAuthCode( this.props.authCode );
    }

    public render() {
        return <div className="config-page">
            <div className="bd-pageheader">
                <div className="container text-center">
                    <h1>Authorization Code</h1>
                    <p className="lead">Here we can see the authorization code provided by Blackboard, which can be used to get a new access token for the user associated with the authorization.</p>
                </div>
            </div>
            { this.renderCode() }
            { this.renderError() }
        </div>;
    }

    public renderCode() {
        if( this.props.errorState === true ) {
            return;
        }
            return <div>
                <h2>Authorization Code:</h2>
            <div className="input-group">
                <span className="input-group-addon config-input">Base Url</span>
                <input id="baseUrl" type="text" className="form-control" value={ this.props.authCode }/>
            </div>
            <p className='clearfix text-center'>
                <button className='btn btn-primary pull-right' onClick={ () => this.handleGetAccessToken() }>Request Token</button>
            </p>
        </div>;
    }

    public renderError() {
        if( this.props.errorState === false ) {
            return;
        }
            return <div>
                <h2>Error Occurred:</h2>
            <div><pre>{ this.props.errorType }</pre></div>
            <div><pre>{ this.props.errorMessage }</pre></div>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.code, // Selects which state properties are merged into the component's props
    CodeState.actionCreators                 // Selects which action creators are merged into the component's props
)(Code) as typeof Code;