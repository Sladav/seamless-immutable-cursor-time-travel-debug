/*
 MIT License

 Copyright (c) 2016 Martin Snyder

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
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
