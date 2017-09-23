import React from 'react';
import ReactDOM from 'react-dom';
import DataRenderer from './DataRenderer'
import MessageList from './MessageList'
import {rootCursor, documents, messages, actions as rawActions, withRootSubCursors} from './rootCursor'
import devtool from './devtool'

const {wrappedActions, controls, devtoolUI} = devtool(rootCursor, rawActions)
devtoolUI()

const MessageListWithCursors = withRootSubCursors(MessageList)
const DataRendererWithCursors = withRootSubCursors(DataRenderer)
const {addMessage, addMessageWithIncrement, clearMessages, appendRandomAfterDelay} = wrappedActions

ReactDOM.render(
  <div>
    <div style={{margin: "15px"}}>
      In console, try...
      <ul style={{marginLeft: "25px"}}>
        <li>controls - functions to control time travel</li>
        <li>stateLog() - returns the state log</li>
        <li>actionLog() - returns the action log</li>
      </ul>
    </div>
    <hr />
    <button onClick={() => clearMessages()}>Clear Messages</button>
    <button onClick={() => addMessageWithIncrement(1)}>+</button>
    <button onClick={() => addMessageWithIncrement(-1)}>-</button>
    <button onClick={() => appendRandomAfterDelay()}>???</button>
    <DataRendererWithCursors cursors={{data: documents}} />
    <MessageListWithCursors cursors={{messages}} />
  </div>,
  document.getElementById('mountPoint')
);

// For debugging, so you can access the application state in the browser console
// NOTE: you can do this even when the debugger is not stopped at a breakpoint
window.rootCursor = rootCursor
