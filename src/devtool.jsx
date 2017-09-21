import Cursor from 'seamless-immutable-cursor'
import React from 'react'
import ReactDOM from 'react-dom';
import withCursors from './withCursors'

const ActionCard = ({index, action, state, activeStateIndex}) => {
  const summaryStyle = {
    padding: "6px 4px",
    color: index <= activeStateIndex ? "white" : "grey",
    fontWeight: index === activeStateIndex ? "bold" : "normal",
    backgroundColor: "#383c3a"
  }

  const pStyle = {
    margin: "0px",
    padding: "6px 16px",
    color: index <= activeStateIndex ? "white" : "grey",
    backgroundColor: "#525955"
  }

  return (
    <li style={{listStyle: "none"}}>
      <details open>
        <summary style={summaryStyle}>
          <span onClick={(e) => {e.preventDefault(); controls.go(index)}}>{action.actionKey} {index > 0 && index !== action.completedOn ? "⚠️" : null}</span>
        </summary>
        <p style={pStyle} onClick={(e) => {e.preventDefault(); controls.go(index)}}>
          action args: {JSON.stringify(action.actionArgs, null, '\t')}
          <br />
          <br />
          state: {JSON.stringify(state, null, '\t')}
        </p>
      </details>
    </li>
  )
}

const ActionCardList = ({actionLog, stateLog, activeStateIndex}) => {
  const actionsMarkup = actionLog.map((action, i) => {
    return <ActionCard key={i} index={i} action={actionLog[i]} state={stateLog[i]} activeStateIndex={activeStateIndex}/>
  })

  return <div style={{overflow: "auto"}}><ul>{actionsMarkup}</ul></div>;
};

const devtool = (rootCursor, actions) => {
  // get initial app state
  const initialState = {
    stateLog: [rootCursor.data],
    actionLog: [{actionKey: "INITIAL STATE", actionArgs: [null]}],
    activeStateIndex: 0,
    stack: '',
  }

  // initialize devtool state with initial state
  const devtoolCursor = new Cursor(initialState)

  // check if any state history is stored in local storage; if so, load it
  const savedState = JSON.parse(localStorage.getItem('devState'))
  if(savedState) {
    rootCursor.data = savedState.stateLog[savedState.stateLog.length - 1]
    devtoolCursor.data = savedState
  }

  // with each change, save the state history in local storage
  devtoolCursor.onChange((nextDevState) => localStorage.setItem('devState', JSON.stringify(nextDevState)))

  // for convience, refine sub-cursors
  const stateLog = devtoolCursor.refine('stateLog')
  const actionLog = devtoolCursor.refine('actionLog')
  const activeStateIndex = devtoolCursor.refine('activeStateIndex')

  // define devtool actions (aka "controls")
  const controls = {
    applyAction: (actionKey) => async (...actionArgs) => {
      // jump to latest (not allowing app to insert actions into history for simplicity)
      controls.go(stateLog.data.length - 1)

      actionLog.data = actionLog.data.concat({
        actionKey,
        actionArgs,
        completedOn: null,
        stack: ((new Error).stack || '').split('\n').map(line => line.trim())[10]
      })
      const actionIndex = actionLog.data.length - 1

      // actions will force rootCursor to update app state
      await actions[actionKey](...actionArgs)

      // use completedOn as a rough check if async actions resolve out of order
      actionLog.refine([actionIndex, 'completedOn']).data = activeStateIndex.data + 1
      stateLog.data = stateLog.data.concat(rootCursor.data)
      activeStateIndex.data = activeStateIndex.data + 1
    },
    go: (index) => {
      activeStateIndex.data = index
      rootCursor.data = stateLog.data[activeStateIndex.data]
    },
    forward: (n = 1) => {
      controls.go(Math.min(activeStateIndex.data + n, stateLog.data.length - 1))
    },
    back: (n = 1) => {
      controls.go(Math.max(activeStateIndex.data - n, 0))
    },
    clearStateHistory: () => {
      devtoolCursor.data = {
        stateLog: [rootCursor.data],
        actionLog: [],
        activeStateIndex: 0
      }
    },
    resetAppState: () => {
      devtoolCursor.data = initialState
      rootCursor.data = stateLog.data[stateLog.data.length - 1]
    }
  }

  // intercept all actions from the app
  const wrappedActions = Object.keys(actions).reduce((wrappedActions, key) => {
    return Object.assign(wrappedActions, {[key]: controls.applyAction(key)})
  },{})

  // save some stuff to window for debugging the devtool (asMutable + Object.assign is to make console.table prettier)
  window.stateLog = () => stateLog.data.asMutable().map(x=>Object.assign({},x))
  window.actionLog = () => actionLog.data.asMutable().map(x=>Object.assign({},x))
  window.controls = controls

  const devtoolUI = () => {

    const ActionCardListWithCursors = withCursors(devtoolCursor)(ActionCardList)

    ReactDOM.render(
      <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
        <button style={{flexShrink: 0}} onClick={()=>controls.resetAppState()}>reset</button>
        <ActionCardListWithCursors cursors={{actionLog, stateLog, activeStateIndex}} />
      </div>,
      document.getElementById('devtool')
    )
  }

  return {wrappedActions, controls, devtoolUI}
}

export default devtool
