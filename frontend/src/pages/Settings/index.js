var Settings = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      Settings.events();
      Settings.build();
    },
    events() {
      $("#changeEmail").on('click', (e) => this.changeEmail(e));
      $("#changePassword").on('click', (e) => this.changePassword(e));
      $("#deleteAccount").on('click', (e) => this.deleteAccount(e));
    },
    build() {

      //const { API, Main } = window;

    },
    changeEmail(e) {
      e.preventDefault();
      var alertSuccess = $("#alertSuccess");

      var newEmail = $("#newemail");
      var repeatEmail = $("#repeatemail");

      const updatedUser = {
        newemail: newEmail.val(),
        repeatemail: repeatEmail.val()
      };

      const userId = localStorage.getItem('userId');

      if (updatedUser.newemail === updatedUser.repeatemail) {

        var data = JSON.stringify(updatedUser);

        $.ajax({
          type: 'PUT',
          url: `http://localhost:3000/changeemail/${userId}`,
          contentType: "application/json",
          headers: {
            authorization: localStorage.getItem('token')
          },
          dataType: 'json',
          data: data,
          success: function (result) {
            console.log(result);
            $(window).scrollTop(0);
            alertSuccess.html(result.message);
            alertSuccess.show();
            alertSuccess.delay(3000).fadeOut();
            alertSuccess.hide(0);

            newEmail.val('');
            repeatEmail.val('');

            $('#userspan').text(updatedUser.newemail);
            localStorage.setItem('userEmail', updatedUser.newemail);
          }
        });

      }

    },
    changePassword(e) {
      e.preventDefault();
      var alertSuccess = $("#alertSuccess");

      var oldpassword = $("#oldpassword");
      var newpassword = $("#newpassword");
      var repeatpassword = $("#repeatpassword");

      const updatedUser = {
        oldpassword: oldpassword.val(),
        newpassword: newpassword.val(),
        repeatpassword: repeatpassword.val()
      };

      const userId = localStorage.getItem('userId');

      if (updatedUser.newpassword === updatedUser.repeatpassword) {

        var data = JSON.stringify(updatedUser);

        $.ajax({
          type: 'PUT',
          url: `http://localhost:3000/changepassword/${userId}`,
          contentType: "application/json",
          headers: {
            authorization: localStorage.getItem('token')
          },
          dataType: 'json',
          data: data,
          success: function (result) {
            console.log(result);

            $(window).scrollTop(0);
            alertSuccess.html(result.message);
            alertSuccess.show();
            alertSuccess.delay(3000).fadeOut();
            alertSuccess.hide(0);

            oldpassword.val('');
            newpassword.val('');
            repeatpassword.val('');
          }
        });

      }
    },
    deleteAccount(e) {
      e.preventDefault();

      const userId = localStorage.getItem('userId');

      const { API } = window;

      $.ajax({
        type: 'DELETE',
        url: `http://localhost:3000/deleteuser/${userId}`,
        contentType: "application/json",
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'json',
        success: function (result) {
          localStorage.clear();
          Utils.setVar('Main', 'auth', false);
          Main.loadContainers('Login');
        }
      });

    }
  };
}($));
