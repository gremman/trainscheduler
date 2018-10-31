// Steps to complete:
$(document).ready()

  // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAlHWtUbZsFjVAoi9DB44thZy7n-7v5Fn8",
        authDomain: "trainscheduler-8ba51.firebaseapp.com",
        databaseURL: "https://trainscheduler-8ba51.firebaseio.com",
        projectId: "trainscheduler-8ba51",
        storageBucket: "trainscheduler-8ba51.appspot.com",
        messagingSenderId: "893537751048"
    };
    firebase.initializeApp(config);

    var database = firebase.database();



// Button for adding new Train row
    $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

  // Grabs user input
    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var firstTrainTime = moment($("#firsttrain-input").val().trim(), "h:mm").format("HH:mm");
    

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: name,
    trainDestination: destination,
    trainFrequency: frequency,
    firstStart: firstTrainTime,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.trainDestination);
  console.log(newTrain.trainFrequency);
  console.log(newTrain.firstStart);
  console.log("---------------------")

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#firsttrain-input").val("");
});

  // Create Firebase event for adding train input to the database and a row in the html 
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var name = childSnapshot.val().trainName;
  var destination = childSnapshot.val().trainDestination;
  var frequency = childSnapshot.val().trainFrequency;
  var firstTrainTime = childSnapshot.val().firstStart;
  

  // Train Info
  console.log(name);
  console.log(destination);
  console.log(frequency);


  // Calculate next arrival and minutes away variables to display in table
    // NEXT ARRIVAL Calculation
       
        // First Time (pushed back 1 year to make sure it comes before current time)
         var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
         console.log(firstTrainTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextArrival = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
        console.log("=======================");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

