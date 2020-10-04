/**
 * @File main.js
 * @description Structuring in MCV
 */

window.onload = function () {

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
    /* console.log("init controller"); */
    controller.settingNavMenu();
    controller.initSlider();
    controller.initEditor();
    controller.settingNavMenu();
    view.init();
  },
  deleteProject: function (id) {
    axios
      .post("/admin/manage-projects/"+id+"/delete", {
        params: { id },
      })
      .then(function (response) {
        if (response.data.delete) {
          window.location.replace("/admin/manage-projects");
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
  /**
   * @function preViewImages
   * @description Show a pre view of images upload in a input file type 
   * @param {*} event Evento upload image.
   */
  preViewImages: function (event) {

    let container = view.getContPreViewImages();
    if(container){
      container.innerHTML = "";
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.onload = function (e) {
          // The file's text will be printed here
          /* console.log(e.target.result); */
          let inputImage = view.getInputImage();
          if(inputImage){
            inputImage.src = e.target.result;
          }
          
          let img = document.createElement("img");
          img.src = e.target.result;
          container.appendChild(img);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  },
  /**
   * @function initSlider
   * @description look for all elements with class "swiper-container" 
   * if the element has a "type-slider" attribute the slider starts with 
   * this type otherwise the slider starts with the default settings.
   * Supported type: 3D-coverflow.
   */
  initSlider: function () {
    let sliders = document.getElementsByClassName("swiper-container");
    Array.from(sliders).forEach(slider => {
      let type = slider.getAttribute("type-slider");
      let config;
      switch (type) {
        case "3D-coverflow":
          config = {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            centeredSlidesBounds: true,
            loop: true,
            loopFillGroupWithBlank: true,
            slidesPerView: 'auto',
            coverflowEffect: {
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            },
            pagination: {
              el: '.swiper-pagination',
            },
          }
          break;    
        default:
          config = {
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
            }
          }
          break;
      }
      var swiper = new Swiper(slider, config);
    });
    
  },
  /**
   * @function initEditor
   * @description Find the first element with id "Editor" and started a quill editor
   * with default config.
   */
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
    let editor = document.querySelector("#editor");
    if(editor){
      editor = new Quill(editor, options);
      /* console.log(editor); */
      model.saveEditor(editor);
    }
  },
  getEditor:function(){
    return model.getEditor();
  },

  /**
   * @function settingNavMenu
   * @description Add the "active" class when the page URL is equal 
   * to the href of the menu item link and removed the "active" class when it is
   * not equal.
   */
  settingNavMenu:function(){
    let menu = document.querySelector('#nav-menu');
    if(menu){
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
  }
};

/* VIEW */
var view = {
  init: function () {
    /* console.log("init view"); */
    view.eventShowInputNewPassword();
    view.showAdminView();
    view.eventPaginationBlogNext();
    view.eventPaginationBlogPrevious();
    view.processDeltaToHtml();
    view.loadDeltaToEditor();
    view.eventShowBlockList();
    view.saveFormWithQuillEditor();
  },
  getInputImage: function () {
    return document.querySelector("#inputImage");
  },
  getContPreViewImages: function () {
    return document.querySelector("#contPreViewImages");
  },
  /**
   * @function eventShowInputNewPassword
   * @description show the input to new password
   */
  eventShowInputNewPassword: function () {
    let checkNewPassword = document.querySelector("#checkNewPassword");
    if(checkNewPassword){
      checkNewPassword.addEventListener("click", () => {
        let formGroupNewPassword = document.querySelector("#form-group-new-password");
        if (!checkNewPassword.checked) {
          checkNewPassword.value = true;
          formGroupNewPassword.style.display = "none";
        } else {
          checkNewPassword.value = false;
          formGroupNewPassword.style.display = "block";
        }
      });
    }
  },
  /**
   * @function processDeltaToHtml
   * @description Find all elements with class "delta", need a value
   * attribute with the content in delta format, create a quill container
   * in the DOM to be pre-processed in html format. If the element has a
   * "delta-summary" class, it will take the text in "blockquote" format
   * and take it as a summary of the content. 
   */
  processDeltaToHtml: function(){
    try {
      let deltas = document.getElementsByClassName("delta");
      Array.from(deltas).forEach(delta => {
        /* console.log(delta); */
        if(delta.getAttribute("value")){
          let inputDelta = JSON.parse(delta.getAttribute("value"));
          /* console.log(inputDelta); */
          let contTemp = document.createElement("div");
          let quill = new Quill(contTemp,{});
          quill.setContents(inputDelta.ops);
          if(delta.classList.contains("delta-summary")){
            let summary = contTemp.getElementsByTagName('blockquote')[0];
            if(summary){
              delta.innerHTML = summary.innerHTML;
            }
          }else{
            delta.innerHTML = quill.root.innerHTML;
          }
          delta.setAttribute("value","");
        }
        
        
      });
    } catch (error) {
      console.log(error);
    }
    
  },
  /**
   *  @function loadDeltaToEditor
   *  @description Finds all the elements that contain the class "editor"
   *  and if these elements have the class "load-delta" and a "value" attribute
   *  will load the content to the quill text editor in delta format.
   */
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

  /**
   * @function showAdminView
   * @description Show the "admin" navigation item if you have token
   * authentication.
   */
  showAdminView: function () {
    if (controller.checkCookie("token")) {
      let controls = document.getElementsByClassName("control-admin");
      Array.from(controls).forEach(control => {
        control.style.display = "block";
        let toggle = control.getElementsByClassName("toggle-admin")[0];
        toggle.addEventListener("click",()=>{
          let menu = control.getElementsByClassName("menu-admin")[0];
          if(menu.classList.contains("active")){
            menu.classList.remove("active");
          }else{
            menu.classList.add("active");
          }
        });
        
      });
    }
  },
  /**
   * @function saveFormWithQuillEditor
   * @description Load the content of the quill editor in an input tag
   * to send the content with the form.
   */
  saveFormWithQuillEditor: function (){
    var form = document.querySelector('.form-quill');
    if(form){
      form.onsubmit = function() {
        var content = document.querySelector('input[name=content]');
        content.value = JSON.stringify(controller.getEditor().getContents());
      };
    } 
  },
  eventPaginationBlogNext: function () {
    let btn_next = document.querySelector("#next");
    if(btn_next){
      btn_next.addEventListener("click", (e) => {
        e.preventDefault();
        let path = window.location.pathname;
        let pagination = path.split("/")[path.split("/").length - 1];
        window.location.replace("/Blog/" + (parseInt(pagination) + 1));
      });
    }
  },
  eventPaginationBlogPrevious: function () {
    let btn_previous = document.querySelector("#previous");
    if(btn_previous){
      btn_previous.addEventListener("click", (e) => {
        e.preventDefault();
        let path = window.location.pathname;
        let pagination = path.split("/")[path.split("/").length - 1];
        pagination = parseInt(pagination) - 1;
        if(pagination>0){
          window.location.replace("/Blog/" + pagination);
        }
        
      });
    } 
  },
  /**
   * @function eventShowBlockList
   * @description Search all elements with class "block-list-toggle" and attribute 
   * list-id with id of the list to control, then if the list has an "init_state" 
   * attribute equal to "visible" shows the list otherwise, hide the list and 
   * add block-list-height attribute with your default height, 
   * then add a click event to the toggle item to display or hide the list.
   * 
   */
  eventShowBlockList: function(){
    let toggles = document.querySelectorAll(".block-list-toggle[list-id]");
    Array.from(toggles).forEach(toggle => {
      var list_id = toggle.getAttribute("list-id");
      var list = document.querySelector("#"+list_id);
      if(list){
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
          let toggle_icon = toggle.getElementsByTagName('i')[0];
          let list_height = list.getAttribute('block-list-height');
          if(list.style.visibility == 'hidden' || list.style.visibility == '' ){
            list.style.visibility = 'visible';
            list.style.height = list_height + 'px';
            toggle_icon.classList.remove('fa-caret-down');
            toggle_icon.classList.add('fa-caret-up');
          }else{
            list.style.visibility = 'hidden';
            list.style.height = '0';
            toggle_icon.classList.remove('fa-caret-up');
            toggle_icon.classList.add('fa-caret-down');
          }
        })
      }     
    });
  }
};

controller.init();
};
