export const uploadImageToS3 = async (imageFile: File) => {
  const filename = `${Date.now()}_${imageFile.name
    .replace(/\s+/g, "")
    .toLowerCase()}`;

  return new Promise((resolve, reject) => {
    fetch(`${process.env.DOMAIN_NAME}/api/aws_upload_file/`, {
      method: "POST",
      body: JSON.stringify({
        filename,
        filetype: imageFile.type,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REQUEST_TOKEN}`,
        "X-CSRFToken": document.forms.csrf.csrfmiddlewaretoken.value,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        fetch(data.signedRequest, {
          method: "PUT",
          body: imageFile,
          headers: { "Content-Type": imageFile.type },
        })
          .then((_data) => {
            if (!_data.ok) reject(_data.statusText);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteImageFromS3 = async (url: string) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${process.env.DOMAIN_NAME}/api/aws_delete_file/${url.split("/")[3]}/`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": document.forms.csrf.csrfmiddlewaretoken.value,
        },
      }
    )
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
