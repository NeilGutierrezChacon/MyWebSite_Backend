/**
 * @File main.js
 * @description Structuring in MCV
 */

/* window.onload = function () { */

var data = {
  editor: null
}
/* MODEL */
var model = {

  
  init: function () {

  },
  saveEditor: function( editor ){
    data.editor = editor;
  },
  getEditor: function(){
    return data.editor;
  }
};


/* CONTROLLER */
var controller = {

  init: function () {
    console.log("init controller");
    controller.settingNavMenu();
    controller.initSlider();
    controller.initEditor();
    controller.settingNavMenu();
    view.init();
  },

  sendFormLogIn: function (email, passowrd) {
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
  deleteProject: function (id) {
    console.log(id);
    axios
      .delete("/Admin/ManageProjects", {
        params: { id },
      })
      .then(function (response) {
        console.log(response);
        if (response.data.delete) {
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
  savePost: function (post){
    axios
      .post("/Admin/SavePost", post, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response.data.save);
        if (response.data.save) {
          window.location.replace("/Admin/ManageProjects");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getCookie: function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  checkCookie: function (cookieName) {
    let result = controller.getCookie(cookieName);
    if (result != "") {
      return true;
    } else {
      return false;
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
  initSlider: function () {
    console.log("init slider");
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: true,
      centeredSlidesBounds: true,
      breakpoints: {
        // min width is >= 576px
        576: {
          slidesPerView: 'auto',
          
          spaceBetween: 5
        }
      },
      loop: true,
      loopFillGroupWithBlank: true,
      autoplay: {
        delay: 2000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  },
  initEditor: function (){
    let toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      
      ['bold', 'italic', 'underline'],        // toggled buttons
      
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['image','blockquote', 'code-block']
    
    ];
    let options = {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    };
    try {
      let editor = new Quill('#editor', options);
      console.log(editor);
      model.saveEditor(editor);
    } catch (error) {
      console.log(error);
    }
      
  },
  getEditor:function(){
    return model.getEditor();
  },
  settingNavMenu:function(){
    let menu = document.getElementById('nav-menu');
    let nav_items = menu.getElementsByClassName("nav-item");
    let current_path = window.location.pathname.split('/')[1];
    Array.from(nav_items).forEach(item => {
      let item_path = item.getElementsByClassName('nav-link')[0]
                            .getAttribute('href')
                              .split('/')[1];
      if(item_path == current_path){
        item.classList.add('active');
      }else if(item.classList.contains('active')){
        item.classList.remove('active');
      }
      
    });

  }

};

/* VIEW */
var view = {
  init: function () {
    console.log("init view");
    view.eventSendFormLogIn();
    view.eventShowInputNewPassword();
    view.eventDeleteProject();
    view.eventUpdateProject();
    view.showAdminView();
    view.eventAddProject();
    view.eventPaginationBlogNext();
    view.eventPaginationBlogPrevious();
    view.eventSaveProcessForm();
    view.processDeltaToHtml();
    view.loadDeltaToEditor();
    view.eventShowBlockList();
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
  getImage: function () {
    try {
      return document.getElementById("inputImage");
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
  getContPreViewImages: function () {
    try {
      return document.getElementById("contPreViewImages");
    } catch (error) {
      console.log(error);
    }
  },
  getPaginationBlogNext: function () {
    try {
      return document.getElementById("next");
    } catch (error) {
      console.log(error);
    }
  },
  getPaginationBlogPrevious: function () {
    try {
      return document.getElementById("previous");
    } catch (error) {
      console.log(error);
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
  processDeltaToHtml: function(){
    try {
      let deltas = document.getElementsByClassName("delta");
      Array.from(deltas).forEach(delta => {
        let inputDelta = JSON.parse(delta.getAttribute("value"));
        let contTemp = document.createElement("div");
        let quill = new Quill(contTemp,{});
        quill.setContents(inputDelta.ops);
        if(delta.classList.contains("delta-summary")){
          /* console.log(contTemp.getElementsByTagName('blockquote')[0].innerHTML); */
          let summary = contTemp.getElementsByTagName('blockquote')[0];
          if(summary){
            delta.innerHTML = summary.innerHTML;
          }
        }else{
          delta.innerHTML = quill.root.innerHTML;
        }
        
      });
    } catch (error) {
      console.log(error);
    }
    
  },
  loadDeltaToEditor:function(){
    try {
      let deltas = document.getElementsByClassName("editor");
      Array.from(deltas).forEach(delta => {
        
        if(delta.classList.contains("load-delta") && delta.getAttribute("value")){
            controller.getEditor().setContents(JSON.parse(delta.getAttribute("value")));
        }
      
      });
    } catch (error) {
      console.log(error);
    }
  },
  /* eventSeePostDetail: function (id){
    window.location.replace("/Blog/Post/"+id);
  }, */
  showAdminView: function () {
    if (controller.checkCookie("token")) {
      document.getElementById("adminMenu").style.display = "list-item";
    }
  },
  eventPaginationBlogNext: function () {
    try{
      let btn_next = view.getPaginationBlogNext();
      btn_next.addEventListener("click", (e) => {
        e.preventDefault();
        let path = window.location.pathname;
        let pagination = path.split("/")[path.split("/").length - 1];
        console.log("Pagination: " + (parseInt(pagination) + 1));
        window.location.replace("/Blog/" + (parseInt(pagination) + 1));
      });
    }catch(e){
      console.log(e);
    }
    
  },
  eventPaginationBlogPrevious: function () {
    try{
      let btn_previous = view.getPaginationBlogPrevious();
      btn_previous.addEventListener("click", (e) => {
        e.preventDefault();
        let path = window.location.pathname;
        let pagination = path.split("/")[path.split("/").length - 1];
        pagination = parseInt(pagination) - 1;
        if(pagination>0){
          console.log("Pagination: " + pagination);
          window.location.replace("/Blog/" + pagination);
        }
        
      });
    }catch(e){
      console.log(e);
    }
    
  },
  eventShowBlockList: function(){
    let toggles = document.getElementsByClassName("block-list-toggle");
    Array.from(toggles).forEach(toggle => {
      var list_id = toggle.getAttribute("list-id");
      var list = document.getElementById(list_id);
      if(list.clientHeight > 0){
        list.setAttribute('block-list-height',list.clientHeight);
        if(list.getAttribute('init_state') == "visible"){
          list.style.visibility = 'visible';
          list.style.height = list.clientHeight + 'px';
        }else{
          list.style.visibility = 'hidden';
          list.style.height = '0';
        }
      }
      toggle.addEventListener('click',() => {
        /* console.log(toggle); */
        let toggle_icon = toggle.getElementsByTagName('i')[0];
        console.log(toggle_icon);
        /* let list_id = toggle.getAttribute("list-id"); */
        /* console.log(list_id); */
        /* let list = document.getElementById(list_id); */
        /* console.log(list); */
        let list_height = list.getAttribute('block-list-height');
        /* console.log(list_height); */
        console.log(list.style.visibility);
        if(list.style.visibility == 'hidden' || list.style.visibility == '' ){
          list.style.visibility = 'visible';
          /* list.style.display = 'block'; */
          list.style.height = list_height + 'px';

          toggle_icon.classList.remove('fa-caret-down');
          toggle_icon.classList.add('fa-caret-up');
        }else{
          list.style.visibility = 'hidden';
          /* list.style.display = 'block'; */
          list.style.height = '0';
          toggle_icon.classList.remove('fa-caret-up');
          toggle_icon.classList.add('fa-caret-down');
        }
      })
    

    });
  }
};

controller.init();
/* }; */
