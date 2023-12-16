define(function() {
    var internals = {
        handlers: {},
        elements: {}
    };

    var externals = {};

    internals.platformIconMap = {
        1 : `<i class="platform-icon fa-brands fa-windows"></i>`,
        2 : `<i class="platform-icon fa-brands fa-playstation"></i>`,
        3 : `<i class="platform-icon fa-brands fa-xbox"></i>`,
        5 : `<i class="platform-icon fa-brands fa-apple"></i>`,
        get : function(id){
            return this.hasOwnProperty(id) ? this[id] : "";
        }
    }

    internals.ratingMap = {
        1 : `<div class="rating-badge" style="background-color: rgba(255, 0, 0, 0.249);">Really Bad</div>`,
        2 : `<div class="rating-badge" style="background-color: rgba(255, 106, 0, 0.249);">Bad</div>`,
        3 : `<div class="rating-badge" style="background-color: rgba(255, 183, 0, 0.249);">Average</div>`,
        4 : `<div class="rating-badge" style="background-color: rgba(251, 255, 0, 0.249);">Good</div>`,
        5 : `<div class="rating-badge" style="background-color: rgba(17, 255, 0, 0.249);">Excellent</div>`,
        get : function(id){
            return this.hasOwnProperty(id) ? this[id] : `<div class="badge badge-secondary">No Reviews</div>`;
        }
    }

    internals.renderRating = function(game){
        return internals.ratingMap.get(game.rating_top);
    }

    internals.createViewMoreButton = function(game) {
        return `<a href="#details?id=${game.id}" class="btn btn-secondary">View More</a>`;
    }

    internals.renderThumbImage = function(game) {
        return `<img class="card-img-top" src="${game.background_image}" alt="Game Image"/>`;
    }

    internals.renderTitle = function(game){
        return `<h5 class="game-title card-title">${game.name}</h5>`;
    }

    internals.renderAvailablePlatforms = function(game) {
        var gamePlatforms =  `<div class="platforms">`;

        game.parent_platforms.forEach( platform => {
            gamePlatforms += internals.platformIconMap.get(platform.platform.id);
        })
        return gamePlatforms;
    }

    internals.createLoadMoreButton = function(pageNumber) {
        $("#loadmore-btn").remove();

        var hashLoc = window.location.hash;

        if(!hashLoc.includes("page=")){
            return `<a href="#list?page=${2}" id="loadmore-btn" class="btn btn-secondary">Load More</a>`;
        }

        var currentPageNumber = hashLoc.substring( hashLoc.indexOf("page=") +  5);

        return `<a href="#list?page=${++currentPageNumber}" id="loadmore-btn" class="btn btn-secondary">Load More</a>`;
    }

    externals.render = function(gameListArr){
        internals.elements.gameList = $('#gamelist');
        $('#details-card').remove();

        if(!window.location.hash.includes("page")){
            internals.elements.gameList.empty();
        }

        var cardDeck = $(`<div class="row">`)

        gameListArr.forEach(function(game) {

            var gameCard =  $(`
            <div class="card border-secondary bg-dark text-white text-center" style="width: 18rem;">
                ${internals.renderThumbImage(game)}
                <div class="card-body">
                    ${internals.renderAvailablePlatforms(game)}
                    ${internals.renderRating(game)}
                    ${internals.renderTitle(game)}
                    ${internals.createViewMoreButton(game)}
                </div>
            </div>
        `);

            gameCard.appendTo(cardDeck)
        });

        internals.elements.gameList.append(cardDeck);

        internals.elements.gameList.append(internals.createLoadMoreButton());
    }
    return externals;
});
