import React from "react";
import PropType from "prop-types";

const Input = ({label, text, type, id, value, handleChange}) => (
    <div className="form-group">
        <label htmlFor={label}>{text}</label>
        <input
            type={type}
            className="form-control"
            id={id}
            value={value}
            onChange={handleChange}
        />
    </div>
);

Input.propTypes = {
    label : PropType.string.isRequired,
    text : PropType.string.isRequired,
    id : PropType.string.isRequired,
    value : PropType.string.isRequired,
    handleChange : PropType.func.isRequired
};

export default Input;