
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button } from 'reactstrap'
//mport Input from "../components/Input.jsx";
import { Nav, NavItem, NavLink, Navbar } from 'reactstrap';
import { InputGroup, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { timingSafeEqual } from "crypto";

class DocumentDraw extends Component {
  constructor() {
    super();
    this.state = {
      undo: [],
      redo: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  preventDefault = (e) => { e.preventDefault() }

  handleChange = (e) => {
    this.preventDefault(e);
    if(e.buttons === 2 /* right mouse button */) {

      let changeItem = {}

      /* 
        Capture current values
      */
      changeItem.previousStatus = e.target.getAttribute('lit');
      changeItem.previousClass = e.target.getAttribute('class');

      if(changeItem.previousStatus) {
        /**
         * cellid = cell identifier
         * The switch below simple alternates folowing cell values
         * lit : true || false , indicates active cell
         * class : 'classname' || '', providing styling.
         */
        changeItem.cellid = e.target.getAttribute('id');
        switch(changeItem.previousStatus) {
          case 'true': 
            changeItem.currentStatus = 'false'
            changeItem.currentClass = ''
            e.target.setAttribute('lit', changeItem.currentStatus);
            e.target.setAttribute('class', changeItem.currentClass);
            break;
          case 'false': 
            changeItem.currentStatus = 'true'
            changeItem.currentClass = 'litup'
            e.target.setAttribute('lit', changeItem.currentStatus);
            e.target.setAttribute('class', changeItem.currentClass);
            break;
        }
      }

      //https://reactjs.org/docs/events.html#event-pooling
      e.persist();
      // store the event - we will use to ref cell in undo/redo
      changeItem.element = e;

      // Store undo information.
      this.pushUndoAction(changeItem);
      this.clearRedo();

      // Emit change to document. 
      this.props.documentEvents({
        cellid: e.target.getAttribute('id'),
        action: { status: changeItem.currentStatus, class: changeItem.currentClass }
      })
    }
  };

  pushUndoAction = (item) => {
    this.setState(state => {
      const undo = [...state.undo, item];
      return {
        undo
      };
    });
  }

  clearRedo = () => {
    this.setState({redo: []});
  }

  onUndoRequest = () => {

    if(this.state.undo.length > 0) {
      const changeItem = this.state.undo[this.state.undo.length - 1]
      changeItem.element.target.setAttribute('lit', changeItem.previousStatus);
      changeItem.element.target.setAttribute('class', changeItem.previousClass);

      // Emit positive change to document. 
      this.props.documentEvents({
        cellid: changeItem.element.target.getAttribute('id'),
        action: { status: changeItem.previousStatus, class: changeItem.previousClass }
      });
      
      // Pop from undo and push to redo
      this.setState(state => {
        const undo = state.undo.filter((item, j) => changeItem !== item);
        return {
          undo,
        };
      });

      this.setState(state => {
        const redo = [...state.redo, changeItem];
        return {
          redo
        };
      });
    }
  }

  onRedoRequest = () => {

    if(this.state.redo.length > 0) {
      const changeItem = this.state.redo[this.state.redo.length - 1]
      changeItem.element.target.setAttribute('lit', changeItem.currentStatus);
      changeItem.element.target.setAttribute('class', changeItem.currentClass);

      // Emit positive change to document. 
      this.props.documentEvents({
        cellid: changeItem.element.target.getAttribute('id'),
        action: { status: changeItem.currentStatus, class: changeItem.currentClass }
      })
      
      //
      // Pop from redo and push to undo
      this.setState(state => {
        const redo = state.redo.filter((item, j) => changeItem !== item);
        return {
          redo,
        };
      });
      this.setState(state => {
        const undo = [...state.undo, changeItem];
        return {
          undo
        };
      });
    }
  }

  mouseEnter = (e) => {
    let status = e.target.getAttribute('lit');
    if(status) {
      switch(status) {
        case 'true': 
          e.target.setAttribute('lit', 'false');
          e.target.setAttribute('class', '');
          break;
        case 'false': 
          e.target.setAttribute('lit', 'true');
          e.target.setAttribute('class', 'litup');
          break;
      }
    }
    //   e.target.attributes.createAttribute('lit');
  }

  buildGrid = () => {

    console.log('DOCDATA', this.props.docData)
    let rows = [];
    //if(this.props.document.name === null) {
      for (var i = 0; i < this.props.documentSettings.height; i++){
        let rowID = `row${i}`
        let cell = []
        for (var idx = 0; idx < this.props.documentSettings.width; idx++){
          let cellID = `cell${i}-${idx}`

          let cellDefaults = {
            lit: 'false',
            class: ''
          }
          if(this.props.documentData) {
            const cellData = this.props.documentData[cellID]
            if(cellData) {
              cellDefaults.lit = cellData.action.status;
              cellDefaults.class = cellData.action.class;
            }
          }

          cell.push(
            <td 
              key={cellID} 
              id={cellID} 
              style={{border:'1px solid #ccc'}}
              onMouseEnter={this.handleChange}
              onContextMenu={this.preventDefault}
              onMouseDown={this.handleChange}
              lit={cellDefaults.lit}
              className={cellDefaults.class}
              ref={(node) => {
                if (node) {
                  node.style.setProperty("width", "30px", "important");
                  node.style.setProperty("height", "30px", "important");
                }
              }}
            ></td>)
        }
        rows.push(<tr key={i} id={rowID}>{cell}</tr>)
      }

    //}
    return rows;
  }

  

  render() {
    
    return (
      
      <div style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'right', width:'100%'}}>
          <Button id={'UndoBtn'} onClick={this.onRedoRequest}  disabled={this.state.redo.length===0}>Redo</Button>&nbsp;
          <Button id={'UndoBtn'} onClick={this.onUndoRequest} disabled={this.state.undo.length===0}>Undo</Button>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width:'100%'}}>
          <div style={{display: 'flex', justifyContent: 'center', width:'90%', marginTop:40}}>
            <table>
              <tbody>
                {this.buildGrid()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default DocumentDraw;

