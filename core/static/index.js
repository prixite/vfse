/*eslint @typescript-eslint/no-unused-vars: "off"*/

function showHidePassword(id) {
  if (document.getElementById(id).type === "password") {
    document.getElementById(id).type = "text";
  } else {
    document.getElementById(id).type = "password";
  }
}
