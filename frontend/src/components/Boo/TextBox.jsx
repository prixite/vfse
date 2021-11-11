import "./TextBox.scss";
import PropTypes from "prop-types";

function TextBox(props) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      className={props.className}
    />
  );
}

TextBox.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default TextBox;
