/** Used to fetch data from the API */

define(function () {
    var internals = {}; // internal state
    var externals = {}; // external api

    internals.rawg_api_url = "https://api.rawg.io/api/games";
    internals.rawg_api_key = "?key=55e2266c102f46bca8fc7ac9b06aaca8";

    function RequestData(endpoint, page){
        this.base_url = internals.rawg_api_url,
        this.endpoint = endpoint;
        this.page = page;
    }

    internals.doGetRequest = function (requestData) {
        internals.lastRequest = requestData;
        return fetch(requestData.base_url + requestData.endpoint + requestData.page)
            .then(function (arg) {
                return arg.json().then(function (arg) {
                    return arg;
                });
            })
    }

    internals.getGameId = function () {
        var hashValue = window.location.hash;
        var id = hashValue.substring(hashValue.indexOf("id=") + 3);
        return id;
    }

    internals.getGameDetails = function () {
        var requestData = new RequestData("/" + internals.getGameId() + internals.rawg_api_key, "");
        return internals.doGetRequest(requestData);
    }

    internals.getGameScreenshots = function () {
        var requestData = new RequestData("/" + internals.getGameId() + "/screenshots" + internals.rawg_api_key, "");
        return internals.doGetRequest(requestData);
    }

    internals.getGameTrailers = function () {
        var requestData = new RequestData("/" + internals.getGameId() + "/movies" + internals.rawg_api_key, "");
        return internals.doGetRequest(requestData);
    }

    externals.loadMoreSearch = function(renderFnCallback){
        var gameName = $("#search-input").val();
        internals.lastPageNum++;

        internals.lastRequest.page++;
        internals.doGetRequest(internals.lastRequest).then( arg => renderFnCallback(arg.results) );
    }

    externals.searchGame = function (renderFnCallback) {
        $('#details-card').remove();
        $('#gamelist').empty();

        var gameName = $("#search-input").val();
        internals.lastPageNum = 1;

        var requestData = 
            new RequestData(internals.rawg_api_key + "&search=" + gameName + "&page=", internals.lastPageNum);

        internals.doGetRequest(requestData).then( arg => renderFnCallback(arg.results) );
    }

    externals.getGameList = function (renderFnCallback) {
        $('#details-card').remove();
        $('#gamelist').empty();

        internals.lastPageNum = 1;

        var requestData = 
            new RequestData(internals.rawg_api_key + "&page=", internals.lastPageNum);

        internals.doGetRequest(requestData).then( arg => renderFnCallback(arg.results) );
    }

    externals.getGameDetails = function (renderFnCallback) {
        Promise.all([internals.getGameDetails(), internals.getGameScreenshots(), internals.getGameTrailers()])
            .then(function (gameData) {
                renderFnCallback(gameData[0], gameData[1], gameData[2]);
            })
    }

    return externals;
});
