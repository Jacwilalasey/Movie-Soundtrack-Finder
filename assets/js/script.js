$(document).ready(function () {

    // Global Variables

    let url = 'http://www.omdbapi.com/?s=';
    let url2 = 'http://www.omdbapi.com/?i=';
    let url3 = 'http://www.omdbapi.com/?t=';
    let apiKey = "1fcd68b1&";
    let imageDiv = $(".movie-image");
    let movieInfo = $(".current-movie-data")
    let searchedMovieDrop = $("#populate-searches")

    //  Renders searched movie posters to page

    function renderSearch(data) {

        searchedMovieDrop.empty()
        for (let i = 0; i < 5; i++) {
            let poster = $('<img>').attr('src', data[i].Poster);
            poster.addClass('img-search');
            poster.attr('data-id', data[i].imdbID)
            let searchedMovie = $('<div>');
            searchedMovie.addClass('inline');
            searchedMovie.append(poster);
            searchedMovieDrop.append(searchedMovie);
        }
    };

    // Renders movie information to page

    function renderMovieInfo(data) {

        imageDiv.empty();
        movieInfo.empty();

        let movieListButton = $("<button>").attr("id", "movie-list-button").text("Add to Saved Movies");
        movieListButton.attr("data-title", data.Title);
        let movieButtonResponse = $('<div>');
        movieButtonResponse.addClass('response-text');
        let poster = $('<img>').attr('src', data.Poster);
        poster.addClass('img-main');
        let title = $('<h1>').text(data.Title);
        let released = $('<h4>').text(`Released: ${data.Released}`);
        let genre = $('<h4>').text(`Genre: ${data.Genre}`);
        let plot = $('<p>').text(`"${data.Plot}"`);
        plot.css("font-style", "italic");
        let director = $('<h4>').text(`Director: ${data.Director}`);
        let boxOffice = $('<h4>').text(`Box Office Sales: ${data.BoxOffice}`);

        imageDiv.append(poster);
        movieInfo.append(title, plot, released, genre, director, boxOffice, movieListButton, movieButtonResponse);

    };

    // renders movies from local storage to array used to populate local storage if local storage is not null

    let list = JSON.parse(localStorage.getItem("movieTitle"))
    titleArray = []

    function localPush() {
        if (list !== null) {

            list.forEach((item) => {
                titleArray.push(item);
            });
        } else {
            return;
        }
    };

    localPush();

    // Saving movies to local storage and my list function / event listener to call this //

    function renderList() {
        let title = $("#movie-list-button").attr("data-title");
        if (titleArray.includes(title)) {
            alreadyAddedToLocal();
            return;
        } else {
            titleArray.unshift(title);
            setTimeout(addedToLocal(), 4000);
        }

        localStorage.setItem("movieTitle", JSON.stringify(titleArray));
    }

    $(document).on("click", "#movie-list-button", renderList);

    // Fucntions to add text confirming movie added to or already on movie list/local storage

    function addedToLocal() {
        clearLocalAddResponse();
        let addedText = $("<p>").text('Added to my Movie List!')
        addedText.addClass('saveResponse');
        $(".response-text").append(inline);
        setTimeout(clearLocalAddResponse, 2000);
    }

    function alreadyAddedToLocal() {
        clearLocalAddResponse();
        let notAdded = $("<p>").text('Already added to my Movie List!');
        notAdded.addClass('saveResponse')
        $(".response-text").append(notAddedText);
        setTimeout(clearLocalAddResponse, 2000);
    }

    function clearLocalAddResponse() {
        $(".response-text").empty();
    }

    // search function

    $("#search-button").click(function (event) {
        event.preventDefault();
        imageDiv.empty();
        movieInfo.empty();
        let searchInput = $('#movie-input').val().trim()
        let queryUrl = `${url}${searchInput}&apikey=${apiKey}`;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {

                let search = response.Search
                renderSearch(search);
            });
    });

    // movie data function

    function movieData() {
        $("#movie-input").val("");
        var imdbID = $(this).attr("data-id");
        let queryUrl = `${url2}${imdbID}&apikey=${apiKey}`;

        $('.img-search').removeClass('border');
        $(this).addClass('border');


        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {
                renderMovieInfo(response);
            });

    };

    $(document).on("click", ".img-search", movieData);

    // RANDOM MOVIE BUTTON GENERATOR

    // array of random movies
    let randomMovie = [
        "The Dark Knight",
        "Die Hard",
        "Raiders of the Lost Ark",
        "Lethal Weapon",
        "Terminator 2: Judgment Day",
        "RoboCop",
        "Aliens",
        "The Matrix",
        "The Matrix Reloaded",
        "The Matrix Revolutions",
        "The Terminator",
        "Gladiator",
        "Pulp Fiction",
        "Wolf of Wall Street",
        "Hateful Eight",
        "The Incredible Hulk",
        "The Avengers",
        "Iron Man",
        "Mad Max: Fury Road"
    ];

    // Assigned all movie buttons to a variable 

    let genreBtn = $(".randomButton");

    // Function that renders movie info from random button to page 

    function displayMovieInfo(movieTitle) {
        let url = `${url3}${movieTitle}&apikey=${apiKey}`;
        $.ajax({
            url: url,
            method: 'GET'
        }).then(function (data) {

            imageDiv.empty();
            movieInfo.empty();

            let poster = $('<img>').attr('src', data.Poster);
            poster.addClass('img-main');
            let title = $('<h1>').text(data.Title);
            let released = $('<h4>').text(`Released: ${data.Released}`);
            let genre = $('<h4>').text(`Genre: ${data.Genre}`);
            let plot = $('<p>').text(`"${data.Plot}"`);
            plot.css("font-style", "italic");
            let director = $('<h4>').text(`Director: ${data.Director}`);
            let boxOffice = $('<h4>').text(`Box Office Sales: ${data.BoxOffice}`);
            let movieListButton = $("<button>").attr("id", "movie-list-button").text("Add to Saved Movies");
            movieListButton.attr("data-title", movieTitle);
            let movieButtonResponse = $('<div>');
            movieButtonResponse.addClass('response-text');

            imageDiv.append(poster);
            movieInfo.append(title, plot, released, genre, director, boxOffice, movieListButton, movieButtonResponse);

        });
    }

    // Event listener that runs the displayMovieInfo function on random button click

    $('.randomButton').click(function () {
        $("#movie-input").val("");
        searchedMovieDrop.empty();
        const movieTitle = $(this).html();
        displayMovieInfo(movieTitle);
    });


    // Function to pick a random movie from the array and append to the button

    // Array to keep track of movies that have already been appended to the buttons
    let usedMovies = [];

    // Function to pick a random movie from the array and append to the button
    function randomise() {
        // if all movies have been used, reset the usedMovies array back to an empty array
        if (usedMovies.length === randomMovie.length) {
            usedMovies = [];
        }
        for (let i = 0; i < genreBtn.length; i++) {
            let movie = randomMovie[Math.floor(Math.random() * randomMovie.length)];

            // If the movie has already been used, pick another movie
            if (usedMovies.includes(movie)) {
                // exit condition for the function so that it will not continue to call itself infinitely
                if (usedMovies.length < randomMovie.length) {
                    randomise();
                }

            } else {
                // If the movie has not been used, append it to the button and add it to the usedMovies array
                genreBtn[i].innerHTML = movie;
                usedMovies.push(movie);

            }
        }
    }

    // called the function to pick a random movie from the array and append to the button when page loads
    randomise();



    // added event listener to the randomise button to randomly pick a movie from the array and append to each button
    document.getElementById("random-btn").addEventListener("click", randomise);


    function renderRandomMovie() {
        $("#movie-input").val("");
        searchedMovieDrop.empty();

        const movieTitle = $('#random-render').html();

        console.log(movieTitle);

        displayMovieInfo(movieTitle);
    };

    renderRandomMovie()

});