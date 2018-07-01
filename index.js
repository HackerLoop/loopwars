let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

PIXI.utils.sayHello(type)

let app = new PIXI.Application({width: 800, height: 600});
app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);

const GRASS = 0;

PIXI.loader
    .add("grass.png")
    .add("tank.png")
    .load(setup);

let tank, tank2, state, stateText, actionsText;

function setupState() {
    state = {
        turn: 0,
        players: [
            {"name": "P1", "health": 10, pos: [0,0]},
            {"name": "P2", "health": 10, pos: [15, 13]}
        ],
        actions: [
            [],
            []
        ],
        map: []
    };

    for(var i = 0; i < 16; i++) {
        state.map.push([]);
        for(var j = 0; j < 14; j++) {
            state.map[i].push(GRASS);
        }
    }

}

function playerVote(player, action) {
    console.log(player)
    console.log(action)
    console.log(state.actions[player])

    state.actions[player][action].f();

    computePossibleActions(0);
    computePossibleActions(1);

    state.turn++;
}

function canMove(player, direction) {
    let p = state.players[player];
    let x = p.pos[0];
    let y = p.pos[1];

    if (x < 15 && direction == "right") {
        return true;
    }

    if (x > 0 && direction == "left") {
        return true;
    }

    if (y > 0 && direction == "up") {
        return true;
    }

    if (y < 13 && direction == "down") {
        return true;
    }

    return false;
}

function computePossibleActions(player) {
    state.actions[player] = [];
    let x = state.players[player].pos[0];
    let y = state.players[player].pos[1];

    if (canMove(player, "up")) {
        let f = function() {
            state.players[player].pos[1]--
        };
        state.actions[player].push({"text": "Up", f});
    }
    if (canMove(player, "down")) {
        let f = function() {
            state.players[player].pos[1]++
        };
        state.actions[player].push({"text": "Down", f});
    }
    if (canMove(player, "left")) {
        let f = function() {
            state.players[player].pos[0]--
        };
        state.actions[player].push({"text": "Left", f});
    }
    if (canMove(player, "right")) {
        let f = function() {
            state.players[player].pos[0]++
        };
        state.actions[player].push({"text": "Right", f});
    }
}

function renderPlayers() {
    tank.x = state.players[0].pos[0] * 64;
    tank.y = state.players[0].pos[1] * 64;

    tank2.x = state.players[1].pos[0] * 64;
    tank2.y = state.players[1].pos[1] * 64;
}

function renderStateText() {
    stateText.text = "Turn " + state.turn;
}

function renderActionsText() {
    let currentPlayer = state.turn % state.players.length
    let x = state.players[currentPlayer].pos[0];
    let y = state.players[currentPlayer].pos[1];
    actionsText.text = "Player " + currentPlayer + "(x:" + x + "y:" + y + ")";
    actionsText.text += "\n"

    let letters = ["A", "B", "C", "D"];

    for(var i=0; i<state.actions[currentPlayer].length; i++) {
        let a = state.actions[currentPlayer][i];
        actionsText.text += letters[i] + ":" + a.text +"\n"
    }

}

function setup() {
    setupState();

    for(var i = 0; i < 16; i++) {
        for(var j = 0; j < 14; j++) {
            if (state.map[i][j] == GRASS) {
                let grass = new PIXI.Sprite(
                    PIXI.loader.resources["grass.png"].texture
                );

                grass.width = 64;
                grass.height = 64;
                grass.x = i * 64;
                grass.y = j * 64;

                app.stage.addChild(grass);
            }
        }
    }

    tank = new PIXI.Sprite(
        PIXI.loader.resources["tank.png"].texture

    );

    tank.width = 64;
    tank.height = 64;
    tank.x = 0;
    tank.y = 0;

    app.stage.addChild(tank);

    tank2 = new PIXI.Sprite(
        PIXI.loader.resources["tank.png"].texture
    );

    tank2.width = 64;
    tank2.height = 64;
    tank2.x = 15*64;
    tank2.y = 13*64;

    app.stage.addChild(tank2);

    // let style = new TextStyle({
    //     fontFamily: "Arial",
    //     fontSize: 36,
    //     fill: "white",
    //     stroke: '#ff3300',
    //     strokeThickness: 4,
    //     dropShadow: true,
    //     dropShadowColor: "#000000",
    //     dropShadowBlur: 4,
    //     dropShadowAngle: Math.PI / 6,
    //     dropShadowDistance: 6,
    // });

    stateText = new PIXI.Text('Turn: 0',{fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});

    stateText.x = 15*64 + 100
    stateText.y = 0

    app.stage.addChild(stateText);;

    actionsText = new PIXI.Text("Actions\n",{fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});

    actionsText.x = 15*64 + 100
    actionsText.y = 64;

    app.stage.addChild(actionsText);

    let keyObject = keyboard(65);
    keyObject.press = () => {
        console.log(0)
        let currentPlayer = state.turn % state.players.length;
        playerVote(currentPlayer, 0);
    };

    keyObject = keyboard(66);
    keyObject.press = () => {
        let currentPlayer = state.turn % state.players.length;
        playerVote(currentPlayer, 1);
    };

    keyObject = keyboard(67);
    keyObject.press = () => {
        let currentPlayer = state.turn % state.players.length;
        playerVote(currentPlayer, 2);
    };

    keyObject = keyboard(68);
    keyObject.press = () => {
        let currentPlayer = state.turn % state.players.length;
        playerVote(currentPlayer, 3);
    };

    computePossibleActions(0);
    computePossibleActions(1);

    //Start the game loop
    app.ticker.add(function(delta) { gameLoop(delta) });
}

function gameLoop(delta){
    renderPlayers()
    renderStateText();
    renderActionsText();
}

function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = event => {
        console.log(event.keyCode)
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );

    return key;
}
