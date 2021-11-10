import "./TextBox.scss";
import PropTypes from 'prop-types';

function TextBox(props) {
  return (
    <input type="text" placeholder={ props.placeholder } />
  )
}

TextBox.propTypes = {
  placeholder: PropTypes.string
}

export default TextBox;
