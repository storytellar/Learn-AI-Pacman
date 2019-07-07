const electron = require('electron');
const { ipcRenderer } = electron;
const ul = document.querySelector('ul');


// 1 = wall
// 2 = blank space
// 3 = coin
// 5 = pacman
// 7 = ghost 1
// 8 = ghost 2
var map = require('./maps/map.json');

ipcRenderer.on('map:new', function (e, path) {
    console.log(path[0]);
    map = require(path[0]);
    main();
});

main();


function main(){


// Object Pacman
var pacman = {
    // default position (will be updated with init(map) fucntion )
    x: -1,
    y: -1,
    parent: null,
    g: 0,
    f: 0,

    score: 0,
    stomach: 0,
    amountOfCoinInMap: 0,

    locationOfcoins: [],

    init: function (map) {
        getPosition:
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const element = map[i][j];
                if (element === 5) {
                    this.y = i;
                    this.x = j;
                    break getPosition;
                }
            }
        }

        getAmountOfCoinInMap:
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const element = map[i][j];
                if (element === 3) {
                    this.amountOfCoinInMap++;
                }
            }
        }

        getLocationOfCoins:
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const element = map[i][j];
                if (element === 3) {
                    this.locationOfcoins.push({ x: j, y: i });
                }
            }
        }

    },
    Move: function (Arrow) {
        var nextPositionValue;
        switch (Arrow) {
            case "ArrowLeft":
                nextPositionValue = map[pacman.y][pacman.x - 1];
                if (nextPositionValue === 1) return;
                map[pacman.y][pacman.x] = 2;
                pacman.x = pacman.x - 1;
                map[pacman.y][pacman.x] = 5;
                //drawWorld();
                break;
            case "ArrowUp":
                nextPositionValue = map[pacman.y - 1][pacman.x];
                if (nextPositionValue === 1) return;
                map[pacman.y][pacman.x] = 2;
                pacman.y = pacman.y - 1;
                map[pacman.y][pacman.x] = 5;
                //drawWorld();
                break;
            case "ArrowRight":
                nextPositionValue = map[pacman.y][pacman.x + 1];
                if (nextPositionValue === 1) return;
                map[pacman.y][pacman.x] = 2;
                pacman.x = pacman.x + 1;
                map[pacman.y][pacman.x] = 5;
                //drawWorld();
                break;
            case "ArrowDown":
                nextPositionValue = map[pacman.y + 1][pacman.x];
                if (nextPositionValue === 1) return;
                map[pacman.y][pacman.x] = 2;
                pacman.y = pacman.y + 1;
                map[pacman.y][pacman.x] = 5;
                //drawWorld();
                break;
            default:
                break;
        }

        switch (nextPositionValue) {
            case 2: // Blank Space => decrease score
                pacman.EatNothing();
                break;
            case 3: // Coin
                pacman.EatCoin();
                break;
            case 7: // Ghost
                // code...
                console.log('hù! ma nè');
                break;
            case 8: // Ghost
                // code...
                break;
            default:
                break;
        }
        drawWorld();
    },

    EatCoin: function () {
        this.score += 20;
        this.stomach += 1;
        if (this.stomach === this.amountOfCoinInMap) {
            console.log('Kết thúc game');
        }
    },

    EatNothing: function () {
        this.score -= 1;
    },

};

function drawWorld() {
    const World = document.getElementById('world');
    World.innerHTML = "";
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const element = map[i][j];
            switch (element) {
                case 1:
                    World.innerHTML += '<div class="wall"></div>';
                    break;
                case 2:
                    World.innerHTML += '<div class="blankspace"></div>';
                    break;
                case 3:
                    World.innerHTML += '<div class="coin"></div>';
                    break;
                case 5:
                    World.innerHTML += '<div class="pacman"></div>';
                    break;
                case 7:
                    World.innerHTML += '<div class="ghost1"></div>';
                    break;
                case 8:
                    World.innerHTML += '<div class="ghost2"></div>';
                    break;
                default:
                    break;
            }
        }
        World.innerHTML += '<br>';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GetDistance(node1, node2) {
    return Math.sqrt(Math.pow((node1.x - node2.x), 2) + Math.pow((node1.y - node2.y), 2));;
}

function GetManhattan(node1, node2) {
    return Math.abs(node2.x - node1.x) + Math.abs(node2.y - node1.y);
}

function isInArray(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].x === obj.x && arr[i].y === obj.y) {
            return true;
        }
    }
    return false;
}

// Show Node In Map With New Value and draw it
// Input: Array of Node
function ShowNodeInMap(nodes, map) {
    for (let i = 0; i < nodes.length; i++) {
        node = nodes[i];
        for (let y = 1; y < map.length - 1; y++) {
            for (let x = 1; x < map[y].length - 1; x++) {
                if (y == node.y && x == node.x) {
                    // new value
                    map[y][x] = 8;
                }
            }
        }
    }
    drawWorld();
}

// Get directions where pacman can reach
function GetChilds(node, map) {
    var res = [];
    if (map[node.y][node.x + 1] !== 1 && map[node.y][node.x + 1] !== 7) {
        res.push({ x: node.x + 1, y: node.y });
    }
    if (map[node.y][node.x - 1] !== 1 && map[node.y][node.x - 1] !== 7) {
        res.push({ x: node.x - 1, y: node.y });
    }
    if (map[node.y + 1][node.x] !== 1 && map[node.y + 1][node.x] !== 7) {
        res.push({ x: node.x, y: node.y + 1 });
    }
    if (map[node.y - 1][node.x] !== 1 && map[node.y - 1][node.x] !== 7) {
        res.push({ x: node.x, y: node.y - 1 });
    }
    return res;
}

// Search for the path with a* algorithm
function astar(source, dest, map) {
    var openList = [];
    var closedList = [];

    openList.push(source);
    while (openList.length > 0) {
        // Find the direction with the lowest f in open list
        var lowInd = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowInd].f) {
                lowInd = i;
            }
        }
        // this direction will be our current node.
        var currentNode = openList[lowInd];

        //#region If current node is destination
        if (((currentNode.x === dest.x) && (currentNode.y === dest.y))) {
            var cur = currentNode;
            var result = [];
            result.push(cur);
            while (cur.parent) {
                result.push(cur.parent);
                cur = cur.parent;
            }
            return result.reverse();
        }
        //#endregion

        // Remove current node from open list
        openList = openList.filter(temp => !(temp.x === currentNode.x && temp.y === currentNode.y));
        // Then add it to closed list
        closedList.push(currentNode);

        // Get directions where pacman can reach
        var childs = GetChilds(currentNode, map);

        // For each direction
        for (let i = 0; i < childs.length; i++) {
            var child = childs[i];
            child.parent = currentNode;
            child.g = GetDistance(child, currentNode) + currentNode.g;
            child.h = GetManhattan(child, dest);
            child.f = child.g + child.h;

            // If direction has already been reach before, skip this direction.
            if (isInArray(closedList, child)) {
                continue;
            }

            // If this is the first time we've reached this direction, add it to our open list.
            if (!isInArray(openList, child)) {
                openList.push(child);
            }
            // if it's already been added to our open list, check if previously it had worst f.
            else {
                for (let j = 0; j < openList.length; j++) {
                    if (child.x === openList[j].x && child.y === openList[j].y) {
                        if (child.f < openList[j].f) {
                            openList[j].f = child.f;
                            openList.parent = child.parent;
                        }
                    }
                }
            }
        }
    }
    return [];
}

// Pacman goes for the coin.
async function Go(start, dest, map) {
    var fastestPath = astar(start, dest, map);

    var prev = start;
    for (let i = 0; i < fastestPath.length; i++) {
        await sleep(500);
        map[prev.y][prev.x] = 2;
        map[fastestPath[i].y][fastestPath[i].x] = 5;
        prev = fastestPath[i];
        drawWorld();
    }
}

pacman.init(map);

drawWorld();

Go(pacman, pacman.locationOfcoins[0], map);
}

