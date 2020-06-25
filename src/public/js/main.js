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
        params: { id },
      })
      .then(function (response) {
        console.log(response);
        if (response.data.delete) {
          window.location.replace("/AdminManageProjects");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  updateProject: function (project) {
    axios
      .put("/AdminEditProject", project)
      .then(function (response) {
        if (response.data.update) {
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
    view.eventUpdateProject();
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
  getTitle: function () {
    try {
      return document.getElementById("inputTitle").value;
    } catch (e) {
      console.log(e);
    }
  },
  getUrlGitHub: function () {
    try {
      return document.getElementById("inputUrlGitHub").value;
    } catch (e) {
      console.log(e);
    }
  },
  getUrlWebSite: function () {
    try {
      return document.getElementById("inputUrlWebSite").value;
    } catch (e) {
      console.log(e);
    }
  },
  getUrlImage: function () {
    try {
      return document.getElementById("inputUrlImage").value;
    } catch (e) {
      console.log(e);
    }
  },
  getDescription: function () {
    try {
      return document.getElementById("inputDescription").value;
    } catch (e) {
      console.log(e);
    }
  },
  getProjectId: function () {
    try {
      return document.getElementById("inputProjectId").value;
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
  eventDeleteProject: function () {},
  eventUpdateProject: function () {
    try {
      let btnUpdate = document.getElementById("updateProject");
      btnUpdate.addEventListener("click", function (e) {
        e.preventDefault();
        let project = {
          id: view.getProjectId(),
          title: view.getTitle(),
          github: view.getUrlGitHub(),
          website: view.getUrlWebSite(),
          img: view.getUrlImage(),
          description: view.getDescription(),
        };
        controller.updateProject(project);
        console.log("Update project");
      });
    } catch (e) {
      console.log(e);
    }
  },
  eventSeeProjectDetail: function (id) {
    window.location.replace("/Project/" + id);
  },
};

controller.init();
/* }; */

$(document).ready(function () {
  $(".images-project").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    prevArrow: $(".prev"),
    nextArrow: $(".next"),
  });
});
