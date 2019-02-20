
import React from 'react';
import { Nav, NavItem, NavLink, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class SideNav extends React.Component {

  constructor() {
    super();
    this.state = {
      newDocId: 1
    };
  }

  onNewDoc = () => {
    this.props.history.push('/document/newDoc' + this.state.newDocId + '/' + this.state.newDocId);
    this.setState({newDocId: this.state.newDocId + 1});
  }

  setActiveDocument = (docid) => {
    if(this.props.location.pathname.indexOf(docid) >0) {
      return 'lightgrey';
    }
    return 'white'
  }

  render() {
    
    return (
      <div style={{marginTop:26, marginLeft:20}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom:20}}>
          <div style={{paddingTop:10}}>
            <span>Documents</span>
          </div>
          <div style={{paddingRight:15}}>
            <Button id={'currentDoc'} onClick={this.onNewDoc}>New</Button>
          </div>
        </div>
        <Nav vertical>
          {
            this.props.documents && this.props.documents.length !== 0 ?
            this.props.documents.map((docItem, index) => (
              (
                <NavItem key={'side' + index}>
                  <div style={{paddingTop:5, paddingBottom:5, backgroundColor: this.setActiveDocument(docItem.uuid)}}>
                    <Link to={'/document/' + docItem.name + '/' + docItem.uuid}>{docItem.name}</Link>
                  </div>
                </NavItem>
              )
            ))
            :
            <div style={{paddingTop:5, paddingBottom:5}}>
              <span style={{fontStyle:'italic', color: 'lightgrey'}}>None</span>
            </div>
          }
        </Nav>
      </div>
    );
  }
}

export default withRouter(SideNav)