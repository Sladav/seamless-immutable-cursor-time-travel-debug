import React from 'react';

const withCursors = (rootCursor) => (WrappedComponent) => {

  class ComponentWithCursors extends React.Component {
    constructor(props) {
      super(props)

      this.cursors = props.cursors

      this.state = {}
      Object.entries(this.cursors).map(([key, cursor]) => {
        this.state[key] = cursor.data
      })
    }

    componentDidMount() {
      rootCursor.onChange((rootNextData, rootPrevData, pathUpdated) => {
        Object.entries(this.cursors).map(([key, cursor]) => {
          let hasCommonStartingPath = true;
          for(let i = 0; i < Math.min(pathUpdated.length, cursor.path.length); i++) {
            hasCommonStartingPath = hasCommonStartingPath && (pathUpdated[i] === cursor.path[i])
          }

          if(hasCommonStartingPath) {
            const nextData = cursor.path.reduce((data, path) => data[path], rootNextData)
            const prevData = cursor.path.reduce((data, path) => data[path], rootPrevData)

            // ancestor was updated, so check to see if the cursor's data was actually changed
            if(nextData !== prevData)
              this.setState({[key]: nextData})
          }
        })
      })
    }

    componentWillUnmount() {
      // TODO: Can seamless-immutable-cursors remove listeners??
    }

    render() {
      return <WrappedComponent {...this.state} {...Object.assign({}, this.props, {cursors: undefined})} />
    }
  }

  ComponentWithCursors.displayName = `ComponentWithCursors(${getDisplayName(WrappedComponent)})`

  ComponentWithCursors.propTypes = {
      cursors: React.PropTypes.object.isRequired
  }

  return ComponentWithCursors
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default withCursors
