/** Used to fetch data from the API */

    const internals = {}; // internal state

    const rawg_api_url = "https://api.rawg.io/api/games";
    const rawg_api_key = "?key=55e2266c102f46bca8fc7ac9b06aaca8";

    function RequestData(endpoint, page = ""){
        this.base_url = rawg_api_url,
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
        var id = hashValue.substring(hashValue.indexOf("#details/") + "#details/".length);
        return id;
    }

    internals.getGameDetails = function () {
        var requestData = new RequestData("/" + internals.getGameId() + rawg_api_key);
        return internals.doGetRequest(requestData);
    }

    internals.getGameScreenshots = function () {
        var requestData = new RequestData("/" + internals.getGameId() + "/screenshots" + rawg_api_key);
        return internals.doGetRequest(requestData);
    }

    internals.getGameTrailers = function () {
        var requestData = new RequestData("/" + internals.getGameId() + "/movies" + rawg_api_key);
        return internals.doGetRequest(requestData);
    }

    var loadMoreSearch = async function(renderFnCallback){
        var gameName = $("#search-input").val();
        internals.lastPageNum++;

        internals.lastRequest.page++;
        var gameList = await internals.doGetRequest(internals.lastRequest);

        renderFnCallback(gameList.results);
    }

    var searchGame = async function(renderFnCallback) {
        $('#details-card').remove();
        $('#gamelist').empty();

        var gameName = $("#search-input").val();
        internals.lastPageNum = 1;

        var requestData = 
            new RequestData(rawg_api_key + "&search=" + gameName + "&page=", internals.lastPageNum);

        var gameList = await internals.doGetRequest(requestData);

        renderFnCallback(gameList.results);
    }

    var getGameList = async function(renderFnCallback) {
        $('#details-card').remove();
        $('#gamelist').empty();

        internals.lastPageNum = 1;

        var requestData = 
            new RequestData(rawg_api_key + "&page=", internals.lastPageNum);

        var gameList = await internals.doGetRequest(requestData);

        renderFnCallback(gameList.results);
    }

    var getGameDetails = async function (renderFnCallback) {
        const [gameDetails, gameScreenshots, gameTrailers] = await Promise.all([internals.getGameDetails(), internals.getGameScreenshots(), internals.getGameTrailers()]);
        
        renderFnCallback(gameDetails, gameScreenshots, gameTrailers);
    }

    export default {loadMoreSearch, searchGame, getGameList, getGameDetails};
