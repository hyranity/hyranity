var completed = [];
var ongoing = [];
var animeQuery = firebase.database().ref("manga").orderByChild("rating");
var selectingCompleted = true;

$(".completed").click(function () {
    selectingCompleted = true;
    $(".completedSection").css("display", "block");
    $(".ongoingSection").css("display", "none");
    $(".completed").css("opacity", "1");
    $(".ongoing").css("opacity", "0.5");
});
$(".ongoing").click(function () {
    selectingCompleted = false;
    $(".completedSection").css("display", "none");
    $(".ongoingSection").css("display", "block");
    $(".ongoing").css("opacity", "1");
    $(".completed").css("opacity", "0.5");
});



$(document).ready(function () {



    try {

        getData().then(function () {
            //flip list
            completed.reverse();

            // Write to html in completed
            loadAllData(completed, true);

            // Write to html in ongoing
            loadAllData(ongoing, false);
        });
    } catch (error) {
        alert(error.message);
    }
});

function loadAllData(list, isCompleted) {
    var counter = 0;
    if (isCompleted) {
        console.log("setting COMPLETED list");
        $(".completedSection").html('');
        list.forEach(anime => {
            counter++;
            $(".completedSection").append("<div class='item'> <div class='numbering'> " + counter + " </div> <div class='imageDiv'> <img src='" + anime.image + "'> <div class='genres'>" + String(anime.genres).toUpperCase() + "</div> </div> <div class='mainTop'> <div class='mainPart'> <div class='name'>" + String(anime.name).toUpperCase() + "</div> <br /> <div class='rating'>" + anime.rating + "</h1> </div> </div> <div class='sypnosis'> <div class='title'>sypnosis</div> <div class='description'>" + anime.sypnosis + "</div> </div> <div class='mainBottom'> \"" + anime.review + "\" </div> </div> </div><br>");
        });
    } else {
        $(".ongoingSection").html('');
        list.forEach(anime => {
            counter++;
            $(".ongoingSection").append("<div class='item'> <div class='numbering'> " + counter + " </div> <div class='imageDiv'> <img src='" + anime.image + "'> <div class='genres'>" + String(anime.genres).toUpperCase() + "</div> </div> <div class='mainTop'> <div class='mainPart'> <div class='name'>" + String(anime.name).toUpperCase() + "</div> <br /> <div class='rating'>" + anime.rating + "</h1> </div> </div> <div class='sypnosis'> <div class='title'>sypnosis</div> <div class='description'>" + anime.sypnosis + "</div> </div> <div class='mainBottom'> \"" + anime.review + "\" </div> </div> </div><br>");
        });
    }
}

function getData() {

    return new Promise(function (resolve, reject) {
        animeQuery.once('value').then(function (snapshot) {
            snapshot.forEach(manga => {
                if (manga.val().status == "completed")
                    completed.push(manga.val());

                if (manga.val().status == "ongoing")
                    ongoing.push(manga.val());

            });


            return resolve();
        }).catch(e => {
            alert("You don't have permission to read data.");
        });
    });

}

$("#query").on('input', function (e) {
    var query = $("#query").val();
    var resultList = [];
    var genreIndex = String(query).indexOf("genre=[");

    if (genreIndex >= 0 && String(query).indexOf("]", genreIndex) >= 0) {

        //Narrow by genres
        var genres = String(query).substring(genreIndex + 7, String(query).indexOf("]", genreIndex));
        var splitGenres = "";
            
            //strict comparison (AND)
            splitGenres = genres.split(",");

            if (selectingCompleted) {
                //narrow completed

                completed.forEach(item => {
                    var matchingCount = 0;
                    var hasRequiredGenres = true;

                    splitGenres.forEach(itemGenre => {

                        var genre = String(itemGenre).trim();

                        if(genre.includes("+")){
                            //Means this genre MUST be included
                            if (item.genres.includes(genre.substring(1, genre.length))){
                                matchingCount++;
                            }else{
                                //Skip because item does not have MUST HAVE genre
                                hasRequiredGenres = false;
                                return;
                            }
                        }else if(genre.includes("-")){
                            //Means this genre MUST NOT be included
                            if (item.genres.includes(genre.substring(1, genre.length))){
                                //Skip because item does has MUST NOT HAVE genre
                                hasRequiredGenres = false;
                                return;
                            }else{
                                matchingCount++;
                            }
                        
                        }else{
                            if (item.genres.includes(genre.substring(1, genre.length))){
                                
                                matchingCount++;
                            }
                        }
                    });
                    //As long as one genre matches
                    if (hasRequiredGenres && matchingCount >= 1){
                        resultList.push(item);
                    }
                });
            }
            else {
                ongoing.forEach(item => {
                    var matchingCount = 0;
                    var hasRequiredGenres = true;

                    splitGenres.forEach(itemGenre => {

                        var genre = String(itemGenre).trim();

                        if(genre.includes("+")){
                            //Means this genre MUST be included
                            if (item.genres.includes(genre.substring(1, genre.length))){
                                matchingCount++;
                            }else{
                                //Skip because item does not have MUST HAVE genre
                                hasRequiredGenres = false;
                                return;
                            }
                        }else if(genre.includes("-")){
                            //Means this genre MUST NOT be included
                            if (item.genres.includes(genre.substring(1, genre.length))){
                                //Skip because item does has MUST NOT HAVE genre
                                hasRequiredGenres = false;
                                return;
                            }else{
                                matchingCount++;
                            }
                        
                        }else{
                            if (item.genres.includes(genre.substring(1, genre.length))){
                                
                                matchingCount++;
                            }
                        }
                    });
                    //As long as one genre matches
                    if (hasRequiredGenres && matchingCount >= 1){
                        resultList.push(item);
                    }
                });
            }
    } else {
        try {

            //Search by name


            completed.forEach(item => {
                if (String(item.name).toLowerCase().includes(query.toLowerCase())) {
                    resultList.push(item);
                }
            })


            loadAllData(resultList, selectingCompleted);




        } catch (error) {
            alert(error.message);
        }
    }

    loadAllData(resultList, selectingCompleted);

});

$(".help").click(function(){
    $(".messageBar").css("display", "block");
});

$(".okBt").click(function () {
    $(".messageBar").css("display", "none");
});

// function narrowDownList(list, query){
//     return new Promise(function (resolve, reject) {
//         forEach(item =>{
//             if(String(item.name).toLowerCase().includes(query.toLowerCase())){
//                 console.log("matching " + item.name + " and " + query);
//                 resultList.push(item);
//             }
//         });

//         return resolve();
//     });
// }
