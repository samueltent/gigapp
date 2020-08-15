/* eslint-disable no-use-before-define */
$(document).ready(() => {
  Main.init();
});

var Main = (function($) {
  return {
    vars: {},
    modules: ['Login', 'Homepage', 'Register', 'CV', 'Jobs', 'JobInfo', 'ManageJob', 'UserInfo', 'Settings'],
    protected: ['Homepage'],
    constants: {
      BASEURL: `${window.location.protocol}//${window.location.hostname}${(window.location.port === '') ? '' : `:${window.location.port}`}/`,
      API_URL: 'http://localhost:3000',
    },
    init() {
      Main.build();
      Main.router();
      Main.events();
    },
    build() {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      Utils.setVar('Main', 'auth', token !== null);
      if (token !== null) {
        API.get('/jobs/all')
          .then(response => {Utils.setVar('Main', 'jobs', response); console.log(response);})
          .catch(e => console.log(e));
      }
    },
    events() {
      window.onpopstate = (e) => {
        Main.loadModules(e.state);
      };
    },
    router() {
      const app = this;
      const ns = Utils.getNs();
      if (ns) app.loadContainers(ns);
      else app.loadContainers('Homepage');
    },
    loadContainers(ns) {
      const app = this;
      const { vars, modules } = app;
      const dir = vars.auth ? 'Default' : 'Public';

      $('body').load(`/src/containers/${dir}/index.html`, () => {
        if (vars.auth) {
          app.loadDefaultContainerComponents('header', 'Header');
          if (modules.indexOf(ns) !== -1) {
            app.loadModules(ns);
          } else {
            app.load404();
          }
        } else {
          app.loadModules('Login');
        }
      });
    },
    loadModules(ns) {
      $('#content').load(`/src/pages/${ns}/template/index.html`, () => {
        $.getScript(`src/pages/${ns}/index.js`)
          .done(() => {
            window[ns].init();
          })
          .fail(() => {
            $('div.log').text('ModuleNotFound');
          });
      });
    },
    load404() {
      $('#content').load('/src/pages/404/template/index.html');
    },
    loadDefaultContainerComponents(container, component) {
      $(`#${container}`).load(`/src/containers/Default/${component}/template/index.html`, () => {
        $.getScript(`/src/containers/Default/${component}/index.js`)
          .done(() => {
            window[component].init();
          })
          .fail(() => {
            $('div.log').text('ModuleNotFound');
          });
      });
    },
  };
}($));


var Utils = (function($) {
  return {
    getNs() {
      const url = window.location.href;
      const arr = url.split('/');

      if (arr[3].length > 0 && arr[3] !== '#') {
        arr[3] = Utils.trim(arr[3], '#');
        return Utils.capitalizeFirstLetter(arr[3]);
      }
      return false;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    trim(string, charToRemove) {
      while (string.charAt(0) === charToRemove) {
        string = string.substring(1);
      }
      while (string.charAt(string.length - 1) === charToRemove) {
        string = string.substring(0, string.length - 1);
      }
      return string;
    },
    setVar(nameSpace, varName, varValue) {
      window[nameSpace].vars[varName] = varValue;
    },
    navTo(ns, title, url) {
      window.history.pushState(ns, title, url);
      window.history.pushState(ns, title, url);
      window.history.back();
    },
    setToken(res) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userEmail', res.data.email);

      Main.vars.auth = true;
      return res;
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
  };
}($));

var API = axios.create({
  baseURL: 'http://localhost:3000'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (typeof token !== 'undefined') {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

API.interceptors.response.use((response) => {

  if (typeof response.data.token !== 'undefined') Utils.setToken(response);

});
