/* window.onload = function () { */
   model = {
    init: function () {},
  };

  var controller = {
    init: function () {
      console.log("init controller");
      view.init();
    },
    sendFormSignIn: function (email, passowrd) {
      axios
        .post("/AdminSignIn", {
          email: email,
          password: passowrd,
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
    deleteProject: function (id) {
      console.log(id);
      axios
        .delete("/AdminManageProjects", {
          params: {id}
        })
        .then(function (response) {
          console.log(response);
          if(response.data.delete){
            window.location.replace("/AdminManageProjects");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  };

  var view = {
    init: function () {
      console.log("init view");
      view.eventSendFormSignIn();
      view.eventShowInputNewPassword();
      view.eventDeleteProject();
    },
    getEmail: function () {
      try {
        return document.getElementById("inputEmail").value;
      } catch (e) {
        console.log(e);
      }
    },
    getPassword: function () {
      try {
        return document.getElementById("inputPassword").value;
      } catch (e) {
        console.log(e);
      }
    },
    getCheckNewPassword: function () {
      try {
        return document.getElementById("checkNewPassword");
      } catch (e) {
        console.log(e);
      }
    },
    getFormGroupNewPassword: function () {
      try {
        return document.getElementById("form-group-new-password");
      } catch (e) {
        console.log(e);
      }
    },
    eventSendFormSignIn: function () {
      try {
        let signIn = document.getElementById("signIn");
        let email = view.getEmail();
        let password = view.getPassword();
        signIn.addEventListener("click", (event) => {
          console.log(event);
          event.preventDefault();
          controller.sendFormSignIn(email, password);
        });
      } catch (e) {
        console.log(e);
      }
    },

    eventShowInputNewPassword: function () {
      try {
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
      } catch (e) {
        console.log(e);
      }
    },
    eventDeleteProject: function () {
      let buttons = document.getElementsByName("buttonDeleteProject");
      /* for(i=0;i<buttons.length;i++){
        buttons[i].addEventListener('click',function(i){
          console.log(i);
          console.log(this.id);
        });
      } */
      buttons.forEach((value,index)=>{
        value.addEventListener('click',(ev,index)=>{
          console.log(this);
        })
      });
    },
  };

  controller.init();
/* }; */
/* function toCelsius(fahrenheit) {
  console.log(fahrenheit)
  return (5/9) * (fahrenheit-32);
}
 */

