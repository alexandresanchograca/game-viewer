/** Used to fetch data from the API */

define(function () {
    var internals = {}; // internal state
    var externals = {}; // external api

    internals.rawg_api_url = "https://api.rawg.io/api/games";
    internals.rawg_api_key = "?key=55e2266c102f46bca8fc7ac9b06aaca8";

    function RequestData(endpoint, page = ""){
        this.base_url = internals.rawg_api_url,
        this.endpoint = endpoint;
        this.page = page;
    }

    internals.doGetRequest = async function (requestData) {
        internals.lastRequest = requestData;
        var response = await fetch(requestData.base_url + requestData.endpoint + requestData.page);
        return await response.json();
    }

    internals.getGameId = function () {
        var hashValue = window.location.hash;
        var id = hashValue.substring(hashValue.indexOf("id=") + 3);
        return id;
    }

    internals.getGameDetails = function () {
        var requestData = new RequestData("/" + internals.getGameId() + internals.rawg_api_key);
        return internals.doGetRequest(requestData);
    }

    internals.getGameScreenshots = function () {
        var requestData = new RequestData("/" + internals.getGameId() + "/screenshots" + internals.rawg_api_key);
        return internals.doGetRequest(requestData);
    }

    internals.getGameTrailers = function () {
        var requestData = new RequestData("/" + internals.getGameId() + "/movies" + internals.rawg_api_key);
        return internals.doGetRequest(requestData);
    }

    externals.loadMoreSearch = async function(renderFnCallback){
        var gameName = $("#search-input").val();
        internals.lastPageNum++;

        internals.lastRequest.page++;
        var gameList = await internals.doGetRequest(internals.lastRequest);

        renderFnCallback(gameList.results);
    }

    externals.searchGame = async function(renderFnCallback) {
        $('#details-card').remove();
        $('#gamelist').empty();

        var gameName = $("#search-input").val();
        internals.lastPageNum = 1;

        var requestData = 
            new RequestData(internals.rawg_api_key + "&search=" + gameName + "&page=", internals.lastPageNum);

        var gameList = await internals.doGetRequest(requestData);

        renderFnCallback(gameList.results);
    }

    externals.getGameList = async function(renderFnCallback) {
        $('#details-card').remove();
        $('#gamelist').empty();

        internals.lastPageNum = 1;

        var requestData = 
            new RequestData(internals.rawg_api_key + "&page=", internals.lastPageNum);

        var gameList = await internals.doGetRequest(requestData);

        renderFnCallback(gameList.results);
    }

    externals.getGameDetails = async function (renderFnCallback) {
        const [gameDetails, gameScreenshots, gameTrailers] = await Promise.all([internals.getGameDetails(), internals.getGameScreenshots(), internals.getGameTrailers()]);
        
        renderFnCallback(gameDetails, gameScreenshots, gameTrailers);
    }

    return externals;
});
