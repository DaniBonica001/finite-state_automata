import * as cm from "./relatedAutomata.js";
import * as mealy from "./mealyMachine.js";
import * as moore from "./mooreMachine.js";

$(document).ready(function () {
  changeDiv("startPage");

  $("#mealyBtn").click(function () {
    changeDiv("statesMealyMachine");
  });

  $("#mooreBtn").click(function () {
    changeDiv("statesMooreMachine");
  });

  $(".backBtn").click(function () {
    changeDiv("startPage");
  });

  $("#sendBtnMealy").click(function () {
    mealy.createTable(
      "#inputStatesMealy",
      "#inputAlphabetMealy",
      "#mealyTable",
      "makeTableMealy"
    );
    changeDiv("makeTableMealy");
  });

  $("#sendMealyTableBtn").click(function () {
    var rows = $("#mealyTable").find("tr");
    var transitions = [];

    rows.each(function (index, value) {
      $(value)
        .find("td")
        .each(function (index, value) {
          if (index > 0) {
            $(value)
              .find("input")
              .val()
              .split(",")
              .forEach((element) => {
                transitions.push(element);
              });
          }
        });
    });

    mealy.getInitialMachine(
      $("#inputStatesMealy").val().split(","),
      $("#inputAlphabetMealy").val().split(","),
      transitions
    );
    mealy.getConnectedMealy();
  });

  $("#sendBtnMoore").click(function () {
    moore.createTable(
      "#inputStatesMoore",
      "#inputAlphabetMoore",
      "#mooreTable",
      "makeTableMoore"
    );

    changeDiv("makeTableMoore");
  });

  $("#sendMooreTableBtn").click(function () {
    var rows = $("#mooreTable").find("tr");
    var transitions = [];

    rows.each(function (index, value) {
      $(value)
        .find("td")
        .each(function (index, value) {
          if (index > 0) {
            transitions.push($(value).find("input").val());
          }
        });
    });
    console.log(transitions);

    moore.getInitialMachine(
      $("#inputStatesMoore").val().split(","),
      $("#inputAlphabetMoore").val().split(","),
      transitions
    );
    moore.getConnectedMoore();
  });
});

function changeDiv(target) {
  $(".page").hide();
  $(".page").each(function () {
    if ($(this).attr("id") == target) {
      $(this).show();
    }
  });
}
