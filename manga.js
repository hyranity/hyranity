$(".completed").click(function () {
    $(".completedSection").css("display", "block");
    $(".ongoingSection").css("display", "none");
    $(".completed").css("opacity", "1");
    $(".ongoing").css("opacity", "0.5");
});
$(".ongoing").click(function () {
    $(".completedSection").css("display", "none");
    $(".ongoingSection").css("display", "block");
    $(".ongoing").css("opacity", "1");
    $(".completed").css("opacity", "0.5");
});

var completed = [];
var ongoing = [];
var animeQuery = firebase.database().ref("manga").orderByChild("rating");

$(document).ready(function () {

   

    try {

        getData().then(function () {
            //flip list
            completed.reverse();

            // Write to html in completed
            var counter = 0;
            completed.forEach(anime => {
                counter++;
                $(".completedSection").append("<div class='item'> <div class='numbering'> " + counter + " </div> <div class='imageDiv'> <img src='" + anime.image + "'> <div class='genres'>" + String(anime.genres).toUpperCase() + "</div> </div> <div class='mainTop'> <div class='mainPart'> <div class='name'>" + String(anime.name).toUpperCase() + "</div> <br /> <div class='rating'>" + anime.rating + "</h1> </div> </div> <div class='sypnosis'> <div class='title'>sypnosis</div> <div class='description'>" + anime.sypnosis + "</div> </div> <div class='mainBottom'> \"" + anime.review + "\" </div> </div> </div><br>");
            });

            // Write to html in ongoing
            counter = 0;
            ongoing.forEach(anime => {
                counter++;
                $(".ongoingSection").append("<div class='item'> <div class='numbering'> " + counter + " </div> <div class='imageDiv'> <img src='" + anime.image + "'> <div class='genres'>" + String(anime.genres).toUpperCase() + "</div> </div> <div class='mainTop'> <div class='mainPart'> <div class='name'>" + String(anime.name).toUpperCase() + "</div> <br /> <div class='rating'>" + anime.rating + "</h1> </div> </div> <div class='sypnosis'> <div class='title'>sypnosis</div> <div class='description'>" + anime.sypnosis + "</div> </div> <div class='mainBottom'> \"" + anime.review + "\" </div> </div> </div><br>");
            });
        });
    } catch (error) {
        alert(error.message);
    }
});

function getData() {

    return new Promise(function (resolve, reject) {
            animeQuery.once('value').then(function (snapshot) {
                snapshot.forEach(anime => {
                    if (anime.val().status == "completed")
                        completed.push(anime.val());

                    if (anime.val().status == "ongoing")
                        ongoing.push(anime.val());

                });


                return resolve();
            }).catch(e =>{
                alert("You don't have permission to read data.");
            });
    });

}
