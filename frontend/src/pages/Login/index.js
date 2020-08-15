var Login = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      Login.build();
      Login.events();
    },
    build() {

    },
    events() {
      $('#submitLogin').on('click', e => this.doLogin(e));
      $('a').click((e) => {
        e.preventDefault();
        const { currentTarget } = e;
        const ns = $(currentTarget).attr('data-ns');
        const url = $(currentTarget).attr('href');
        const title = $(currentTarget).attr('title');
        window.Utils.navTo(ns, title, url);
      });
    },
    doLogin(e) {
      e.preventDefault();

      const { API, Main } = window;
      const email = $('#email').val();
      const password = $('#password').val();

      API.post('/login', { email, password })
        .then(() => {
          Main.loadContainers('Homepage');
        })
        .catch(() => {
          $('#loginAlert').removeClass('d-none');
          $('#email').val('');
          $('#password').val('');
        });
    },
  };
}($));
