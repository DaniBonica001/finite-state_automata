import * as cp from './compareArrays.js';

export var machineMealy = {
  initialState: "A",
  stimulus: [0, 1],
  statesMachine: {
    A: {
      0: {
        nextState: "B",
        response: 1,
      },
    },
  },
};

export function getInitialMachine(states, inputs, transitions) {
  let machine = machineMealy;
  machine.stimulus = inputs;
  machine.statesMachine = {};
  machine.initialState = states[0];
  for (let i = 0; i < states.length; i++) {
    machine["statesMachine"][states[i]] = {}; //A:{}
    for (let j = 0; j < inputs.length; j++) {
      machine["statesMachine"][states[i]][inputs[j]] = {
        nextState: transitions.shift(),
        response: transitions.shift(),
      };
    }
  }
  console.log(machine);
}
export function createTable(inputStates, inputAlphabet, tableId, nextDiv) {
  var states = $(inputStates).val();
  var alphabet = $(inputAlphabet).val();

  if (validateInput(states, alphabet)) {
    states = states.split(",");
    alphabet = alphabet.split(",");

    $(tableId).append("<tr><th>States</th></tr>");

    var table = $(tableId).find("tr:eq(0)");

    $.each(alphabet, (index, value) => {
      table.append("<th>" + value + "</th>");
    });

    $.each(states, (index, value) => {
      $(tableId).append("<tr><td>" + value + "</td></tr>");
      var row = $(tableId).find("tr:eq(" + (index + 1) + ")");
      $.each(alphabet, (index, value) => {
        row.append('<td><input class="form-control"></input></td>');
      });
    });
  }
}

export function validateInput(states, alphabet) {
  if (states == "" || alphabet == "") {
    alert("No puede dejar campos vacios");
    return false;
  }
  return true;
}

export function getConnectedMealy() {
  const connectedStates = [];
  const initialState = machineMealy["initialState"];
  const states = Object.keys(machineMealy["statesMachine"]);
  const stimulus = machineMealy["stimulus"];

  connectedStates.push(initialState);
  let c = 0;

  while (c < connectedStates.length) {
    const connected = connectedStates[c];
    for (const s in stimulus) {
      const st = stimulus[s];
      let currentState = connected;
      let i = 0;
      do {
        const nextState =
          machineMealy["statesMachine"][currentState][st]["nextState"];
        if (!connectedStates.includes(nextState)) {
          connectedStates.push(nextState);
        }
        currentState = nextState;
        i++;
      } while (i < states.length);
    }
    c++;
  }
  
    if (!cp.compareArrays(connectedStates, states)) {
        for (let j = 0; j < states.length; j++) {
            if (!(connectedStates.includes(states[j]))) {

                delete machineMealy['statesMachine'][states[j]];
            }
        }
    }
    
}
//let combinations = []

export function combinationStimulus(stimulus) {
  const states = Object.keys(machineMealy["statesMachine"]);
  let result = [];

  for (let s in states) {
    let state = states[s];

    let output = "";
    for (let i in stimulus) {
      let input = stimulus[i];
      output += machineMealy["statesMachine"][state][input]["response"];
    }
    console.log(output);
    result.push(output);
    console.log(result);
  }
  console.log(result);
  result = deleteDuplicated(result);
  console.log(result);
  return result;
}

export function deleteDuplicated(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export function initialPartition() {
  const states = Object.keys(machineMealy["statesMachine"]);
  const stimulus = machineMealy["stimulus"];
  const combinations = combinationStimulus(stimulus);
  const partition = [];

  for (let j = 0; j < combinations.length; j++) {
    partition[j] = [];
  }
  console.log(partition);

  for (const s in states) {
    let state = states[s];
    let output = "";

    for (const i in stimulus) {
      let input = stimulus[i];
      output += machineMealy["statesMachine"][state][input]["response"];
    }
    console.log(output);

    if (combinations.includes(output)) {
      console.log(combinations.indexOf(output));
      partition[combinations.indexOf(output)].push(state);
    }
    console.log(partition);
  }
  console.log(partition);
  return partition;
}

export function createResponseTable(tableId) {
  var states = Object.keys(machineMealy.statesMachine);
  var alphabet = machineMealy.stimulus;

  $(tableId).append("<tr><th>States</th></tr>");

  var table = $(tableId).find("tr:eq(0)");

  $.each(alphabet, (index, value) => {
    table.append("<th>" + value + "</th>");
  });

  $.each(states, (index, state) => {

    $(tableId).append("<tr><td>" + state + "</td></tr>");
    var row = $(tableId).find("tr:eq(" + (index + 1) + ")");

    $.each(alphabet, (index, value) => {
        var response = machineMealy.statesMachine[state][value].nextState;
      row.append("<td>"+ response +"</td>");
    });
  });
}
