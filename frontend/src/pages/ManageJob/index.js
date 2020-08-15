var ManageJob = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      ManageJob.build();
      ManageJob.events();
    },
    build() {

      const jobId = localStorage.getItem('currentJobId');

      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/job/${jobId}`,
        contentType: "application/json",
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'json',
        success: function (result) {
          console.log(result);
          ManageJob.fillUp(result);
        }
      });

    },
    events() {
      $("#target").on('click', 'a', e => {
        e.preventDefault();
        const { currentTarget } = e;
        const _id = $(currentTarget).attr('data-id');
        localStorage.setItem('targetUserId', _id);
        $("#userinfo").click();
      });
    },
    fillUp(res) {

      $("#title").val(res.title);
      $(`#location`).val(res.location);
      $("#description").val(res.description);

      if(res.applicants.length > 0) {
        console.log(res.applicants);
        const jobId = localStorage.getItem('currentJobId');
        res.applicants.forEach(e => {
          $.ajax({
            type: 'GET',
            url: `http://localhost:3000/user/${e}`,
            contentType: "application/json",
            headers: {
              authorization: localStorage.getItem('token')
            },
            dataType: 'json',
            success: function (result) {
              console.log(result);
              ManageJob.fillApplicants(result);
            }
          });
        });

        // $.ajax({
        //   type: 'GET',
        //   url: `http://localhost:3000/applicants/${jobId}`,
        //   contentType: "application/json",
        //   headers: {
        //     authorization: localStorage.getItem('token')
        //   },
        //   dataType: 'json',
        //   success: function (result) {
        //     console.log(result);
        //     ManageJob.fillApplicants(result);
        //   }
        // });

      } else {
        $("#noapplicants").removeAttr("hidden");
      }

    },
    fillApplicants(res) {
      console.log(res);
      const template = $("#template").html();
      var render = "";
      render += Mustache.render(template, {_id: res._id, email: res.email});
      $("#target").append(render).removeAttr("hidden");
    }
  };
}($));
