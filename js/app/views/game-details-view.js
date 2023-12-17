define(function () {
    var internals = {
        handlers: {},
        elements: {}
    };

    var externals = {};

    function Rgba(r,g,b,a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    //Linear RGB interpolation formula: c = a + (b - a) * t
    //Source: https://www.alanzucconi.com/2016/01/06/colour-interpolation/
    internals.linearInterpRGB = function(aCol, bCol, t){
        return new Rgba(
            aCol.r + (bCol.r - aCol.r) * t,
            aCol.g + (bCol.g - aCol.g) * t,
            aCol.b + (bCol.b - aCol.b) * t,
            aCol.a + (bCol.a - aCol.a) * t
        ); 
    }

    internals.platformIconMap = {
        1: `<i class="platform-icon fa-brands fa-windows fa-xl"></i>`,
        2: `<i class="platform-icon fa-brands fa-playstation fa-xl"></i>`,
        3: `<i class="platform-icon fa-brands fa-xbox fa-xl"></i>`,
        5: `<i class="platform-icon fa-brands fa-apple fa-xl"></i>`,
        get: function (id) {
            return this.hasOwnProperty(id) ? this[id] : "";
        }
    }

    internals.renderAvailablePlatforms = function (game) {
        var gamePlatforms = `<div class="platforms text-center" id="platform-details"><p><h5>Platforms<h5></p>`;

        game.parent_platforms.forEach(platform => {
            gamePlatforms += internals.platformIconMap.get(platform.platform.id);
        })
        return gamePlatforms + '</div>';
    }

    internals.createCarouselButtons = function (items) {
        var buttons = "";
        items.forEach((item, index) => {
            buttons += `<button type="button" data-bs-target="#myCarousel" data-bs-slide-to="${index + 1}" aria-label="Slide ${index + 1}"></button>`
        })
        return buttons;
    }

    internals.renderCarouselItems = function (items) {
        return items.map(item => {
            return `<div class="carousel-item">
                        <img class="d-block w-100" src="${item.image}" alt="Slide Image">
                    </div>`
        }).join("");
    }

    internals.renderRating = function (game) {
        var startColor = new Rgba(255, 69, 0, 1);
        var endColor = new Rgba(92, 214, 92, 1);

        //normalizing a ratio of 1.0-5.0 range to 0.00 to 1.00
        var normalizedRating = (game.rating.toFixed(1) - 1.0) / (5.0 - 1.0);

        var lerpVal = internals.linearInterpRGB(startColor, endColor, normalizedRating);
        return `<div class="rating-box" style="background-color: rgba(${lerpVal.r}, ${lerpVal.g}, ${lerpVal.b}, ${lerpVal.a});">
                <p>Score</p>
                <h2>${game.rating.toFixed(1)}</h2>  
                </div>`
    }

    internals.renderCarousel = function (game, gameScreens) {
        return `  <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          ${internals.createCarouselButtons(gameScreens.results)}
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100" src="${game.background_image}" alt="First slide">    
          </div>
          ${internals.renderCarouselItems(gameScreens.results)}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>`
    }

    externals.renderGameDetails = function (game, gameScreenShots, gameTrailers) {
        $('#gamelist').empty();
        $('#search-box').remove();

        window.scrollTo({ top: 0, behavior: 'smooth'});

        //Create a home / go back button
        $(`<a href="#list" id="back-btn" class="btn btn-secondary"><i class="fa-solid fa-house"></i></a>`).appendTo("#gamelist");

        // Create the game card
        var gameCard = $(`<div class="card bg-dark text-white border-secondary" id="details-card" >`);

        // Add the game title
        gameCard.append(`<h5 class="card-title text-center">${game.name}</h5>`);

        // Add the carousel
        gameCard.append(internals.renderCarousel(game, gameScreenShots));

        // Add the game platforms
        gameCard.append(internals.renderAvailablePlatforms(game));

        //Add rating marker
        gameCard.append(internals.renderRating(game));

        // Add the game description
        var gameDescription = $(`<div class="card-body"><hr class="hr" />`);
        gameDescription.append(`<h5 class="card-title text-center">Game Description</h5>`);
        gameDescription.append(`<p class="card-text">${game.description}</p>`);
        gameCard.append(gameDescription);

        //Add game trailer
        if(gameTrailers.count){
        var videoTrailer = $(
            `<div id="game-trailer">
            <hr class="hr" />
            <h5 class="text-center"> Game Trailer </h5>
            <div class="video-container embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${gameTrailers.results[0].data.max}" allowfullscreen></iframe>
            </div></div>`
            );

            gameCard.append(videoTrailer);
        }
        
        // Add the game details
        var gameDetails = $(`
            <ul class="list-group list-group-flush" id="detailslist"><h5 class="text-center">Game Details</h5>
                <li class="list-group-item bg-dark text-white border-secondary"><strong>Average Playtime:</strong> ${game.playtime} hours</li>
                <li class="list-group-item bg-dark text-white border-secondary"><strong>Release Date:</strong> ${game.released}</li>
                <li class="list-group-item bg-dark text-white border-secondary"><strong>Genre:</strong> ${game.genres.map(genre => genre.name).join(", ")}</li>
                </ul>
            `);

        gameCard.append(gameDetails);

        // Add the game card to the game list
        gameCard.appendTo("#gamelist");
    }

    return externals;
});
