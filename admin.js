$(document).ready(function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           
        } else {
           $("body").html("");
           var provider = new firebase.auth.GoogleAuthProvider();
           firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
        }
      });
});


$(".addButton").click(function () {


    try {

        var name = $("#name").val();

        var image = $("#image").val();
        var rating = parseFloat($("#rating").val());
        var sypnosis = $("#sypnosis").val();
        var review = $("#review").val();
        var isManga = $('#manga').is(':checked') ? true : false;
        var status = $('#completed').is(':checked') ? "completed" : "ongoing";
        var genres = $("#genres").val();

        if (isNaN(rating)) {
            showMessage("Error", "Rating is not a number");
            return;
        }

        if (name == "" || image == "" || sypnosis == "" || review == "" || genres == "") {
            alert("Cannot have any empty fields.");
            return;
        }

        if (isManga) {
            firebase.database().ref().child("manga/" + name).set({
                name: name,
                genres: genres,
                image: image,
                rating: rating,
                sypnosis: sypnosis,
                review: review,
                status: status
            }, function (error) {
                if (error) {
                    showMessage("Error", error.message);
                } else {
                    showMessage("Success", "Manga added successfully");
                }
            });
        } else {
            firebase.database().ref("anime/" + name).set({
                name: name,
                genres: genres,
                image: image,
                rating: rating,
                sypnosis: sypnosis,
                review: review,
                status: status
            }, function (error) {
                if (error) {
                    showMessage("Error", error.message);
                } else {
                    showMessage("Success", "Anime added successfully");
                }
            });

        }
    } catch (err) {
        alert(error.message);
    }


});

$(".getButton").click(function () {
    var refStr = $('#manga').is(':checked') ? "manga/" : "anime/";
    var name = $("#name").val();

    firebase.database().ref(refStr + name).once('value').then(function (snapshot) {
        $("#genres").val(snapshot.val().genres);
        $("#image").val(snapshot.val().image);
        $("#rating").val(snapshot.val().rating);
        $("#sypnosis").val(snapshot.val().sypnosis);
        $("#review").val(snapshot.val().review);
        if (snapshot.val().status == "completed")
            $("#completed").prop("checked", true);
        else
            $("#ongoing").prop("checked", true);

        previousItem = refStr + name;

    }).catch(function (error) {
        showMessage("Error", error.message);
    });
    
});

$(".delButton").click(function () {
    var name = $("#name").val();

    if(name == ""){
        showMessage("Error","Name must not be empty");
        return;
    }

    deleteItem("anime/" + name);
});

function deleteItem(ref){
    firebase.database().ref(ref).remove().then(function () {
        showMessage("Successful", "Item deleted successfully");
    }).catch(function (error) {
        showMessage("Error", error.message);
    });
}

function showMessage(title, message) {
    $(".messageBar").css("display", "block");
    $(".title").text(title);
    $(".message").text(message);
}

$(".okBt").click(function () {
    $(".messageBar").css("display", "none");
});