var Jobs = (function($) {
  return {
    vars: {},
    constants: {},
    init() {
      Jobs.events();
      Jobs.build();
    },
    events() {
      $("#addJob").on('click', e => this.addJob(e));
      $("#target").on('click', 'a', e => {
        e.preventDefault();
        const { currentTarget } = e;
        const _id = $(currentTarget).attr('data-id');
        localStorage.setItem('currentJobId', _id);
        $("#managejob").click();
      });
    },
    build() {

      const { API, Main } = window;
     // const {parties, candidates, campaigns, votes } = Main.vars
     const userId = localStorage.getItem('userId');

     $.ajax({
      type: 'GET',
      url: `http://localhost:3000/userjobs/${userId}`,
      contentType: "application/json",
      headers: {
        authorization: localStorage.getItem('token')
      },
      dataType: 'json',
      success: function (result) {
        console.log(result);
        Jobs.fillUp(result);
      }
    });

    },
    fillUp(res) {

      const template = $("#template").html();
      var render = "";

      res.forEach(element => {
        render += Mustache.render($("#template").html(), {title: element.title, location: element.location, description: element.description, _id : element._id});
      });
      $("#target").html(render);
    },
    addJob(e) {
      e.preventDefault();
      const alertSuccess = $("#alertSuccess");
      const template = $("#template").html();


      const jobInfo = {
        title : $("#title").val(),
        location : $("#location").find(":selected").val(),
        description : $("#description").val()
      }

      $.ajax({
        type: 'POST',
        url: `http://localhost:3000/addjob`,
        headers: {
          authorization: localStorage.getItem('token')
        },
        data : jobInfo,
        dataType: 'json',
        success: function (result) {

          $(window).scrollTop(0);
          alertSuccess.show();
          alertSuccess.delay(3000).fadeOut();
          alertSuccess.hide(0);
          $("#title").val('');
          $("#location").val('');
          $("#description").val('');

          var updatedList = Mustache.render(template, {title: result.title, location: result.location, description: result.description, _id : result._id}) + $("#target").html();
          $("#target").html(updatedList);

        }
      });

    }
  };
}($));
