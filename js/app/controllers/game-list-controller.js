define(['views/game-list-view', 'services/game-service'], function(gameView, gameService)
{
    var externals = {};
    var internals = {};

    externals.start = function() {
        internals.bindEventHandlers();
        internals.initialize()
    };

    internals.bindEventHandlers = function() {
        gameView.bind('searchBtn', internals.searchButtonHandler);
        gameView.bind('loadMoreBtn', internals.loadMoreSearchHandler);
    };

    internals.searchButtonHandler = function() {
        gameService.searchGame(function(gameSearchArr) {
            gameView.render(gameSearchArr);
        });
    };

    internals.loadMoreSearchHandler = function() {
        gameService.loadMoreSearch(function(gameSearchArr) {
            gameView.render(gameSearchArr);
        });
    };

    internals.initialize = function() {
        gameService.getGameList( function(gameListArr){
            gameView.render(gameListArr);
        } );
    };

    return externals;
});