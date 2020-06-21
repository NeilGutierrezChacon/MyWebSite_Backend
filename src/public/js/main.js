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
          if(token){
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
    },
    getEmail: function () {
      return document.getElementById("inputEmail").value;
    },
    getPassword: function () {
      return document.getElementById("inputPassword").value;
    },
    eventSendFormSignIn: function () {
      let signIn = document.getElementById("signIn");

      signIn.addEventListener("click", (event) => {
        console.log(event);
        event.preventDefault();
        controller.sendFormSignIn();
      });
    },
  };

  controller.init();
};
