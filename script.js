a = "abcdefghijklmnopqrstuvwxyz";
//Generate names of all nodes, and their connections.
//Generate the grid we will present them within.
//Then use the algorithm to find what's hopefully the distance between two random ones.
//Oh right, how do we tell which ones have a connection and which ones don't?
//If it's in the top row there is no top connection.
//We can split it into 4 rows of 5
//So that cna be derived with math then, whather it has an up down left or right connection
//May want to work on that first.
var amtOfNodes = 20;
var nodeArray = [];
var lenLine = 5;
var connections = [];
var positionOfNode = [0, 0];
var connectionObjects = [];
var nodeMapMaster = document.getElementById("nodemapMaster");

//Generate node object Array
for (let index = 0; index < amtOfNodes; index++) {

    if (positionOfNode[0] > 8) {
        // console.log("reset x");
        positionOfNode[1] = positionOfNode[1] + 2;
        positionOfNode[0] = 0;
    };

    const nodeAsObject = {
        alpha: a[index],
        name: a[index] + "node",
        connectionsArr: [],
        position: [positionOfNode[0], positionOfNode[1]]
    };

    nodeArray.push(nodeAsObject);
    console.log(positionOfNode);
    positionOfNode[0] = positionOfNode[0] + 2;

}
//Generating all the connections for all the nodes doesn't help me know where they should be
//and it duplicates them a ton.
//Centralize connections, make them objects with a name (nodeA+nodeB) a length, and where it should be on the grid (x,y)
//This was dumb
//NOT DUMB, CAN FIGURE CONNECTIONS AND WHERE THEY SHOULD BE FROM THIS!
//HUZZAH!
//But have to sort the nodes, then check if they're within our known nodes list.
//Then we'll take that and turn it into an idea for node length n such.
//may want nodes to know their connections, just cause?
//So an array of objects named for their connections, with each sorted alphabetically.?
//Then we can easily query that.
//generate node connections
//down 1 = + 5
//left 1 = + 1
//right 1 = - 1
//up 1 = -5
for (let index = 0; index < nodeArray.length; index++) {
    const realIndex = index + 1;
    var element = nodeArray[index];
    var alphabetizedConnection = "";
    var alpha = element.alpha
    var elePosition = element.position
    var connectionObj;

    if (realIndex <= lenLine) {
        // console.log(realIndex)
        // console.log("no top")
    } else {
        addToConnectionsAndMakeConnectionsObject(index - 5, [elePosition[0], elePosition[1] - 1])
    }

    if (realIndex > amtOfNodes - lenLine) {
        // console.log(realIndex)
        // console.log("No bottom")
    } else {
        addToConnectionsAndMakeConnectionsObject(index + 5, [elePosition[0], elePosition[1] + 1])
    }

    if (realIndex % 5 === 0) {
        // console.log(realIndex)
        // console.log("No right")
    } else {
        addToConnectionsAndMakeConnectionsObject(index + 1, [elePosition[0] + 1, elePosition[1]])
    }

    if (realIndex % 5 === 1) {
        // console.log(realIndex)
        // console.log("No left")
    } else {
        addToConnectionsAndMakeConnectionsObject(index - 1, [elePosition[0] - 1, elePosition[1]])
    }

}

function addToConnectionsAndMakeConnectionsObject(indexNum, position1) {
    alphabetizedConnection = (alpha + nodeArray[indexNum].alpha).split('').sort().join('');
    element.connectionsArr.push(alphabetizedConnection);
    var randConnectionLength = Math.floor(Math.random() * 1000)
    if (!connections.includes(alphabetizedConnection)) {
        connections.push(alphabetizedConnection);
        connectionObj = {
            connection: alphabetizedConnection,
            length: randConnectionLength,
            position: position1 //do something here
        }
        connectionObjects.push(connectionObj)
    }
}

//20 nodes
//31 connections
//51 total

//12 empty
//63 total
//seven rows of nine?

//So need to figure a way to generate 7 row of 3, get their coords right, then repeat twice more.
//That makes sense.
//Except need to start with a div row
//so start with row
//then do a for loop 3 times
//each loop, shares knowledge of what coord it's on.
//within the loop we loop 3 times too.
//can, uh, expand this to a grid generator...
//That'd be dumb as shit, but it'd be neat too.
//Let's pin that and get back to it.

//Functioning. Has a lot of hard coded stuff though.
function generateGrid() {
    var masterRow = document.createElement("div");
    masterRow.setAttribute("class", "row masterRow");
    const height = 7;
    const width = 9;
    var curRow = 0;
    var curColumn = 0;
    var rowSteps = 3;
    //To seperate the 12 into 3 chunks
    for (let i = 0; i < 3; i++) {
        var mainColumn = document.createElement("div");
        mainColumn.setAttribute("class", "col-4 mainColumn");
        //To add 7 rows

        for (let j = 0; j < 7; j++) {
            //start from a certain step based on what mainColumn we are in.
            curRow = i * rowSteps
            var subRow = document.createElement("div");
            subRow.setAttribute("class", "row subRow");
            //To add 3 columns to the 3 columns, to eventually get 9
            for (let k = 0; k < 3; k++) {
                var subColumn = document.createElement("div");
                subColumn.setAttribute("class", "col-4 subColumn");
                //uh, so coords don't work, need to name it something specific.
                //like that defines it as a connection or a node.

                //need to test connections and nodes for the coord, and insert them.
                //lets write a function, cause otherwise this is going to get insanely messy.
                var value = testNodesAndConnectionsForCoordAndReturnRightValue([curRow, curColumn])
                if (value) {
                    subColumn.textContent = value[0]
                    subColumn.setAttribute("id", value[1]);
                } else {
                    // subColumn.textContent = curRow + " " + curColumn
                }
                subRow.appendChild(subColumn)
                curRow++
            }
            mainColumn.appendChild(subRow)
            curColumn++;
        }
        masterRow.appendChild(mainColumn)
        curColumn = 0;
    }
    nodeMapMaster.appendChild(masterRow);
}


//I don't like this, and could literally make it shorter in like, a moment or two.
//But let's focus on djikstra's actual algorithm now.
function testNodesAndConnectionsForCoordAndReturnRightValue(coords) {
    for (let index = 0; index < connectionObjects.length; index++) {
        const element = connectionObjects[index];
        if ((element.position[0] === coords[0]) && (element.position[1] === coords[1])) {
            return [element.length, element.connection]
        }
    }
    for (let index = 0; index < nodeArray.length; index++) {
        const element = nodeArray[index];
        if ((element.position[0] === coords[0]) && (element.position[1] === coords[1])) {
            return [element.alpha, element.name]
        }
    }
}


//takes in two letters, the start node and the end node.
function djikstraIsCool(start, end) {
    //There's a smart way to do this, which is by making a stem and leaf graph
    //and be able to get objects by some dynamic name.
    //I'm not going to, and it wouldn't even work, so let's try a terrible method instead!
    var visitedNodes = []
    var curNode = start;
    console.log(curNode)
    var totalLength = 0;
    visitedNodes.push(curNode)
    while (curNode != end) {
        var curNodeSelector = document.getElementById(curNode + "node")
        curNodeSelector.setAttribute("style", "color: red;")
        //start it with some generic value, bad idea probably.
        var lowestLenNodeAndNext = [{ length: 10001 }, 0];
        var connected = [];
        for (let index = 0; index < connectionObjects.length; index++) {
            //Dumb idea.
            //so, have to figure out which nodes are NOT already visited
            //So turn the connection into an array, find index where the curnode exists
            //and then check the other one, just through an if/else,
            //and only consider it if it is not an already visitedNode
            var singleConnection = connectionObjects[index]
            var connectedAsArray = singleConnection.connection.split("")
            var whereCurNodeIs = connectedAsArray.indexOf(curNode);
            if (whereCurNodeIs === 1) {
                if (!visitedNodes.includes(connectedAsArray[0])) {
                    if (singleConnection.length < lowestLenNodeAndNext[0].length) {
                        lowestLenNodeAndNext = [singleConnection, connectedAsArray[0]]
                    }
                    // connected.push(singleConnection);
                }
            } else if (whereCurNodeIs === 0) {
                if (!visitedNodes.includes(connectedAsArray[1])) {
                    if (singleConnection.length < lowestLenNodeAndNext[0].length) {
                        lowestLenNodeAndNext = [singleConnection, connectedAsArray[1]]
                    }
                }
            }
        }
        if (lowestLenNodeAndNext[1] === 0) {
            curNode = end
            console.log("Looped into myself, whoops")
            break
        } else {
            curNode = lowestLenNodeAndNext[1];
            visitedNodes.push(curNode)
        }

        var curNodeSelector = document.getElementById(lowestLenNodeAndNext[0].connection)
        curNodeSelector.setAttribute("style", "color: red;")

        console.log(curNode)
        totalLength += lowestLenNodeAndNext[0].length
        var curNodeSelector = document.getElementById(curNode + "node")
        curNodeSelector.setAttribute("style", "color: red;")
    }
    console.log(totalLength)
}
generateGrid()

djikstraIsCool("a", "t")
//No, we need something smarter lol. Can't just simply iterate, can for nodes, but not for node connections.

//if nodeIndex <= lenLine
//if nodeIndex >= lenLine
console.log(nodeArray)
console.log(connections)
console.log(connectionObjects)
