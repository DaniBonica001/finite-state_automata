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

export var machineMealy = {
    initialState: 'A',
    stimulus: [0, 1],
    statesMachine: {
        'A': {
            0: {
                nextState: 'B',
                response: 1
                
            }
        }
    }
};


export function getInitialMachine(states, inputs,transitions){
    let machine = machineMealy;
    machine.stimulus = inputs;
    machine.statesMachine = {};
    machine.initialState = states[0];
    for(let i = 0; i < states.length; i++){
        machine['statesMachine'][states[i]] = {}; //A:{}
        for(let j = 0; j <inputs.length; j++){
            machine['statesMachine'][states[i]][inputs[j]] =   {
                nextState: transitions.shift(),
                response: transitions.shift()
                
            }
        }
    }
    return machine;
}

export function getConnectedMealy()  {
    const connectedStates = [];
    const initialState = machineMealy['initialState'];
    const states = Object.keys(machineMealy['statesMachine']);
    const stimulus = machineMealy['stimulus'];

    connectedStates.push(initialState);
    let c = 0;

    while (c < connectedStates.length) {
        const connected = connectedStates[c];
        for (const s in stimulus) {
            const st = stimulus[s];
            let currentState = connected;
            let i = 0;
            do {
                const nextState = machineMealy['statesMachine'][currentState][st]['nextState'];
                if (!connectedStates.includes(nextState)) {
                    connectedStates.push(nextState);
                }
                currentState = nextState;
                i++;
            } while (i < states.length);
        }
        c++;
    }
    /*
    if (!cp.compareArrays(connectedStates, states)) {
        for (let j = 0; j < states.length; j++) {
            if (!(connectedStates.includes(states[j]))) {

                delete machineMealy['statesMachine'][states[j]];
            }
        }
    }
    */


}
