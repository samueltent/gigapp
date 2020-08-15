var Homepage = (function($) {
  return {
    vars: {},
    constants: {},
    init() {
      Homepage.events();
      Homepage.build();
    },
    events() {
      $("#submitSearch").on('click', e => this.submitSearch(e));
      $("#searchLocation").on('click', e => this.searchLocation(e));
      $("#target").on('click', 'a', e => {
        e.preventDefault();
        const { currentTarget } = e;
        const _id = $(currentTarget).attr('data-id');
        localStorage.setItem('currentJobId', _id);
        $("#jobinfo").click();
      });
    },
    build() {

      const { API, Main } = window;
     // const {parties, candidates, campaigns, votes } = Main.vars
     

     $.ajax({
      type: 'GET',
      url: `http://localhost:3000/jobs/10`,
      contentType: "application/json",
      headers: {
        authorization: localStorage.getItem('token')
      },
      dataType: 'json',
      success: function (result) {
        console.log(result);
        Homepage.fillUp(result);
      }
    });

    },
    fillUp(res) {

      const template = $("#template").html();
      var render = "";

      res.forEach(element => {
        render += Mustache.render($("#template").html(), {title: element.title, location: element.location, description: element.description, _id: element._id});
      });
      $("#target").html(render);
    },
    submitSearch(e) {
      e.preventDefault();

      const keyword = $("#search").val();
      $("#latestjobs").text("Latest jobs added - " + "\"" + keyword + "\"");
      $("#search").val('');

      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/searchjob/${keyword}`,
        contentType: "application/json",
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'json',
        success: function (result) {
          console.log(result);
          Homepage.fillUp(result);
        }
      });
    },
    searchLocation(e) {

      e.preventDefault();

      const location = $("#location").find(":selected").val();
      $("#location").removeAttr("selected");
      $("#latestjobs").text("Latest jobs added - " + "\"" + location + "\"");

      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/findjob/${location}`,
        contentType: "application/json",
        headers: {
          authorization: localStorage.getItem('token')
        },
        dataType: 'json',
        success: function (result) {
          Homepage.fillUp(result);
        }
      });
    }
  };
}($));
