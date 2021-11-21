import React from "react";

import TextBox from "../../components/textbox/TextBox";

export default function DesignSystem(props) {
  return (
    <React.Fragment>
      <h1>Design System</h1>
      <h3>Text Box</h3>
      <TextBox placeholder="Default" />
    </React.Fragment>
  );
}
