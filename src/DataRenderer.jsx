import React from 'react';

// ES6 'function style' react component is a good choice for 'Pure' react components like this one
const DataRenderer = ({data}) => {
    return <div>{JSON.stringify(data)}</div>;
};

DataRenderer.propTypes = {
    data: React.PropTypes.array.isRequired
};

export default DataRenderer;
