define(['views/game-list-view', 'services/game-service'], function(gameView, gameService)
{
    var externals = {};
    var internals = {};

    externals.start = function() {
        internals.initialize()
    };

    internals.initialize = function() {
        gameService.getGameList( function(gameListArr){
            gameView.render(gameListArr);
        } );
    };

    return externals;
});