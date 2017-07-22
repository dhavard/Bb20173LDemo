import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as ResponseState from '../store/LearnResponse';

// At runtime, Redux will merge together...
type ResponseProps =
    ResponseState.LearnResponseState        // ... state we've requested from the Redux store
    & typeof ResponseState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>;

class LearnResponse extends React.Component<ResponseProps, {}> {

    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.getLastResponse();
    }

    public handleGetResponse() : void {
        this.props.getLastResponse();
    }

    public render() {
        return <div>
            <div className="bd-pageheader">
                <div className="container text-center">
                    <h1>Last Response Sent to Learn</h1>
                    <p className="lead">This is the information about the last response received by our application from Learn.</p>
                </div>
            </div>
            { this.renderUrl() }
            { this.renderStatusCode() }
            { this.renderBody() }
            { this.renderPagination() }
        </div>;
    }

    private renderUrl() {
        return <div>
            <h2>Url</h2>
            <div><pre>{ this.props.learnResponse.url }</pre></div>
        </div>;
    }

    private renderStatusCode() {
        return <div>
            <h2>Status Code</h2>
            <div><pre>{ this.props.learnResponse.statusCode }</pre></div>
        </div>;
    }

    private renderBody() {
        return <div>
            <h2>Body</h2>
            <div><pre>{ JSON.stringify(JSON.parse(this.props.learnResponse.body), null, 2) }</pre></div>
        </div>;
    }

    private renderPagination() {
        return <p className='clearfix text-center'>
            <button className='btn btn-primary pull-right' onClick={ () => this.handleGetResponse() }>Refresh</button>
        </p>;
    }
}

export default connect(
    (state: ApplicationState) => state.learnResponse, // Selects which state properties are merged into the component's props
    ResponseState.actionCreators                 // Selects which action creators are merged into the component's props
)(LearnResponse) as typeof LearnResponse;
