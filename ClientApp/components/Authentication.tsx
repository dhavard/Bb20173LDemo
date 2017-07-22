import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as AuthenticationState from '../store/Authentication';

// At runtime, Redux will merge together...
type AuthenticationProps =
    AuthenticationState.AuthenticationState        // ... state we've requested from the Redux store
    & typeof AuthenticationState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ authDataIndex: string }>; // ... plus incoming routing parameters   

class Authentication extends React.Component<AuthenticationProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let authDataIndex = parseInt(this.props.match.params.authDataIndex) || 0;
        this.props.requestAuthentication(authDataIndex);
    }

    componentWillReceiveProps(nextProps: AuthenticationProps) {
        // This method runs when incoming props (e.g., route params) change
        let authDataIndex = parseInt(nextProps.match.params.authDataIndex) || 0;
        this.props.requestAuthentication(authDataIndex);
    }

    public render() {
        return <div>
            <h1>Test page</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            { this.renderAuthenticationTable() }
            { this.renderPagination() }
        </div>;
    }

    private renderAuthenticationTable() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
            {this.props.forecasts.map(forecast =>
                <tr key={ forecast.dateFormatted }>
                    <td>{ forecast.dateFormatted }</td>
                    <td>{ forecast.temperatureC }</td>
                    <td>{ forecast.temperatureF }</td>
                    <td>{ forecast.summary }</td>
                </tr>
            )}
            </tbody>
        </table>;
    }

    private renderPagination() {
        let prevAuthDataIndex = this.props.authDataIndex - 5;
        let nextAuthDataIndex= this.props.authDataIndex + 5;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={ `/authentication/${ prevAuthDataIndex }` }>Previous</Link>
            <Link className='btn btn-default pull-right' to={ `/authentication/${ nextAuthDataIndex }` }>Next</Link>
            { this.props.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
}

export default connect(
    (state: ApplicationState) => state.authData, // Selects which state properties are merged into the component's props
    AuthenticationState.actionCreators                 // Selects which action creators are merged into the component's props
)(Authentication) as typeof Authentication;
