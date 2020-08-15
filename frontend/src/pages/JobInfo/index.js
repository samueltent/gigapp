var JobInfo = (function ($) {
  return {
    vars: {},
    constants: {},
    init() {
      JobInfo.build();
      JobInfo.events();
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
          JobInfo.fillUp(result);
        }
      });

    },
    events() {
      $("#applyJob").on('click', e => this.applyJob(e));
    },
    fillUp(res) {

      const applyMessage = $("#applyMessage");
      const applyJob = $("#applyJob");
      

      if(res === "Your application was successfully sent!") {
        applyMessage.show();
        applyJob.hide();
      } else {
        $("#title").html(res.title);
        $("#location").html(res.location);
        $("#description").html(res.description);
        if(res.applicants.includes(localStorage.getItem('userId'))) {
          applyMessage.show();
        } else {
          applyJob.show();
        }
      }
    },
    applyJob(e) {
      e.preventDefault();

      const jobId = localStorage.getItem('currentJobId');

      $.ajax({
        type: 'PUT',
        url: `http://localhost:3000/applyjob/${jobId}`,
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'text',
        success: function (result) {
          console.log(result);
          JobInfo.fillUp(result);
        }
      });

    }
  };
}($));
