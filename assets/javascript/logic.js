$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAS5qklKZWDMY7dEtPT6-p2XNrcAYxq1sI",
        authDomain: "employee-db-52dda.firebaseapp.com",
        databaseURL: "https://employee-db-52dda.firebaseio.com",
        projectId: "employee-db-52dda",
        storageBucket: "employee-db-52dda.appspot.com",
        messagingSenderId: "954184407396"
      };
    firebase.initializeApp(config);
    var database = firebase.database();

    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    // This function allows you to update your page in real-time when the firebase database changes.
    database.ref().on("value", function(snapshot) {
        var items = snapshot.val();

        // On page load, the table will be empty so this conditional evaluates to true.
        // Initializes the table with the items that are in the database already.
        if($("#the-table").is(':empty')) {
            var headRow = $("<tr></tr>");
            var head1 = $("<th>Name</th>");
            var head2 = $("<th>Position</th>");
            var head5 = $("<th>Email</th>");
            var head3 = $("<th>Monthly Salary</th>");
            var head4 = $("<th>Remove</th>");
            var headers = [head1, head2, head5, head3, head4];
            $("#the-table").append(headRow);
            for(var i = 0; i < headers.length; i++) {
                headRow.append(headers[i]);
            }
            Object.keys(items).forEach(function(key) {
                addToTable(items[key].name, items[key].position, items[key].email, parseFloat(items[key].salary));
            });
        }
        // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // When "Submit" is clicked, add the item to the table and store in the Firebase DB for later
    $("#submit-btn").click(function() {
        var form = document.getElementById("the-form");
        var name = form.elements[0].value.trim();
        var position = form.elements[1].value.trim();
        var email = form.elements[2].value.trim();
        var salary = form.elements[3].value.trim();
        if(name !== "" && position !== "" && salary !== "" && email !== "") {
            var parsedSal = parseFloat(salary);
            if(!isNaN(parsedSal)) {
                addToTable(name, position, email, parsedSal);
            }
        }
        // Save the new items in Firebase. This will cause our "value" callback above to fire
        database.ref().push({
            name: name,
            position: position,
            email: email,
            salary: parsedSal
        });
    });

    // Helper function that adds a new employee to the table. Called on load and on "submit" button push
    function addToTable(name, position, email, salary) {
        var newRow = $("<tr></tr>");
        $("#the-table").append(newRow);
        var newName = $("<td>" + name + "</td>");
        newRow.append(newName);
        var newPos = $("<td>" + position + "</td>");
        newRow.append(newPos);
        var newEmail = $("<td>" + email + "</td>");
        newRow.append(newEmail);
        var newSal = $("<td>$" + salary + "</td>");
        newRow.append(newSal);
        var terminated = $("<td><button id='terminate-'" + name + ">X</button>");
        newRow.append(terminated);
    }
});