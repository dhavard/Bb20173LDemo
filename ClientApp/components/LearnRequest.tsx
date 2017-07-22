import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as RequestState from '../store/LearnRequest';

// At runtime, Redux will merge together...
type RequestProps =
    RequestState.LearnRequestState        // ... state we've requested from the Redux store
    & typeof RequestState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>;

class LearnRequest extends React.Component<RequestProps, {}> {

    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.getLastRequest();
    }

    componentWillReceiveProps(nextProps) {
        // This method runs when the component is first added to the page
        this.setState(nextProps);
    }

    public handleRequestUpdate(event: any) : void {
        //var update = {...this.state, learnRequest: { [event.target.id]: event.target.value }};
        var update = {learnRequest: { [event.target.id]: event.target.value }};
        this.setState(update);
        this.props.updateRequest(update);
    }

    public handleGetRequest() : void {
        this.props.getLastRequest();
    }

    public handleSendRequest() : void {
        console.log( "sendRequest handler" + JSON.stringify( this.props.learnRequest, null, 2) );   
        this.props.sendRequest(this.props.learnRequest);
        this.handleGetRequest();
    }

    public render() {
        return <div>
            <div className="bd-pageheader">
                <div className="container text-center">
                    <h1>Last Request Sent to Learn</h1>
                    <p className="lead">This is the information about the last request sent from our application to Learn.</p>
                </div>
            </div>
            { this.renderUrl() }
            { this.renderAuthHeader() }
            { this.renderBody() }
            { this.renderPagination() }
        </div>;
    }

    private renderUrl() {
        return <div className="config-page">
            <h2>Location</h2>
            <div className="input-group">
                <span className="input-group-addon config-input">Http Action</span>
                <input id="method" type="text" className="form-control method-input" onChange={ e => this.handleRequestUpdate(e)} defaultValue={ this.props.learnRequest.method }/>
            </div>
            <div className="input-group">
                <span className="input-group-addon config-input">Url</span>
                <input id="url" type="text" className="form-control" onChange={ e => this.handleRequestUpdate(e)} defaultValue={ this.props.learnRequest.url }/>
            </div>
        </div>;
    }

    private renderAuthHeader() {
        return <div>
            <h2>Authorization Header</h2>
            <div><pre>{ this.props.learnRequest.authHeader }</pre></div>
        </div>;
    }

    private renderBody() {
        return <div>
            <h2>Body</h2>
            <div className="form-group">
                <textarea id="body" className="form-control json-input" onChange={ e => this.handleRequestUpdate(e)} defaultValue={ this.props.learnRequest.body }/>
            </div>
        </div>;
    }

    private renderPagination() {
        return <p className='clearfix text-center'>
            <button className='btn btn-default pull-right' onClick={ () => this.handleGetRequest() }>Refresh</button>
            <button className='btn btn-primary pull-right' onClick={ () => this.handleSendRequest() }>Send</button>
        </p>;
    }
}

export default connect(
    (state: ApplicationState) => state.learnRequest, // Selects which state properties are merged into the component's props
    RequestState.actionCreators                 // Selects which action creators are merged into the component's props
)(LearnRequest) as typeof LearnRequest;