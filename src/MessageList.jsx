import React from 'react';

// ES6 'function style' react component is a good choice for 'Pure' react components like this one
const MessageList = ({messages}) => {
    // React components don't work when frozen, but seamless-immutable is aware of this and
    // will safely skip them when executing this map operation.
    let i = 0;
    const messageMarkup = messages.map(message =>
        <div key={i++}>{message}</div>
    );

    return <div>{messageMarkup}</div>;
};

MessageList.propTypes = {
    messages: React.PropTypes.array.isRequired
};

export default MessageList;
