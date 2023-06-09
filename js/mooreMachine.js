import * as cp from './compareArrays.js';

export var machineMoore = {
  initialState: "A",
  stimulus: [0, 1],
  statesMachine: {
    A: {
      response: 0,
      statesResponse: {
        0: "A",
        1: "B",
      },
    },
  },
};

export function getInitialMachine(states, inputs, transitions) {
  machineMoore = {};
  machineMoore.stimulus = inputs;
  machineMoore.statesMachine = {};
  machineMoore["initialState"] = states[0];
  for (let i = 0; i < states.length; i++) {
    machineMoore["statesMachine"][states[i]] = {
      response: transitions[inputs.length],
      statesResponse: {},
    };
    for (let j = 0; j < inputs.length; j++) {
      machineMoore["statesMachine"][states[i]]["statesResponse"][inputs[j]] =
        transitions.shift();
    }
    transitions.shift();
  }

  console.log(machineMoore);
}

export function createTable(inputStates, inputAlphabet, tableId) {
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

    table.append("<th>Salida</th>");
    $.each(states, (index, value) => {
      $(tableId).append("<tr><td>" + value + "</td></tr>");
      var row = $(tableId).find("tr:eq(" + (index + 1) + ")");
      $.each(alphabet, (index, value) => {
        row.append('<td><input class="form-control"></input></td>');
      });
      row.append('<td><input class="form-control"></input></td>');
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

export function getConnectedMoore() {
  const connectedStates = [];
  const initialState = machineMoore["initialState"];
  const states = Object.keys(machineMoore["statesMachine"]);
  const stimulus = machineMoore["stimulus"];
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
          machineMoore["statesMachine"][currentState]["statesResponse"][st];

        if (!connectedStates.includes(nextState)) {
          connectedStates.push(nextState);
        }

        currentState = nextState;
        i++;
      } while (i < states.length);
    }

    c++;
  }
  
    if(!cp.compareArrays(connectedStates, states)){
        for (let j = 0; j < states.length; j++) {
            if(!(connectedStates.includes(states[j]))){
                delete machineMoore['statesMachine'][states[j]];
            }
        }
    }
    
}

export function initialPartition() {
  const states = Object.keys(machineMoore["statesMachine"]);
  const stimulus = machineMoore["stimulus"];
  const partition = [];

  for (const i in stimulus) {
    const input = stimulus[i];
    partition[i] = [];

    for (const s in states) {
      const state = states[s];
      const response = machineMoore["statesMachine"][state]["response"];

      if (input == response) {
        //how to add an element to an object
        partition[i].push(state);
        //console.log(partition[i]);
      }
    }
  }
  console.log(partition);
  return partition;
}

export function createResponseTable(tableId) {
  var states = Object.keys(machineMoore.statesMachine)
  var alphabet = machineMoore.stimulus;

  $(tableId).append("<tr><th>States</th></tr>");

  var table = $(tableId).find("tr:eq(0)");

  $.each(alphabet, (index, value) => {
    table.append("<th>" + value + "</th>");
  });

  table.append("<th>Salida</th>");
  $.each(states, (index, state) => {
    
    $(tableId).append("<tr><td>" + state + "</td></tr>");
    var row = $(tableId).find("tr:eq(" + (index + 1) + ")");

    $.each(alphabet, (index, value) => {
      var response = machineMoore.statesMachine[state].statesResponse[value];
      row.append("<td>" + response + "</td>");
    });

    row.append("<td>" + machineMoore.statesMachine[state].response + "</td>");
  });
}
