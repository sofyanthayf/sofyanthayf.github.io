var dbPromise = idb.open("dicodingepl", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("fav_matches")) {
    var peopleOS = upgradeDb.createObjectStore("fav_matches");
    peopleOS.createIndex("id", "id", { unique: true });
  }
});


function dbAddMatch(match) {
  console.log(match.id);
  dbPromise.then(function(db) {
    var tx = db.transaction('fav_matches', 'readwrite');
    var store = tx.objectStore('fav_matches');

      store.put(match, match.id);

      return tx.complete;
    }).then(function() {
      console.log('Favorite Match berhasil disimpan.');
    }).catch(function() {
      console.log('Favorite Match gagal disimpan.')
    })
}

function dbDeleteMatch(match_id) {
    dbPromise.then(function(db) {
      var tx = db.transaction('fav_matches', 'readwrite');
      var store = tx.objectStore('fav_matches');
      store.delete(match_id);
      return tx.complete;
    }).then(function() {
      console.log('Item deleted');
    });
}

function dbGetFavoriteMatches() {
  dbPromise.then(function(db) {
    var tx = db.transaction('fav_matches', 'readonly');
    var store = tx.objectStore('fav_matches');
    return store.getAll();
  }).then(function(matches) {
    console.log(matches);
    var matchesHTML = "";
    matches.forEach(function(this_match){
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
                  <a class="removefavorite-button" href="#"
                     class="tooltipped" data-position="right" data-tooltip="Delete">
                    <i class="material-icons">clear</i>
                  </a>
                </div>
              </div>
            </div>
          `
    });

    document.getElementById("matches_list").innerHTML = matchesHTML;

    const elms = document.getElementById("matches_list").getElementsByClassName("removefavorite-button");
    for (let i = 0; i < elms.length; i++) {
      elms[i].onclick = () => {
          dbDeleteMatch(matches[i].id);
          dbGetFavoriteMatches();
      }
    }

  });
}
