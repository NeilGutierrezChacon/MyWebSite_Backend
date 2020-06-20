document.getElementById("signIn").addEventListener("click", () => {
  axios
    .get("/AdminSignIn")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});
