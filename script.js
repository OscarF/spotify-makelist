var perPage = 50;

var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"),
	ui = sp.require("sp://import/scripts/ui"),
	player = models.player,
	library = models.library,
	application = models.application;

var searchField, oldQuery = "";

function doSearch () {
	$('#searchResult').empty();
	var query = searchField.value;
	if (query != "" && query != oldQuery) {
		oldQuery = query;
		var search = new models.Search(query, {'searchType': models.SEARCHTYPE.SUGGESTION});
		search.observe(models.EVENT.CHANGE, function() {
			console.log("search done");
			var tempPlaylist = new models.Playlist();
			search.tracks.forEach(function(track){
				tempPlaylist.add(track);
			});
			//var trackList = listSongs(tempPlaylist);
			var trackList = new views.List(tempPlaylist, renderItem);
			$('#searchResult').append(trackList);
		});
		search.appendNext();
	}
}

function prefixColumn (elements, toInsert) {
	elements.find('a').prepend(toInsert);
}

function renderItem (track) {
	return $('<li></li>').text(track.name + ', ' + track.artists.toString());
}

function listSongs (collection) {
	var track, list = $('<ul class="trackList"></ul>');
	for (var i=0; i < perPage && i < collection.length; i++) {
		track = collection.get(i);
		list.append($('<li></li>').text(track.name + ', ' + track.artists.toString()));
	};
	return list;
}

$(document).ready(function () {
	//search
	searchField = $('#searchField').bind('keyup change keypress', doSearch)[0];
});

