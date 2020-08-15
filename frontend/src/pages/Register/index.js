var Register = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      Register.build();
      Register.events();
    },
    build() {

    },
    events() {
      $('#submitRegister').on('click', e => this.doRegister(e));
      $('a').click((e) => {
        e.preventDefault();
        const { currentTarget } = e;
        const ns = $(currentTarget).attr('data-ns');
        const url = $(currentTarget).attr('href');
        const title = $(currentTarget).attr('title');
        window.Utils.navTo(ns, title, url);
      });
    },
    doRegister(e) {

      e.preventDefault();

      const { API, Main } = window;
      const email = $('#email').val();
      const password = $('#password').val();
      const repeatpassword = $('#repeatpassword').val();

      if(password === repeatpassword) {
        API.post('/register', { email, password })
        .then((response) => {
          localStorage.removeItem('token');
          Utils.setVar('Main', 'auth', false);
          Main.loadContainers('Login');
        })
        .catch(() => {
          $('#loginAlert').removeClass('d-none');
          $('#email').val('');
          $('#password').val('');
          $('#repeatpassword').val('');
        });
      } else {
        $('#loginAlert').removeClass('d-none');
          $('#email').val('');
          $('#password').val('');
          $('#repeatpassword').val('');
      }

    }
  };
}($));
