var notUsed = {
    savePost: function (post){
      
      axios
        .post("/admin/save-post", post, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          console.log(response.data.save);
          if (response.data.save) {
            window.location.replace("/admin/manage-projects");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eventSaveProcessForm: function(){
        try {
            let btns = document.getElementsByClassName("btn-save");
            
            Array.from(btns).forEach( btn => {
            btn.addEventListener("click", function () {
                var formData = new FormData();
                let idForm = this.getAttribute('id-form');
                let form = document.getElementById(idForm);
                let fields = form.getElementsByClassName('process-form');
                Array.from(fields).forEach(field => {
                let name = field.getAttribute('name');
                let value = field.value;
                if(field.classList.contains('editor')){
                    value = JSON.stringify(controller.getEditor().getContents());
                }
                formData.append(name,value);

                });
                controller.savePost(formData);
            });
            });
            
        } catch (e) {
            console.log(e);
        }
    },
    eventSendFormLogIn: function () {
      try {
        let logIn = document.getElementById("logIn");
  
        logIn.addEventListener("click", (event) => {
          let email = view.getEmail();
          let password = view.getPassword();
          event.preventDefault();
          controller.sendFormLogIn(email, password);
        });
      } catch (e) {
        console.log(e);
      }
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
    onChange: function (event) {
        /* let file = event.target.files[0];
        let reader = new FileReader();
        console.log(event.target.files);
        reader.onload = function(e) {
          // The file's text will be printed here
          console.log(e.target.result);
          view.getImage().src = e.target.result;
        };
        reader.readAsDataURL(file);
        view.getImage().img = file; */
        /* let files = event.target.files;
        console.log(files);
        view.getImage().files = files; */
    
        /* Preview with of images */
    
        let conteiner = view.getContPreViewImages();
        conteiner.innerHTML = "";
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          let reader = new FileReader();
          reader.onload = function (e) {
            // The file's text will be printed here
            console.log(e.target.result);
            view.getImage().src = e.target.result;
    
            let img = document.createElement("img");
            img.src = e.target.result;
            conteiner.appendChild(img);
          };
          reader.readAsDataURL(files[i]);
        }
    },
    eventUpdateProject: function () {
        try {
          let btnUpdate = document.getElementById("updateProject");
          btnUpdate.addEventListener("click", function (e) {
            e.preventDefault();
            console.log(view.getImage().files);
    
            let formData = new FormData();
            formData.append("id", view.getProjectId());
            formData.append("title", view.getTitle());
            formData.append("github", view.getUrlGitHub());
            formData.append("website", view.getUrlWebSite());
            for (let i = 0; i < view.getImage().files.length; i++) {
              formData.append(`images`, view.getImage().files[i]);
            }
    
            formData.append("description", view.getDescription());
    
            controller.updateProject(formData);
            console.log("Update project");
          });
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
    getDescription: function () {
      try {
        return document.getElementById("inputDescription").value;
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
    getTitle: function () {
      try {
        return document.getElementById("inputTitle").value;
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
    getUrlGitHub: function () {
      try {
        return document.getElementById("inputUrlGitHub").value;
      } catch (e) {
        console.log(e);
      }
    },
    eventAddProject: function () {
        try {
            let btnAdd = document.getElementById("addProject");
            btnAdd.addEventListener("click", function (e) {
            e.preventDefault();
            console.log(view.getImage().files);

            let formData = new FormData();
            formData.append("title", view.getTitle());
            formData.append("github", view.getUrlGitHub());
            formData.append("website", view.getUrlWebSite());
            formData.append("image", view.getImage().src);
            formData.append("description", view.getDescription());
            formData.append("images", view.getImage().files);

            controller.addProject(formData);
            console.log("Add project");
            });
        } catch (e) {
            console.log(e);
        }
    },
    addProject: function (project) {
        axios
          .post("/Admin/AddProject", project, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            if (response.data.add) {
              window.location.replace("/Admin/ManageProjects");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    updateProject: function (project) {
        axios
          .put("/Admin/EditProject", project, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            if (response.data.update) {
              window.location.replace("/Admin/ManageProjects");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    sendFormLogIn: function (email, passowrd) {
      console.log("-- not used --")
      axios
        .post("/admin", {
          email: email,
          password: passowrd,
        })
        .then(function (response) {
          console.log(response);
          /* let token = response.data.token;
          if (token) {
            document.cookie = `token=${token}`;
            window.location.replace("/Admin/MyProfile");
          } */
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    },
}