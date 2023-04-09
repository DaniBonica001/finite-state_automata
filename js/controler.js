import * as ca from "./compareArrays.js";
import * as mealy from "./mealyMachine.js";
import * as moore from "./mooreMachine.js";

$(document).ready(function () {
  changeDiv("startPage");

  $("#mealyBtn").click(function () {
    $("#inputStatesMealy").val("");
    $("#inputAlphabetMealy").val("");
    changeDiv("statesMealyMachine");
  });

  $("#mooreBtn").click(function () {
    $("#inputStatesMoore").val("");
    $("#inputAlphabetMoore").val("");
    changeDiv("statesMooreMachine");
  });

  $(".backBtn").click(function () {
    $('#mealyTable').empty()
    $('#mooreTable').empty()
    $('#mealyResultTable').empty()
    $('#mooreResultTable').empty()
    changeDiv("startPage");
  });

  $("#sendBtnMealy").click(function () {
    mealy.createTable(
      "#inputStatesMealy",
      "#inputAlphabetMealy",
      "#mealyTable"
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
                tempTransitions.push(element)
                transitions.push(element);
              });
          }
        });
    });

    console.log(transitions)

    mealy.getInitialMachine(
      $("#inputStatesMealy").val().split(","),
      $("#inputAlphabetMealy").val().split(","),
      tempTransitions
    );

    
    mealy.getConnectedMealy();

    
    var p1 = mealy.initialPartition();
    console.log(p1)
  
    var finalP = getFinalPartition(p1,mealy.machineMealy.stimulus)
    console.log(finalP)

    mealy.getInitialMachine(renameStates(finalP,$("#inputStatesMealy").val().split(",")),mealy.machineMealy.stimulus, reNameTransitions(finalP,transitions))

    mealy.createResponseTable("#mealyResultTable")
    
    changeDiv("resultMealyMachine");
  });

  $("#sendBtnMoore").click(function () {
    moore.createTable(
      "#inputStatesMoore",
      "#inputAlphabetMoore",
      "#mooreTable"
    );

    changeDiv("makeTableMoore");
  });

  $("#sendMooreTableBtn").click(function () {
    var rows = $("#mooreTable").find("tr");
    var transitions = [];
    var tempTransitions = [];

    rows.each(function (index, value) {
      $(value)
        .find("td")
        .each(function (index, value) {
          if (index > 0) {
            tempTransitions.push($(value).find("input").val());
            transitions.push($(value).find("input").val());
          }
        });
    });

    console.log(transitions);
    console.log(tempTransitions);

    moore.getInitialMachine(
      $("#inputStatesMoore").val().split(","),
      $("#inputAlphabetMoore").val().split(","),
      tempTransitions
    );

    console.log(transitions);
    console.log(tempTransitions);

    moore.getConnectedMoore();

    var p1 = moore.initialPartition();
    console.log(p1);

    var finalP = getFinalPartitionMoore(p1, moore.machineMoore.stimulus);
    console.log(finalP);   

    moore.getInitialMachine(renameStates(finalP,$("#inputStatesMoore").val().split(",")), moore.machineMoore.stimulus,reNameTransitions(finalP, transitions))

    moore.createResponseTable("#mooreResultTable")

    changeDiv("resultMooreMachine");
  });

  $("#exitBtn").click(function () {
    $("#inputStatesMealy").val("");
    $("#inputAlphabetMealy").val("");
    $("#inputStatesMoore").val("");
    $("#inputAlphabetMoore").val("");
    $('#mealyTable').empty()
    $('#mooreTable').empty()
    $('#mealyResultTable').empty()
    $('#mooreResultTable').empty()
    changeDiv("startPage");
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

function getFinalPartitionMoore(p1, stimulus) {
  console.log("vuelve");
  console.log(p1);

  var nextPartition = null;

  var keepBlock = [];
  for (let i = 0; i < p1.length; i++) {
    //Gets the block (Array) and a represented value
    const currentBlock = p1[i];
    const representedValueName = p1[i][0];
    const representedValue = moore.machineMoore.statesMachine[currentBlock[0]];

    console.log(currentBlock);
    console.log(representedValueName);
    console.log(representedValue);
    console.log(keepBlock);

    keepBlock.push([representedValueName]);

    console.log(keepBlock);

    //Iterates over the currentBlock
    for (let j = 1; j < currentBlock.length; j++) {
      //Gets the current state and the next state
      const nextStateName = p1[i][j];
      const nextState = moore.machineMoore.statesMachine[currentBlock[j]];

      console.log(nextStateName);
      console.log(nextState);

      let c = 0;

      for (const input in stimulus) {
        const responseCurrent = representedValue.statesResponse[input];
        const responseNext = nextState.statesResponse[input];

        console.log(responseCurrent);
        console.log(responseNext);

        var pCurrent = 0;
        for (let k = 0; k < p1.length; k++) {
          if (p1[k].includes(responseCurrent)) {
            pCurrent = k;
            break;
          }
        }

        var pNext = 0;
        for (let k = 0; k < p1.length; k++) {
          if (p1[k].includes(responseNext)) {
            pNext = k;
            break;
          }
        }

        console.log(pCurrent);
        console.log(pNext);

        if (pCurrent != pNext) {
          if (keepBlock.length > 1) {
            console.log("debo comparar con los otros");
            keepBlock = compareWithKeepBlock(keepBlock,nextState,nextStateName,p1,stimulus)
          }else{
            keepBlock.push([nextStateName]);
          }
          
          console.log(keepBlock);
          break;
        }
        c++;

        if (c == stimulus.length) {
          console.log("entrou");
          keepBlock[findInNewPartition(representedValueName,keepBlock)].push(nextStateName);
          console.log(keepBlock);
        }

        console.log(keepBlock);
      }
    }
    nextPartition = keepBlock;
    console.log(nextPartition);
  }

  console.log(nextPartition);
  console.log("condicion");
  if (ca.compareArrays(p1, nextPartition) == false) {
    console.log("entro compare");
    return getFinalPartition(nextPartition, stimulus);
  }
  return nextPartition;
}


function getFinalPartitionMealy(p1, stimulus) {
  console.log("vuelve");
  console.log(p1);

  var nextPartition = null;

  var keepBlock = [];
  for (let i = 0; i < p1.length; i++) {
    //Gets the block (Array) and a represented value
    const currentBlock = p1[i];
    const representedValueName = p1[i][0];
    const representedValue = mealy.machineMoore.statesMachine[currentBlock[0]];

    console.log(currentBlock);
    console.log(representedValueName);
    console.log(representedValue);
    console.log(keepBlock);

    keepBlock.push([representedValueName]);

    console.log(keepBlock);

    //Iterates over the currentBlock
    for (let j = 1; j < currentBlock.length; j++) {
      //Gets the current state and the next state
      const nextStateName = p1[i][j];
      const nextState = mealy.machineMoore.statesMachine[currentBlock[j]];

      console.log(nextStateName);
      console.log(nextState);

      let c = 0;

      for (const input in stimulus) {
        const responseCurrent = representedValue[input][nextState];        
        const responseNext = nextState[input][nextState];

        console.log(responseCurrent);
        console.log(responseNext);

        var pCurrent = 0;
        for (let k = 0; k < p1.length; k++) {
          if (p1[k].includes(responseCurrent)) {
            pCurrent = k;
            break;
          }
        }

        var pNext = 0;
        for (let k = 0; k < p1.length; k++) {
          if (p1[k].includes(responseNext)) {
            pNext = k;
            break;
          }
        }

        console.log(pCurrent);
        console.log(pNext);

        if (pCurrent != pNext) {
          if (keepBlock.length > 1) {
            console.log("debo comparar con los otros");
            keepBlock = compareWithKeepBlock(keepBlock,nextState,nextStateName,p1,stimulus)
          }else{
            keepBlock.push([nextStateName]);
          }
          
          console.log(keepBlock);
          break;
        }
        c++;

        if (c == stimulus.length) {
          console.log("entrou");
          keepBlock[findInNewPartition(representedValueName,keepBlock)].push(nextStateName);
          console.log(keepBlock);
        }

        console.log(keepBlock);
      }
    }
    nextPartition = keepBlock;
    console.log(nextPartition);
  }

  console.log(nextPartition);
  console.log("condicion");
  if (ca.compareArrays(p1, nextPartition) == false) {
    console.log("entro compare");
    return getFinalPartition(nextPartition, stimulus);
  }
  return nextPartition;
}

function findInNewPartition(representedValueName,keepBlock){
  var index  = 0;
  for(const block in keepBlock){
    console.log(block)
    if(keepBlock[block].includes(representedValueName)){      
      index =  block;
      console.log(representedValueName + "esta en "+index)
      break;
    }
  }
  return index;


}
function compareWithKeepBlock(keepBlock,nextState,nextName,p1,stimulus) {
  let added =  false;
  console.log(keepBlock)
  console.log(nextName)
  console.log(nextName)
  console.log(p1)
  console.log(stimulus)
  for (let i = 1; i <= keepBlock.length && !added; i++) {
    var representedValue = keepBlock[i][0];
    var stateToCompare = nextState;

    console.log(representedValue)
    console.log(stateToCompare)

    let counter = 0

    for (const input in stimulus) {
      var responseRepre = moore.machineMoore.statesMachine[representedValue].statesResponse[input]
      
      var responseNextCompare = stateToCompare.statesResponse[input];

      console.log(responseRepre)
      console.log(responseNextCompare)

      var pCurrent = 0;
        for (let k = 0; k < p1.length; k++) {
          if (p1[k].includes(responseRepre)) {
            pCurrent = k;
            break;
          }
        }

        var pNext = 0;
        for (let k = 0; k < p1.length; k++) {
          if (p1[k].includes(responseNextCompare)) {
            pNext = k;
            break;
          }
        }

        console.log(pCurrent)
        console.log(pNext)

      if(pCurrent!=pNext){
        console.log("cambio de grupito")
        break;
      }else{
        counter++
      }


    }
    if(counter == stimulus.length){
      console.log("coincidencia")
      keepBlock[i].push(nextName)
      added = true
      console.log(keepBlock)
    }
  }
  return keepBlock
}

function reNameTransitions(finalP, transitions) {
  console.log(finalP);
  console.log(transitions);
  

  var indexes = [];

  finalP.forEach((element,index)=>{
    indexes = []
    console.log(element);
    console.log(index);

    if(element.length>1){

      for(let i = 0;i<transitions.length;i++){
        if(element.includes(transitions[i])){
          indexes.push(i)
        }
      }

      var newName = element.join("");
      finalP[index] = [newName];

      for (let i = 0; i < indexes.length; i++) {
        transitions[indexes[i]] = newName;
      }

      console.log(transitions)


    }
  })

  return transitions;
    
}

function renameStates(finalP,states){

  finalP.forEach((element,index)=>{
    console.log(element)
    if(element.length>1){
      console.log("bigger than 1")
      var newName = element.join("");
      for(let i = 0;i<element.length;i++){
        console.log(element[i])
        for(const s in states){
          if(states[s] == element[i]){
            states[s] = newName
            console.log(states)
            break;
          }
        }        
      }
    }
  });
  return states
}
