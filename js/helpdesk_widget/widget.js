function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

var RedmineHelpdeskWidget = {
  widget: document.getElementById('helpdesk_widget'),
  widget_button: null,
  loading_div: null,
  full_screen: window.outerWidth <= 500 && window.outerHeight <= 700 ? true : false,
  width: 400,
  height: 500,
  margin: 20,
  button_size: 0,
  iframe: null,
  loaded: false,
  form: null,
  schema: null,
  reload: false,
  configuration: {},
  attachment: null,
  base_url: 'https://oldmy.basealt.space',
  px: function(number){
    return number + 'px';
  },
  config: function(configuration){
    this.configuration = configuration;
    this.apply_config();
  },
  apply_config: function(){
    this.apply_avatar();
    if (this.configuration['icon']){
      this.widget_button.innerHTML = this.configuration['icon'];
    }
    switch (this.configuration['position']) {
      case 'topLeft':
        this.widget.style.top = this.px(this.margin);
        this.widget.style.left = this.px(this.margin);
        break;
      case 'topRight':
        this.widget.style.top = this.px(this.margin);
        this.widget.style.right = this.px(this.margin);
        break;
      case 'bottomLeft':
        this.widget.style.bottom = this.px(this.margin);
        this.widget.style.left = this.px(this.margin);
        break;
      case 'bottomRight':
        this.widget.style.bottom = this.px(this.margin);
        this.widget.style.right = this.px(this.margin);
        break;
    }
  },
  translation: function(field){
    return this.configuration['translation'] && this.configuration['translation'][field] ? this.configuration['translation'][field] : null;
  },
  identify: function(field){
    return this.configuration['identify'] && this.configuration['identify'][field] ? this.configuration['identify'][field] : null
  },
  load: function() {
    this.apply_animation();
    this.toggle();
  },
  load_schema: function() {
    var xmlhttp = getXmlHttp();
    xmlhttp.open('GET', this.base_url + '/helpdesk_widget/load_form.json', true);
    xmlhttp.responseType = 'json';
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200 || xmlhttp.status == 304) {
          RedmineHelpdeskWidget.schema = xmlhttp.response;
          RedmineHelpdeskWidget.fill_form();
          RedmineHelpdeskWidget.loaded = true;
          RedmineHelpdeskWidget.decorate_iframe();
        } else {
          RedmineHelpdeskWidget.schema = {};
          RedmineHelpdeskWidget.loaded = false;
        }
      }
    };
    xmlhttp.send(null);
  },
  create_widget_button: function(){
    button = document.createElement('div');
    button.id = 'widget_button';
    button.className = 'widget_button';
    button.setAttribute('name', 'helpdesk_widget_button');
    button.style.visibility = 'hidden';
    this.widget_button = button;
    this.widget.appendChild(button);
  },
  create_loading_div: function(){
    loading_div = document.createElement('div');
    loading_div.id = 'loading_div';
    loading_div.className = 'loading';
    loading_div.style.minWidth = this.px(this.button_size - 8);
    loading_div.style.minHeight = this.px(this.button_size - 8);
    loading_div.style.position = 'absolute';
    loading_div.style.display = 'none';
    loading_div.style.zIndex = 'inherit';
    this.loading_div = loading_div;
    this.widget.appendChild(loading_div);
  },
  decorate_widget_button: function(){
    widget = this.widget;
    widget.style.alignItems = 'center';
  },
  create_iframe: function(){
    this.iframe = document.createElement('iframe');
    this.iframe.style.opacity = '0';
    this.widget.appendChild(this.iframe);

    this.iframe.onload = function() {
      RedmineHelpdeskWidget.decorate_iframe();
    }
  },
  decorate_iframe: function(){
    this.append_stylesheets();
    iframe = this.iframe;
  },
  appendToIframe: function(element){
    let parent = document.querySelector('#helpdesk_widget');
    parent.appendChild(element);
  },
  fill_form: function(){
    if (Object.keys(this.schema.projects).length > 0) {
      this.create_form();
      this.create_form_title();
      this.create_error_flash();

      if (this.identify('redmineUserID')) {
        this.create_form_hidden(this.form, 'redmine_user', 'redmine_user', 'form-control', this.identify('redmineUserID'));
      }
      if (this.identify('nameValue')) {
        this.create_form_hidden(this.form, 'username', 'username', 'form-control', this.identify('nameValue'));
      } else {
        this.create_form_text(this.form, 'username', 'username', this.translation('nameLabel') || 'Ваше имя', 'form-control', this.identify('nameValue'), true);
      }
      if (this.identify('emailValue')) {
        this.create_form_hidden(this.form, 'email', 'email', 'form-control', this.identify('emailValue'));
      } else {
        this.create_form_email(this.form, 'email', 'email' , this.translation('emailLabel') || 'Email', 'form-control', this.identify('emailValue'), true);
      }
      if (this.identify('subjectValue') != 'Custom' && this.identify('subjectValue')) {
        this.create_form_hidden(this.form, 'subject', 'issue[subject]', 'form-control', this.identify('subjectValue'));
      } else if (this.identify('subjectValue') != 'Custom') {
        this.create_form_text(this.form, 'subject', 'issue[subject]' , this.translation('subjectLabel') || 'Тема обращения', 'form-control', this.identify('subjectValue'), true);
      }
      if (this.identify('subjectValue') == 'Custom' ) {
        var str = this.identify('customTextValue');
        var res = str.split(",");
        this.create_form_title_subject();
        this.create_form_select_subject(this.form, 'subject', 'issue[subject]', res, project_id, 'form-control required-field');
      }
      if (this.identify('issueCategory')) {
        this.create_form_hidden(this.form, 'issue_category', 'issue_category', 'form-control', this.identify('issueCategory'));
      }
      this.create_projects_selector();
      if (this.identify('descriptionValue')){
        this.create_form_hidden(this.form, 'description', 'issue[description]', 'form-control', this.identify('descriptionValue'));
      }else {
      this.create_form_area(this.form, 'description', 'issue[description]' , this.translation('descriptionLabel') || 'Содержание обращения', 'form-control', true);
      }

      var project_id = null;
      var tracker_id = null;
      if (RedmineHelpdeskWidget.configuration['identify']){
        project_id = RedmineHelpdeskWidget.schema.projects[RedmineHelpdeskWidget.configuration['identify']['projectValue']];
        if (project_id) {
          tracker_id = RedmineHelpdeskWidget.schema.projects_data[project_id].trackers[RedmineHelpdeskWidget.configuration['identify']['trackerValue']];
        }
      }

      this.load_project_data(project_id || this.schema.projects[Object.keys(this.schema.projects)[0]], tracker_id);
      setTimeout(function() { RedmineHelpdeskWidget.appendToIframe(RedmineHelpdeskWidget.form)}, 1);
      this.append_scripts();
      this.create_message_listener();
    } else {
      this.widget.style.opacity = 0;
    }
  },
  apply_avatar: function(){
    button = document.getElementById('widget_button');
    avatar = RedmineHelpdeskWidget.configuration['user_avatar'];
    if (avatar && avatar.length > 0) {
      var xmlhttp = getXmlHttp();
      xmlhttp.open('GET', RedmineHelpdeskWidget.base_url + '/basealt_widget/avatar/' + avatar, true);
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200 || xmlhttp.status == 304) {
            button.style.backgroundSize = 'cover';
            button.style.backgroundImage = 'url(' + RedmineHelpdeskWidget.base_url + '/basealt_widget/avatar/' + avatar + ')' ;
            button.style.border = '2px solid';
            button.innerHTML = '&nbsp;';
          } else {
            button.style.backgroundSize = '15px 15px';
            button.innerHTML = '?';
          }
          button.style.display = 'block';
          button.style.lineHeight = '50px';
        }
      };
      xmlhttp.send(null);
    }
  },
  apply_animation: function(){
    animation_css = document.createElement('link');
    animation_css.href = this.base_url + '/helpdesk_widget/animation.css';
    animation_css.rel = "stylesheet";
    animation_css.type = "text/css";

    document.head.appendChild(animation_css);
  },
  append_stylesheets: function(){
    widget_css = document.createElement('link');
    widget_css.href = this.base_url + '/helpdesk_widget/widget.css';
    widget_css.rel = "stylesheet";
    widget_css.type = "text/css";
    document.head.appendChild(widget_css);
    if (this.configuration['styles']) {
      styles_css = document.createElement('style');
      styles_css.innerHTML = this.configuration['styles'];
      styles_css.type = "text/css";
      document.head.appendChild(styles_css);
    }
  },
  append_scripts: function(){
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.base_url + '/helpdesk_widget/iframe.js';
    setTimeout(function () {
      document.head.appendChild(script);
    }, 300);

    yacaptcha = document.createElement('script');
    yacaptcha.src = 'https://captcha-api.yandex.ru/captcha.js';

    setTimeout(function () {
       document.head.appendChild(yacaptcha);
    }, 500);

    script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = this.base_url + '/helpdesk_widget/script.js';
    setTimeout(function () {
       document.head.appendChild(script2);
    }, 100);


    config_script = document.createElement('script');
    config_script.innerHTML = "var RedmineHelpdeskIframe = {configuration: "+ JSON.stringify(this.configuration) +"}";
    document.head.appendChild(config_script);
  },
  create_form: function(){
    this.form = document.createElement('form');
    this.form.action = this.base_url + '/helpdesk_widget/create_ticket';
    this.form.acceptCharset = 'UTF-8';
    this.form.method = 'post';
    this.form.id = 'widget_form';
    this.form.style.marginBottom = 0;
  },
  create_form_title: function(){
    if (this.configuration['title']) {
      title_div = document.createElement('div');
      title_div.id = 'title';
      title_div.className = 'title';
      title_div.innerHTML = this.configuration['title'];
      this.form.appendChild(title_div);
    }
  },
  create_form_title_subject: function(){
      subject_span = document.createElement('label');
      subject_span.innerHTML = 'Тема обращения *';
      subject_span.style = 'color: #333;padding-bottom: 3px;font-size: 12px;';
      this.form.appendChild(subject_span);
  },
  create_error_flash: function(){
    flash_div = document.createElement('div');
    flash_div.id = 'flash';
    flash_div.className = 'flash';
    flash_div.style.marginTop = '20px';
    this.form.appendChild(flash_div);
  },
  create_projects_selector: function(){
    var project_id = null;
    if (RedmineHelpdeskWidget.configuration['identify']){
      project_id = RedmineHelpdeskWidget.schema.projects[RedmineHelpdeskWidget.configuration['identify']['projectValue']];
    }
    if (project_id) {
      this.create_form_hidden(this.form, 'project_id', 'project_id', 'form-control projects', project_id);
    } else {
      this.create_form_select(this.form, 'project_id', 'project_id', RedmineHelpdeskWidget.schema.projects, project_id, 'form-control projects');
    }
  },
  load_project_data: function(project_id, tracker_id){
    container_div = this.form.getElementsByClassName('container')[0]
    if (container_div) { container_div.remove() };

    container_div = document.createElement('div');
    container_div.id = 'container';
    container_div.className = 'container';

    custom_div = document.createElement('div');
    custom_div.id = 'custom_fields';
    custom_div.className = 'custom_fields';


    ya_div = document.createElement('div');
    ya_div.className = 'smart-captcha';
    ya_div.id = 'captcha-container'
    ya_div.setAttribute("data-sitekey","ysc1_Pd65HLKXNPww1VKpN2lavKa7hHeGg7bnGgtN7euP58b0751e");
    ya_div.setAttribute("data-callback","enableBtn");


    submit_div = document.createElement('div');
    submit_div.id = 'submit_button';
    submit_div.className = 'submit_button';
    submit_div.style.display = 'none';

    submit_div2 = document.createElement('div');
    submit_div2.id = 'submit_button2';
    submit_div2.className = 'submit_button';

    submit_div3 = document.createElement('div');
    submit_div3.id = 'link_attach';
    submit_div3.className = 'link_attach';

    custom_text = document.createElement('div');
    custom_text.id = 'text_info';
    custom_text.className = 'text_info';

    container_div.appendChild(custom_div);
    container_div.appendChild(ya_div);

      this.create_form_privacy_policy(container_div);

    container_div.appendChild(submit_div);
    container_div.appendChild(submit_div2);
    container_div.appendChild(submit_div3);
    container_div.appendChild(custom_text);

    if (RedmineHelpdeskWidget.configuration['identify'] && RedmineHelpdeskWidget.schema.projects_data[project_id].trackers[RedmineHelpdeskWidget.configuration['identify']['trackerValue']]){
      tracker_id = RedmineHelpdeskWidget.schema.projects_data[project_id].trackers[RedmineHelpdeskWidget.configuration['identify']['trackerValue']]
      this.create_form_hidden(custom_div, 'tracker_id', 'tracker_id', 'form-control trackers', tracker_id);
    } else {
      this.create_form_select(custom_div, 'tracker_id', 'tracker_id', this.schema.projects_data[project_id].trackers, tracker_id, 'form-control trackers');
      tracker_id = custom_div.getElementsByClassName('trackers')[0].value;
    }
    this.load_custom_fields(custom_div, project_id, tracker_id);

    this.create_form_submit(submit_div, this.translation('createButtonLabel') || 'Создать обращение');
    this.create_form_submit2(submit_div2, this.translation('createButtonLabel') || 'Создать обращение');
    this.create_attch_link(submit_div3);
    this.create_custom_text(custom_text);

    this.form.appendChild(container_div);
  },
  reload_project_data: function(){
    project_id = this.form.getElementsByClassName('projects')[0].value;
    tracker_id = container_div.getElementsByClassName('trackers')[0].value;

    this.load_project_data(project_id, tracker_id);
    this.arrange_iframe();
  },
  create_form_select: function(target, field_id, field_name, values, selected, field_class){

    if (Object.keys(values).length == 1) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.id  = field_id;
      field.name  = field_name;
      field.className = field_class + ' reloadProjectField';
      field.value = values[Object.keys(values)[0]];
    } else {
      field = document.createElement('select');
      field.id = field_id;
      field.name = field_name;
      field.className = field_class + ' reloadProjectField';
      for (var project in values) {
        option = document.createElement('option');
        option.value = values[project]
        if(values[project] == selected) { option.selected  = 'selected'; }
        option.innerHTML = project;
        field.appendChild(option);
      }
    }
    target.appendChild(field);
  },
  create_form_select_subject: function(target, field_id, field_name, values, selected, field_class){

    if (Object.keys(values).length == 1) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.id  = field_id;
      field.name  = field_name;
      field.className = field_class;
      field.value = values[Object.keys(values)[0]];
    } else {
      field = document.createElement('select');
      field.id = field_id;
      field.name = field_name;
      field.className = field_class;
      for (var project in values) {
        option = document.createElement('option');
        option.value = values[project];
        if(values[project] == selected) { option.selected  = 'selected'; }
        option.innerHTML = values[project];
        if(values[project] == '') { option.innerHTML = '--- Выберите ---'; }
        field.appendChild(option);
      }
    }
    field.setAttribute('onChange', 'needReloadProjectData();');
    target.appendChild(field);
  },
  create_form_hidden: function(target, field_id, field_name, field_class, value){
    field = document.createElement('input');
    field.type = 'hidden';
    field.id  = field_id;
    field.name  = field_name;
    field.value  = value;
    field.className = field_class;
    target.appendChild(field);
  },
  create_form_text: function(target, field_id, field_name, field_placeholder, field_class, value, required){
    field = document.createElement('input');
    field.type = 'text';
    field.id  = field_id;
    field.name  = field_name;
    field.value  = value;
    field.placeholder = field_placeholder;
    field.className = required ? field_class + ' required-field' : field_class;
    target.appendChild(field);
  },
    create_form_email: function(target, field_id, field_name, field_placeholder, field_class, value, required){
    field = document.createElement('input');
    field.type = 'email';
    field.id  = field_id;
    field.name  = field_name;
    field.value  = value;
    field.placeholder = field_placeholder;
    field.className = required ? field_class + ' required-field' : field_class;
    field.pattern = '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$';
    target.appendChild(field);
  },
  create_form_area: function(target, field_id, field_name, field_placeholder, field_class, required){
    field = document.createElement('textarea');
    field.cols = 55;
    field.rows = 10;
    field.id  = field_id;
    field.name  = field_name;
    field.placeholder = field_placeholder;
    field.className = required ? field_class + ' required-field' : field_class;
    target.appendChild(field);
  },
  create_form_submit: function(target, label){
    field = document.createElement('input');
    field.id  = 'form-submit-btn';
    field.type = 'submit';
    field.name = 'submit';
    field.className = 'btn';
    field.value = label;
    field.title = this.translation('buttomLabel') || '';
    if (RedmineHelpdeskWidget.configuration['color']) {
      field.style.background = RedmineHelpdeskWidget.configuration['color'];
    }
    target.appendChild(field);
  },
    create_form_submit2: function(target, label){
    field = document.createElement('input');
    field.id  = 'form-submit-btn2';
    field.type = 'button';
    field.name = 'submit';
    field.className = 'btn';
    field.setAttribute("onclick","myFunction()");
    field.value = label;
    field.title = this.translation('buttomLabel') || '';
    if (RedmineHelpdeskWidget.configuration['color']) {
      field.style.background = RedmineHelpdeskWidget.configuration['color'];
    }
    target.appendChild(field);
  },
  create_form_privacy_policy: function (target) {
    var privacy_policy_div = document.createElement('div');
    privacy_policy_div.id = 'privacy_policy_fields';
    privacy_policy_div.className = 'privacy_policy_fields';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'privacy_policy';
    checkbox.name = 'privacy_policy';
    checkbox.value = 1;
    checkbox.required = 'required';

    var checkbox_label = document.createElement('label');
    checkbox_label.htmlFor = checkbox.id;
    // slice(3, -4) for removing wrapper <p>...</p>
    checkbox_label.innerHTML = '<p>Я ознакомился с <a href=\"https://www.basealt.ru/support\" class=\"external\">Правилами технической поддержки<\/a> и согласен с их положениями.<\/p>'.slice(3, -4);

    var links = checkbox_label.getElementsByTagName('a');
    for (var i = 0, len = links.length; i < len; i++) { links[i].target = '_blank' }

    privacy_policy_div.appendChild(checkbox);
    privacy_policy_div.appendChild(checkbox_label);
    if (this.configuration['privacy_policy']){
      checkbox_label.innerHTML = this.configuration['privacy_policy'];
    }
    target.appendChild(privacy_policy_div);
  },
  create_attch_link: function(target){
    if (this.configuration['attachment'] != false ) {
      attach_div = document.createElement('div');
      attach_div.className = 'attach_div';

      attach_link = document.createElement('a');
      attach_link.className = 'attach_link';
      attach_link.href = 'javascript:void(0)';
      attach_link.innerHTML = this.translation('attachmentLinkLabel') || 'Прикрепить файл';
      attach_div.appendChild(attach_link);

      attach_field = document.createElement('input');
      attach_field.type = 'file';
      attach_field.id = 'attachment';
      attach_field.className = 'attach_field';
      attach_field.name = 'attachment';
      attach_field.attributes['data-max-size'] = 104857600;
      attach_field.addEventListener('change', function(){ RedmineHelpdeskWidget.upload_file() });
      attach_div.appendChild(attach_field);
      this.attachment = attach_field;

      target.appendChild(attach_div);
    }
  },
  create_custom_text: function(target){
      text_p = document.createElement('p');
      text_p.innerHTML = this.translation('customTextLabel') || '<center>В форме запроса значок «*» (звёздочка) означает обязательное поле.</center>';
      target.appendChild(text_p);

  },
  upload_file: function(){
    if (this.attachment.attributes['data-max-size'] > this.attachment.files[0].size) {
      this.read_file(this.attachment.files[0], function(e){
        attach_field = RedmineHelpdeskWidget.form.getElementsByClassName('attach_field')[0]
        attach_field.attributes['data-value'] = e.target.result;
        displayed_name = (attach_field.files[0].name.length <= 20) ? attach_field.files[0].name : attach_field.files[0].name.substring(0, 20) + '...';
        RedmineHelpdeskWidget.form.getElementsByClassName('attach_link')[0].innerHTML = displayed_name;
      });
    }  else {
      this.attachment.attributes['data-value'] = '';
      RedmineHelpdeskWidget.form.getElementsByClassName('attach_link')[0].innerHTML = 'Файл слишком большой';
    }
  },
  read_file: function(file, callback){
    var reader = new FileReader();
    reader.onload = callback
    reader.readAsDataURL(file);
  },
  load_custom_fields: function(target, project_id, tracker_id){
    var xmlhttp = getXmlHttp();
    var params = 'project_id=' + encodeURIComponent(project_id) + '&tracker_id=' + encodeURIComponent(tracker_id);
    custom_div = document.createElement('div');
    xmlhttp.open('GET', this.base_url + '/helpdesk_widget/load_custom_fields?' + params, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200 || xmlhttp.status == 304) {
          custom_div.innerHTML = xmlhttp.responseText;
          target.appendChild(custom_div);
          RedmineHelpdeskWidget.set_custom_values();
          setTimeout(function(){ RedmineHelpdeskWidget.arrange_iframe() }, 100);
        }
      }
    };
    xmlhttp.send(null);
  },
  set_custom_values: function(){
    if (this.configuration['identify'] && this.configuration['identify']['customFieldValues']){
      for(var cf in this.configuration['identify']['customFieldValues']) {
        custom_field = this.form.querySelector('#issue_custom_field_values_' + this.schema.custom_fields[cf])
        if (custom_field){
          switch (custom_field.tagName){
            case 'INPUT':
              custom_field.type = 'hidden';
              custom_field.value = this.configuration['identify']['customFieldValues'][cf];
              this.form.querySelector("[data-error-key='" + cf + "']").style.display = 'none';
              break;
            case 'SELECT':
              options = custom_field.options;
              for(var option, index = 0; option = options[index]; index++) {
                if(option.value == this.configuration['identify']['customFieldValues'][cf]) {
                  this.create_form_hidden(custom_field.parentElement, custom_field.id, custom_field.name, custom_field.classList.toString(), this.configuration['identify']['customFieldValues'][cf]);
                  custom_field.remove();
                  this.form.querySelector("[data-error-key='" + cf + "']").style.display = 'none';
                  break;
                }
              }
              break;
          }
        }
      }
    }
  },
  arrange_iframe: function(){
    button_margin = this.margin + this.button_size;

    switch (this.configuration['position']) {
      case 'topLeft':
        this.iframe.style.top = this.full_screen ? this.px(-this.margin) : this.px(button_margin);
        iframe.style.left = this.full_screen ? this.px(-this.margin) : this.px(0);
        break;
      case 'topRight':
        this.iframe.style.top = this.full_screen ? this.px(-this.margin) : this.px(button_margin);
        iframe.style.left = this.full_screen ? this.px(-window.innerWidth + button_margin) : this.px(- this.width + this.button_size);
        break;
      case 'bottomLeft':
        this.iframe.style.top = this.full_screen ? this.px(- window.innerHeight + button_margin) : this.px(- this.form.offsetHeight - this.margin * 2);
        this.iframe.style.left = this.full_screen ? this.px(-this.margin) : this.px(0);
        break;
      case 'bottomRight':
        this.iframe.style.top = this.full_screen ? this.px(- window.innerHeight + button_margin) : this.px(-this.form.offsetHeight - this.margin * 2);
        iframe.style.left = this.full_screen ? this.px(-window.innerWidth + button_margin) : this.px(-this.width + this.button_size);
        break;
    }
  },
  create_message_listener: function(){
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent,function(e) {
      data = JSON.stringify(e.data);
      if (data['reload'] == true)         { RedmineHelpdeskWidget.reload = true; }
      if (data['project_reload'] == true) { RedmineHelpdeskWidget.reload_project_data(); }
      if (data['arrange'] == true)        { RedmineHelpdeskWidget.arrange_iframe(); }
    }, false);
  },
  reload_form: function(){
    this.iframe.remove();
    this.create_iframe();
    this.fill_form();
    this.decorate_iframe();
    this.reload = false;
  },
  show: function() {
    if (this.loaded) this.arrange_iframe();
    switch (this.configuration['position']) {
      case 'topLeft':
      case 'topRight':
        this.widget_button.style.borderRadius = '50% 50% 0%';
        break;
      case 'bottomLeft':
      case 'bottomRight':
        this.widget_button.style.borderRadius = '0 100% 100%';
        break;
      default:
        this.widget_button.style.borderRadius = '0 100% 100%';
    }

    this.widget_button.style.webkitTransform = 'rotate(45deg)';
    this.widget_button.style.mozTransform = 'rotate(45deg)';
    this.widget_button.style.msTransform = 'rotate(45deg)';
    this.widget_button.style.oTransform = 'rotate(45deg)';
  },
  hide: function() {
    if (this.reload == true) {
      this.reload_form();
    }
    body = this.iframe.contentWindow.document.body;
    this.iframe.style.opacity = 0;
    this.iframe.style.top = 0;
    this.widget_button.style.borderRadius = '30px';
    this.widget_button.style.webkitTransform = '';
    this.widget_button.style.mozTransform = '';
    this.widget_button.style.msTransform = '';
    this.widget_button.style.oTransform = '';
  },
  toggle: function() {
    if (!this.loaded) this.load_schema();
  }
}

RedmineHelpdeskWidget.load();
