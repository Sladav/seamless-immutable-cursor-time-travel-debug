import Cursor from 'seamless-immutable-cursor'
import withCursors from './withCursors'

// Create a root cursor
const rootCursor = new Cursor({
    users: {
        abby: 1,
        ben: 2,
        claire: 3,
        dan: 4
    },
    documents: [
        {
            name: 'CV',
            owner: 1,
            mediaType: 'application/pdf'
        },
        {
            name: 'References',
            owner: 1,
            mediaType: 'text/plain'
        }
    ],
    messages: [0]
});

const users = rootCursor.refine('users')
const documents = rootCursor.refine('documents')
const messages = rootCursor.refine('messages')

// const bindCursor = (cursor, action) => {
//   let cursorAction = action.bind(null, cursor)
//   cursorAction.cursor = cursor
//   return cursorAction
// }

const actions = {
  addMessage: async (m) => {
    messages.data = messages.data.concat(m)
  },
  addMessageWithIncrement: async (n) => {
    messages.data = messages.data.concat(messages.data[messages.data.length-1]+n)
  },
  clearMessages: async () => {
    messages.data = [0]
  },
  // Note: for devtool, you can't have callback hardcoded or it won't be able to intercept and the state change will be a mysterious change
  appendRandomAfterDelay: async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    await sleep(2000*Math.random())
    messages.data = messages.data.concat(Math.random())
  }
}

const withRootSubCursors = withCursors(rootCursor)

export default rootCursor

export {
  rootCursor,
  users,
  documents,
  messages,
  actions,
  withRootSubCursors
}
