
import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import SideNav from '../components/SideNav.jsx';
import { getStorageDocuments, saveDocument, addEventListener } from '../data/userDocuments.jsx' 
import routeRoutes from '../routes/rootRoutes.jsx'


const WrappedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
      <Component {...props} {...rest}/>
  )}/>
)

const switchRoutes = (props) => (
  <Switch>
    {routeRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />;

      return <WrappedRoute path={prop.path} component={prop.component} {...props} key={key}/>

    })}
    
  </Switch>
);

export default class Root extends React.Component {
  constructor() {
    super();
    this.state = {
      userFileInfo: [],
    };
    this.addDocument = this.addDocument.bind(this);
    this.openDocument = this.openDocument.bind(this);
  }

  addDocument = function(document) {
    saveDocument(document);
  }

  openDocument = function(document) {
    // TODO maybe alternative Nav Link
  }

  /**
   * Local storage subscription
   */
  storeEventHandler = (event, documents, document) => {
    switch(event) {
      case 'saved': this.setState({userFileInfo: documents})
        break;
      default:
        break
    }
  }

  componentWillMount = () => {

    // Load all file info from storage for initial Navigation
    this.setState({userFileInfo: getStorageDocuments()})

    // Subscribe to changes in storage
    addEventListener(this.storeEventHandler)
  }

  render() {

    return (
      <div style={{position:'relative', height:'100%'}}>
        <div style={{position:'fixed', width:260, height:'100%', borderRight: '1px solid lightgrey'}}>
          <SideNav documents={this.state.userFileInfo} openDoc={this.openDocument}/>
        </div>
        <div style={{position:'relative', float:'right', width: 'calc(100% - 260px)'}}>
          {switchRoutes({saveDoc: this.addDocument})}
        </div>
      </div>
    )
  }
}
