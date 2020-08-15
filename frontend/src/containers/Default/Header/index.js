var Header = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      Header.build();
      Header.events();
    },
    build() {
      $('#userspan').text(localStorage.getItem('userEmail'));
      const ns = window.Utils.getNs();
      $(`#navbarSupportedContent a[data-ns="${ns}"]`).closest('li').addClass('active');
    },
    events() {
      $('#logOut').on('click', () => this.logOut());
      $("#settings").on('click', (e) => this.navigate(e));
      $("#navbar-brand").on('click', (e) => this.navigate(e));
      $('#navbarSupportedContent a').click((e) => this.navigate(e));
    },
    logOut() {
      localStorage.removeItem('token');
      Utils.setVar('Main', 'auth', false);
      Main.loadContainers('Login');
    },
    navigate(e) {
        e.preventDefault();
        const { currentTarget } = e;
        const ns = $(currentTarget).attr('data-ns');
        const url = $(currentTarget).attr('href');
        const title = $(currentTarget).attr('title');
        $('#navbarSupportedContent li').removeClass('active');
        $(currentTarget).closest('li').addClass('active');
        window.Utils.navTo(ns, title, url);
    }
  };
}($));
