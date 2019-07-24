const url_competition = "https://api.football-data.org/v2/competitions/2021/";  // 2021 for EPL

const fetchApi = function(url) {
  return fetch(url, {
    headers: {
      'X-Auth-Token': "7321b8cd40b443e2a06d3228e0551f73"
    }
  });
};

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getStandings() {
  fetchApi( url_competition + "standings" )
    .then(status)
    .then(json)
    .then(function(data) {

      var tableRef = document.getElementById('standing_table').getElementsByTagName('tbody')[0];
      var teams = [];
      data.standings.forEach(function(season) {
        if(season.type == "TOTAL"){
          season.table.forEach(function(standing){
             // console.log(standing.team);
            var row = ""
            var team_badge = standing.team.crestUrl.replace(/^http:\/\//i, 'https://')
            row += `
                  <tr>
                    <td class="center-align">${standing.position}</td>
                    <td class="center-align">
                      <img src="${team_badge}" class="team-badge">
                    </td>
                    <td>
                      <a href="team.html?id=${standing.team.id}">${standing.team.name}</a>
                    </td>
                    <td class="center-align">${standing.playedGames}</td>
                    <td class="center-align">${standing.won}</td>
                    <td class="center-align">${standing.draw}</td>
                    <td class="center-align">${standing.lost}</td>
                    <td class="center-align">${standing.goalsFor}</td>
                    <td class="center-align">${standing.goalsAgainst}</td>
                    <td class="center-align">${standing.goalDifference}</td>
                    <td class="center-align">${standing.points}</td>
                  </tr>
                `;

            var html = document.getElementById("teams_list").innerHTML + row;
            document.getElementById("teams_list").innerHTML = html;

            var team = {
                        id: standing.team.id,
                        name: standing.team.name,
                        badge: standing.team.crestUrl
                      }
            teams.push(team);

          })
        }
      });

      document.getElementById("last_updated").innerHTML = "Last Updated: " +  data.competition.lastUpdated;
    })
    .catch(error);
}

function getTeams() {
  fetchApi( url_competition + "teams" )
    .then(status)
    .then(json)
    .then(function(data) {

      var teamsHTML = "";
      data.teams.forEach(function(team){
        var team_badge = team.crestUrl.replace(/^http:\/\//i, 'https://')
        teamsHTML += `
              <div class="card horizontal">
                <div class="card-image valign-wrapper">
                  <img src="${team_badge}" class="team-logo">
                </div>
                <div class="card-stacked">
                  <div class="card-content">
                    <h4>${team.name}</h4>
                    <ul>
                    <li><strong>founded:</strong> ${team.founded}</li>
                    <li><strong>venue:</strong> ${team.venue}</li>
                    <li><strong>website:</strong> <a href="${team.website}" target="_blank">${team.website}</a></li>
                    </ul>
                  </div>
                  <div class="card-action">
                    <a href="team.html?id=${team.id}">team details</a>
                  </div>
                </div>
              </div>
            `
      });

      document.getElementById("teams_list").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  fetchApi( "https://api.football-data.org/v2/teams/" + idParam )
    .then(status)
    .then(json)
    .then(function(data) {
      var teamHTML = '';
      var team_badge = data.crestUrl.replace(/^http:\/\//i, 'https://');

      teamHTML = `
          <img src="${team_badge}" class="team-logo">
          <h4>${data.name}</h4>

          <p>
           <strong>since:</strong><br>${data.founded}
          </p>
          <p>
           <strong>venue:</strong><br>${data.venue}
          </p>
          <p>
           <strong>address:</strong><br>${data.address}
          </p>
          <p>
           <strong>contact:</strong><br>
           phone: ${data.phone}<br>
           email: ${data.email}<br>
          </p>
          <p>
           <strong>website:</strong><br>
           <a href="${data.website}" target="_blank">${data.website}</a>
          </p>
        `

      var playerHTML = '<h5>Players</h5>';
      data.squad.forEach(function(player){
        playerHTML += `
            <div class="card vertical">
              <div class="card-content">
                <h6>${player.name}</h6>
                <p><strong>${player.position}</strong></p>
                <p>birth: ${player.countryOfBirth}, ${player.dateOfBirth.substring(0,10)}</p>
                <p>nationality: ${player.nationality}</p>
              </div>
            </div>
          `
      });

      document.getElementById("team_details").innerHTML = teamHTML;
      document.getElementById("players").innerHTML = playerHTML;

    })
    .catch(error);
}

function getMatches() {
  fetchApi( url_competition + "matches" )
    .then(status)
    .then(json)
    .then(function(data) {

      var matchesHTML = "";
      data.matches.forEach(function(match){
        this_match = {
                        id: match.id,
                        home_id: match.homeTeam.id,
                        home_name: match.homeTeam.name,
                        away_id: match.awayTeam.id,
                        away_name: match.awayTeam.name,
                        date: match.utcDate,
                        status: match.status
                    }
        matchesHTML += `
              <div class="card horizontal">
                <div class="card-stacked">
                  <div class="card-content center-align">
                    <table width="100%">
                      <tr>
                        <td class="right-align" width="45%">
                          <h5>${this_match.home_name}</h5>
                        </td>
                        <td class="center-align">v.s.</td>
                        <td width="45%">
                          <h5>${this_match.away_name}</h5>
                        </td>
                      </tr>
                    </table>
                    <p>
                      ${this_match.date} (${this_match.status})
                    </p>
                  </div>
                  <div class="card-action right-align">
                    <a class="favorite-button" href="#"
                       class="tooltipped" data-position="right" data-tooltip="Notify Me">
                      <i class="material-icons">notifications_none</i>
                    </a>
                  </div>
                </div>
              </div>
            `
      });

      document.getElementById("matches_list").innerHTML = matchesHTML;

      const elms = document.getElementById("matches_list").getElementsByClassName("favorite-button");
      for (let i = 0; i < elms.length; i++) {
          elms[i].onclick = () => {
              const saveMatch = {
                  id: data.matches[i].id,
                  home_id: data.matches[i].homeTeam.id,
                  home_name: data.matches[i].homeTeam.name,
                  away_id: data.matches[i].awayTeam.id,
                  away_name: data.matches[i].awayTeam.name,
                  date: data.matches[i].utcDate,
                  status: data.matches[i].status
              };
              dbAddMatch(saveMatch)
          }
        }

    })
    .catch(error);

}
