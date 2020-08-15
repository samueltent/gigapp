var UserInfo = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      UserInfo.build();
      UserInfo.events();
    },
    build() {

      const targetUser = localStorage.getItem('targetUserId');

      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/user/${targetUser}`,
        contentType: "application/json",
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'json',
        success: function (result) {
          console.log(result);
          UserInfo.fillUp(result);
        }
      });

    },
    events() {

    },
    fillUp(res) {
      
      $("#email").html(res.email);
      $("#firstName").html(res.cv.firstName);
      $("#lastName").html(res.cv.lastName);
      $("#dateOfBirth").html(res.cv.dateOfBirth);
      $("#address").html(res.cv.address);
      $("#telephone").html(res.cv.telephone);
      $("#about").html(res.cv.about);
      $("#institution").html(res.cv.education.institution);
      $("#beginDate").html(res.cv.education.beginDate);
      $("#finishDate").html(res.cv.education.finishDate);
      $("#position").html(res.cv.experience[0].position);
      $("#company").html(res.cv.experience[0].company);
      $("#startDate").html(res.cv.experience[0].startDate);
      $("#endDate").html(res.cv.experience[0].endDate);

    }
  };
}($));
