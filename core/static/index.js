{
  /* <script>
  function showHidePassword(id) {
    let type = document.getElementById(id).type
    if (document.getElementById(id).type == "password") {
      document.getElementById(id).type = 'text'
    } else {
      document.getElementById(id).type = 'password'
    }
  }
</script> */
}

function showHidePassword(id) {
  let type = document.getElementById(id).type;
  if (type == "password") {
    document.getElementById(id).type = "text";
  } else {
    document.getElementById(id).type = "password";
  }
}
