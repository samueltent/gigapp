var CV = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      CV.events();
      CV.build();
    },
    events() {
      $("#saveResume").on('click', (e) => this.saveResume(e));
    },
    build() {

      const { API, Main } = window;

      const userId = localStorage.getItem('userId');

      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/cv/${userId}`,
        contentType: "application/json",
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'json',
        success: function (result) {
          CV.fillUp(result);
        }
      });

    },
    saveResume(e) {

      e.preventDefault();
      const alert = $("#alert");

      const userId = localStorage.getItem('userId');

      const cvInfo = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        dateOfBirth: $("#dateOfBirth").val(),
        address: $("#address").val(),
        telephone: $("#telephone").val(),
        about: $("#about").val(),
        education: {
          institution: $("#institution").val(),
          beginDate: $("#beginDate").val(),
          finishDate: $("#finishDate").val()
        },
        experience: [
          {
            company: $("#company").val(),
            position: $("#position").val(),
            startDate: $("#startDate").val(),
            endDate: $("#endDate").val()
          }
        ]
      }

      console.log(cvInfo);

      API.put(`/updatecv/${userId}`, cvInfo)
        .then(response => {
          console.log(response);
        })
        .then(() => {
          $(window).scrollTop(0);
          alert.show();
          alert.delay(3000).fadeOut();
          alert.hide(0);
        })
        .catch(e => {
          console.log(e);
        });

    },
    fillUp(res) {
      console.log(res);

      $("#firstName").val(res.firstName);
        $("#lastName").val(res.lastName);
        $("#dateOfBirth").val(res.dateOfBirth);
        $("#address").val(res.address);
        $("#telephone").val(res.telephone);
        $("#about").val(res.about);
        $("#institution").val(res.education.institution);
        $("#beginDate").val(res.education.beginDate);
        $("#finishDate").val(res.education.finishDate);
        $("#company").val(res.experience[0].company);
        $("#position").val(res.experience[0].position);
        $("#startDate").val(res.experience[0].startDate);
        $("#endDate").val(res.experience[0].endDate);
  }    
  };
  }($));
