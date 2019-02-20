
import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { findDocument } from '../data/userDocuments.jsx'
import { Nav, NavItem, NavLink, Navbar } from 'reactstrap';
import DocumentDraw from "../components/DocumentDraw.jsx";

class DocumentView extends Component {
  constructor(props, context) {
    super();
    this.state = {
      defaultSettings: {
        width: 32,
        height: 32,
      },
      docData: {},
      docId: null,
      docName: '',
      saveDocModal: false,
    };
    
  }

  // onChangeDocumentName = (e) => {
  //   this.setState({currentDoc: e.target.value})
  // }

  onClickSaveDoc = () => {
    this.setState({saveDocModal: true})
  }

  onSave = (e) => {
    e.preventDefault();

    this.props.saveDoc({
      docName: e.target.elements[0].value,
      width: this.state.width,
      height: this.state.height,
      docData: this.state.docData,
      docId: this.state.docId,
    });
  }

  saveDialogClose = () => {
    this.setState({saveDocModal: false});
  }

  renderLinks = () => {

    let linkArray = [];
    linkArray.push(
      <NavItem key={'nav4'}>
        <div style={{paddingTop:5, paddingBottom:5}}>
          <Button onClick={this.onClickSaveDoc}>Save</Button>
        </div>
      </NavItem>
    )
    return linkArray;
  }

  handleDocEvent = (data) => {
    console.log('DOCUMENT EVENT', data);

    this.setState(state => {
      let docData = state.docData;
      if(data.action.status === 'false') {
        // no point in storing empty cell
        delete docData[data.cellid];
      }
      else {
        docData[data.cellid] = data;
      }
      return { ...state,  docData: docData };
    });
  }


  /**
   * 
   * @param {*} nextProps 
   * @param {*} prevState 
   * 
   * If Url parameter (id) is present and is different from the previous value
   * Load document data and put into local state - get a render etc.
   * Otherwise return null do nothing
   *  
   */
  static getDerivedStateFromProps(nextProps, prevState){

    if(nextProps.match.params.id !== null && nextProps.match.params.id !== undefined) {
      if(nextProps.match.params.name !== prevState.docName) {
        let doc = findDocument(nextProps.match.params.id, nextProps.match.params.name)
        if(doc === undefined) 
          return null;
        return { docName: doc.name, docId: doc.uuid, docData: doc.data};
      }
      else return null;
    }
    else return null;
  }

  render() {
    
    return (
      <div style={{marginRight:10, marginTop:12}} key={this.state.docId}>
        <Navbar fixed={'true'}>
          <span style={{lineHeight:'1.0', fontSize:'30px', fontWeight:'bold'}}>{'Block Draw v0.0.1a'}</span>
          <Nav style={{backgroundColor:'white'}}>
              {this.renderLinks()}
          </Nav>
        </Navbar>

        <DocumentDraw documentSettings={this.state.defaultSettings} documentData={this.state.docData} documentEvents={this.handleDocEvent}/>

        <Modal isOpen={this.state.saveDocModal} toggle={this.saveDialogClose} >
          <ModalHeader toggle={this.saveDialogClose}>Save Document</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSave}>
              <FormGroup>
                <Label for="saveDocumentName">Document Name</Label>
                <Input autoComplete="off" type="text" name="savedocumentname" id="saveDocumentName" defaultValue={this.state.docName} placeholder="Untitled"/>
              </FormGroup>
              <Button type='submit' color="primary" onClick={this.saveDialogClose}>Save</Button>
            </Form>
          </ModalBody>
        </Modal>

      </div>
    );
  }
}
export default DocumentView;

