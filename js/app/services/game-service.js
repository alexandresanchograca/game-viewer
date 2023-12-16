/** Used to fetch data from the API */

define(function () {
    var internals = {}; // internal state
    var externals = {}; // external api

    internals.rawg_api_url = "https://api.rawg.io/api/games";
    internals.rawg_api_key = "?key=55e2266c102f46bca8fc7ac9b06aaca8";

    internals.getGameId = function () {

        var hashValue = window.location.hash;
        var id = hashValue.substring(hashValue.indexOf("id=") + 3);

        return id;
    }

    internals.getGameDetails = function () {
        return fetch(internals.rawg_api_url + "/" + internals.getGameId() + internals.rawg_api_key)
            .then(function (arg) {
                return arg.json().then(function (arg) {
                    return arg;
                });
            })
    }

    internals.getGameScreenshots = function (gameId) {
        return fetch(internals.rawg_api_url + "/" + internals.getGameId() + "/screenshots" + internals.rawg_api_key)
            .then(function (arg) {
                return arg.json().then(function (arg) {
                    return arg;
                });
            })
    }

    internals.getGameTrailers = function (gameId) {
        return fetch(internals.rawg_api_url + "/" + internals.getGameId() + "/movies" + internals.rawg_api_key)
            .then(function (arg) {
                return arg.json().then(function (arg) {
                    return arg;
                });
            })
    }

    internals.getGameList= function (pageNum) {
        return fetch(internals.rawg_api_url + internals.rawg_api_key + "&page=" + pageNum)
            .then(function (arg) {
                return arg.json().then(function (arg) {
                    return arg;
                });
            })
    }

    externals.getGameList = function (renderFnCallback) {

        var hashLoc = window.location.hash;
        var pageNum = 1;

        if (hashLoc.includes("page=")) {
            pageNum = hashLoc.substring(hashLoc.indexOf("page=") + 5);
        }

        internals.getGameList(pageNum).then( arg => renderFnCallback(arg.results) );
    }

    externals.getGameDetails = function (renderFnCallback) {

        Promise.all([internals.getGameDetails(), internals.getGameScreenshots(), internals.getGameTrailers()])
            .then(function (gameData) {
                renderFnCallback(gameData[0], gameData[1], gameData[2]);
            })
    }

    return externals;
});
