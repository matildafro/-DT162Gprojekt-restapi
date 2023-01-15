"use strict";

var baseURL = "http://localhost:3000/inserts/";

//
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => { 
//
// Read and publish all users 
    let url = baseURL;
    fetch(url, {method: 'GET'})
        .then(response => response.text())
            .then(data => {
                var jsonData = JSON.parse( data );
                var s = "<table><th>Kursnamn</th><th>Universitet</th><th>Inriktning</th><th>Poäng</th>";
                for(var i=0; i < jsonData.length; i++){
                    s += "<tr><td contenteditable>"+jsonData[i].name+"</td><td contenteditable>"+jsonData[i].uni +"</td><td contenteditable>"+jsonData[i].orient +
                        "</td><td contenteditable>"+jsonData[i].points +"</td><td><img src='images/papperskorg.png' alt='Radera kurs' id=" + jsonData[i]._id + " /></td></tr>";    
                }
                s += "</table>";
                document.getElementById("result").innerHTML = s;
             })
        .catch(error => {
            alert('There was an error '+error);
        });

//
// Create event handler for delete user
document.getElementById("result").addEventListener("click", (e) => {
    let url=baseURL+e.target.id;
    fetch(url, {method: 'DELETE'})
        .then(response => response.text())
            .then(data => {
                location.reload();
             })
        .catch(error => {
            alert('There was an error '+error);
        });
});

//
// Create event handler for add user
document.getElementById("addbutton").addEventListener("click", (e) => {
    var obj = {};
    obj.name = document.getElementById("name").value;
    obj.uni = document.getElementById("uni").value;
    obj.orient = document.getElementById("orient").value;
    obj.points = document.getElementById("points").value;

    fetch(url, {method: 'POST', 
                    body: JSON.stringify(obj), 	
                        headers: { 'Content-type': 'application/json; charset=UTF-8'} })
        .then(response => response.text())
            .then(data => {
                location.reload();
             })
        .catch(error => {
            alert('There was an error '+error);
        });
});


}); // End of DOM content loaded 
