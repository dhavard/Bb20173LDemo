import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as ConfigState from '../store/Config';

type ConfigProps =
    ConfigState.ConfigState
    & typeof ConfigState.actionCreators
    & RouteComponentProps<{}>;

class Config extends React.Component<ConfigProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        if( this.props.baseUrl == null || this.props.baseUrl == '' ) {
            this.props.getConfig();
        }
    }

    public handleConfigUpdate(event: any) : void {
        var update = {...this.state, [event.target.id]: event.target.value};
        this.setState(update);
        this.props.updateConfig(update);
    }

    public render() {
        return <div className="config-page">
            <div className="bd-pageheader">
                <div className="container text-center">
                    <h1>Config</h1>
                    <p className="lead">Here we configure our application</p>
                </div>
            </div>
            
            <div className="input-group">
                <span className="input-group-addon config-input">Base Url</span>
                <input id="baseUrl" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.baseUrl }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Client Id</span>
                <input id="clientId" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.clientId }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Client Key</span>
                <input id="clientKey" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.clientKey }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Client Secret</span>
                <input id="clientSecret" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.clientSecret }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Token Type</span>
                <input id="tokenType" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.tokenType }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Redirect Uri</span>
                <input id="redirectUri" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.redirectUri }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Scope</span>
                <input id="scope" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.scope }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">State</span>
                <input id="state" type="text" className="form-control" onBlur={ e => this.handleConfigUpdate(e)} defaultValue={ this.props.state }/>
            </div>
        </div>;
    }
}

/*

    tokenType: string;
    redirectUri: string;
    scope: string;
    state: string;
*/

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.config, // Selects which state properties are merged into the component's props
    ConfigState.actionCreators                 // Selects which action creators are merged into the component's props
)(Config) as typeof Config;