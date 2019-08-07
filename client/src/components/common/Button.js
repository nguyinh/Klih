import React from 'react';
import './Button.scss';

const Button = (props) => {
    let className = `klih-button ${props.className}`;
    if (props.block) {
        className += ' block';
    }

    return <button 
        disabled={props.disabled}
        className={className}
        onClick={props.onClick}>
        {props.children}
    </button>
};

export default Button;
