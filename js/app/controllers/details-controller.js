define(['views/game-details-view', 'services/game-service'], function(gameView, gameService)
{
    var externals = {};
    var internals = {};

    externals.start = function() {
        internals.initialize()
    };

    internals.initialize = function() {
        gameService.getGameDetails( function(gameDetails, gameScreens, gameTrailers){
            gameView.renderGameDetails(gameDetails, gameScreens, gameTrailers);
        } );
    };

    return externals;
});