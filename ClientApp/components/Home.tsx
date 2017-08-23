import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <div className="bd-pageheader">
                <div className="container text-center">
                    <h1>Hello, BbWorld!</h1>
                    <p className="lead">This application was made as a presentation for BbWorld 2017 and is for demostration purposes only</p>
                    <hr className="my-4"/>
                    <p className="small"><em>Source code hosted at <a href='https://github.com/dhavard/Bb20173LDemo'>GitHub</a></em></p>
                </div>
            </div>
            <div className="container">
                <div className="card card-primary mb-3">
                    <div className="card-block">
                        <blockquote className="card-blockquote">
                            <p className="lead">This project created using a template and resources:</p>
                            <ul>
                                <li><a href='https://github.com/aspnet/JavaScriptServices/'>Blackboard Developer Platform</a> for Blackboard REST API documentation and registration</li>
                                <li><a href='https://github.com/aspnet/JavaScriptServices/'>JavaScriptServices</a> for project template</li>
                                <li><a href='https://medium.com/@MaartenSikkema/using-react-redux-and-webpack-with-dotnet-core-to-build-a-modern-web-frontend-7e2d091b3ba'>Maarten Sikkema</a> and his informative article</li>
                                <li><a href='https://docs.microsoft.com/en-us/dotnet/csharp/tutorials/console-webapiclient'>C# Tutorials</a> provided by Microsoft documentation</li>
                                <li><a href='https://v4-alpha.getbootstrap.com/'>Bootstrap</a> tutorials and component library</li>
                            </ul>
                        </blockquote>
                    </div>
                </div>
                <div className="card card-primary mb-3">
                    <div className="card-block">
                        <blockquote className="card-blockquote">
                            <p className="lead">Welcome to your new single-page application, built with:</p>
                            <ul>
                                <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
                                <li><a href='https://facebook.github.io/react/'>React</a>, <a href='http://redux.js.org'>Redux</a>, and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>
                                <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>
                                <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
                            </ul>
                        </blockquote>
                    </div>
                </div>
                <div className="card card-secondary mb-3">
                    <div className="card-block">
                        <blockquote className="card-blockquote">
                            <p className="lead">To help you get started, we've also set up:</p>
                            <ul>
                                <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
                                <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>
                                <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, rebuilt React components will be injected directly into your running application, preserving its live state.</li>
                                <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>
                                <li><strong>Server-side prerendering</strong>. To optimize startup time, your React application is first rendered on the server. The initial HTML and state is then transferred to the browser, where client-side code picks up where the server left off.</li>
                            </ul>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>;
    }
}
