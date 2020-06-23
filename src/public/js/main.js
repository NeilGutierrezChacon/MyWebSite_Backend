window.onload = function () {
  var model = {
    init: function () {},
  };

  var controller = {
    init: function () {
      console.log("init controller");
      view.init();
    },
    sendFormSignIn: function () {
      axios
        .post("/AdminSignIn", {
          email: view.getEmail(),
          password: view.getPassword(),
        })
        .then(function (response) {
          console.log(response.data);
          let token = response.data.token;
          if (token) {
            document.cookie = `token=${token}`;
            window.location.replace("/AdminMyProfile");
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    },
  };

  var view = {
    init: function () {
      console.log("init view");
      view.eventSendFormSignIn();
      view.eventShowInputNewPassword();
    },
    getEmail: function () {
      return document.getElementById("inputEmail").value;
    },
    getPassword: function () {
      return document.getElementById("inputPassword").value;
    },
    getCheckNewPassword: function () {
      return document.getElementById("checkNewPassword");
    },
    getFormGroupNewPassword: function () {
      return document.getElementById("form-group-new-password");
    },
    eventSendFormSignIn: function () {
      let signIn = document.getElementById("signIn");

      signIn.addEventListener("click", (event) => {
        console.log(event);
        event.preventDefault();
        controller.sendFormSignIn();
      });
    },

    eventShowInputNewPassword: function () {
      /* Hide the new password field */
      let checkNewPassword = view.getCheckNewPassword();
      let formGroupNewPassword = view.getFormGroupNewPassword();
      checkNewPassword.addEventListener("click", () => {
        if (!checkNewPassword.checked) {
          checkNewPassword.value = true;
          formGroupNewPassword.style.display = "none";
        } else {
          checkNewPassword.value = false;
          formGroupNewPassword.style.display = "block";
        }
      });
    },
  };

  controller.init();
};


