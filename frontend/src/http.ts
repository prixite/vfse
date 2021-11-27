export const getUrl = (url, callback) => {
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      callback(result);
    });
};

export const sendRequest = (url, method, data) => {
    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.forms.csrf.csrfmiddlewaretoken.value,
      },
      body: JSON.stringify(data),
    });
};

