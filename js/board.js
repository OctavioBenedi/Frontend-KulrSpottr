 //<![CDATA[

/*
 *  GAMEBOARD
 *
 *  Version 1.0
 *  Author:
 *              - Octavio Benedi Sanchez
 */

// Define spacename

window.GAMEBOARD = (function(){
    // Private vars and functions
    var boardLocation;
    var GameLevel = 1;
    var Board = {
        rows : 2,
        cols : 2
    };

    var distinctCell = 0;

    var cellColor;
    var distinctCellColor;

    // Setter for Board
    function fillBoard(rows, cols){
        Board.rows = rows;
        Board.cols = cols;
    }

    var _hallOfFame = []

    // Create table on DOM following Board configuration
    function createTable() {
        table = document.createElement('table');
        var it = 0;
        for (var i = 0; i < Board.rows; ++i) {
            var row = document.createElement('tr');
            for (var j = 0; j < Board.cols; ++j) {
                var cell = document.createElement('td');
                cell.setAttribute('cellid', it);
                if((it) != distinctCell)
                {
                    cell.style.backgroundColor = cellColor;
                }
                else
                {
                    cell.style.backgroundColor = distinctCellColor;
                }
                
                cell.onclick = function(){
                    validate(this.getAttribute("cellid") );
                };
                row.appendChild(cell);
                it++;
            }
            table.appendChild(row);
        }
        return table;
    }

    // Insert createTable nodes on boardLocation
    // This avoid any kind of flicking on web page.
    function drawBoard()
    {
        if((el = document.getElementById(boardLocation)) != null) 
        {
            el.innerHTML ="";
            el.appendChild(createTable());
        }
        else
        {
            console.log("Error: "+boardLocation+" not found on document!");
        }        
    }

    function printHallOfFame(){
        console.log(_hallOfFame);
        var hallOfFameDOM = document.createElement('ul');
        if (_hallOfFame.length > 0){
            // Iterate and insert where needed
            for (var i = 0; i < _hallOfFame.length; i++) {
                // Create the list for player:
                var player = document.createElement('li');
                // Set player info:
                player.appendChild(document.createTextNode((i+1)+".- Level "+_hallOfFame[i][1]+" "+_hallOfFame[i][0]));

                // Add it to the hallOfFame:
                hallOfFameDOM.appendChild(player);
            }
            document.getElementById('hallOfFame').innerHTML="";
            document.getElementById('hallOfFame').appendChild(hallOfFameDOM);
        }
    }

    // Just return a random number between 0 and (cell numbers -1).
    function getRandomInt() {
        return Math.floor(Math.random() * (Board.rows * Board.cols ));
    }

    // Check if clicked cell has different color
    function validate(cellid){
        if (cellid == distinctCell) 
        {
            console.log("Success!!!");

            // Increase level
            GameLevel++;
            
            // Increase board size
            fillBoard(Board.rows+1, Board.cols+1);
            
            // Init new level
            initGame();

        }
        else{
            // Show modal asking user for name 
            console.log("Error");
            document.getElementById("maxLevel").innerHTML = GameLevel;
            // Last name is not erased to allow quick submit of name to user.
            // If this behavior is not desired, just clean input value
            toggleModal();
        }
    }

    // Update html for a new game based on GameLevel
    function initGame(){
            // Clean div
            document.getElementById("level").innerHTML = GameLevel;
            distinctCell = getRandomInt();
            cellColor = Color.random("red", "blue");
            var hslcolor = cellColor.hslData();
            // Decrease or increase lightness
            // This try to avoid darken darkest colors and lighten light colors
            // So dificult of the game keeps stable
            if (hslcolor[1]>0.5)
            {
                hslcolor[1] = hslcolor[1]*0.6;
            }
            else
            {
                hslcolor[1] = hslcolor[1]*1.4;
            }
            distinctCellColor = Color.hsl(hslcolor[0], hslcolor[1], hslcolor[2]);
            drawBoard();
            printHallOfFame();
    }

    // Just show or hide modal div.
    function toggleModal(){
    	el = document.getElementById("modal");
	    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    }

    function updateHallOfFame(){
        var submitPlayerName;
        if((submitPlayerName = document.getElementById("playerName")) != null) {
            var inserted = false;

            person = new Array (submitPlayerName.value, GameLevel);
            console.log(GameLevel+submitPlayerName.value+"Añadiendo entrada en hall of fame");
            
            if (_hallOfFame.length > 0){
                // Iterate and insert where needed
                for (var i = 0; i < _hallOfFame.length; i++) {
                    //console.log(_hallOfFame[i]);
                    console.log(_hallOfFame[i][0]+"->"+_hallOfFame[i][1]);
                    if (GameLevel >= _hallOfFame[i][1])
                    {
                        _hallOfFame.splice(i,0,person);
                        inserted = true;
                        break;
                    }
                }
            }
            else{
                // No other element.... just insert.
                _hallOfFame.splice(0,0,person);
                inserted = true;

            }
            if (!inserted && (_hallOfFame.length < 10))
            {
                _hallOfFame.splice(_hallOfFame.length,0,person);
                inserted = true;
            }

            // remove excess names
            if(inserted && (_hallOfFame.length > 10))
            {
                _hallOfFame.splice(10, (_hallOfFame.length-10));
            }

            if(inserted){
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("_hallOfFame", JSON.stringify(_hallOfFame));
                }
            }

            printHallOfFame();
        }
        else
        {
            console.log("Error: PlayerName not found on document!");
            return;
        }
    }

    // Public functions
    var methods = { 
        // GAMEBOARD accepts custom number of rows and cols.
        // Undefined rows or cols will use GameLevel
        init: function (boardId, level, rows, cols) {             
            if(document.getElementById(boardId) != null) {
                boardLocation = boardId;
            }
            else
            {
                console.log("Error: "+boardId+" not found on document!");
                return;
            }

            GameLevel = level || 0;
            var _rows = rows || (GameLevel + 2);
            var _cols = cols || (GameLevel + 2);

            fillBoard(_rows, _cols);

            if (typeof(Storage) !== "undefined") {
                var tmp = localStorage.getItem("_hallOfFame");
                if (tmp != null){
                    try{
                        _hallOfFame = JSON.parse(tmp);
                    }
                    catch(e){
                        console.log(e);
                    }
                }
            }
            initGame();
        },
        hallOfFame: function(){
            updateHallOfFame();
            toggleModal();
            GAMEBOARD.init(boardLocation, 0);
        },
        findTheCell: function(){
            // It could be easy to use the private properties distinctCell, cellColor or distinctCellColor.
            // But as requested, this function will try to beat the game without tricks.
            // Only color of three cells are needed to determine if the cell is the different one.
            var board = document.getElementById(boardLocation);
            var cells = board.getElementsByTagName("td");

            var color1 = "";
            var cellColor1 = 0; // Store cell number, only usefull if distinct cell is 0 or 1.
            var ncellColor1 = 0;
            var color2 = "";
            var cellColor2 = 0;
            var foundDistinctCell = 0;
            for (var i = 0; i< cells.length; i++ )
            {
                console.log("Cell "+i+" backgroundColor is "+cells[i].style.backgroundColor);

                if (i==0)
                {
                    console.log ("first cell found!");
                    color1 = cells[i].style.backgroundColor;
                    cellColor1 = 0;
                    ncellColor1 = 1;
                }
                else
                {
                    if (cells[i].style.backgroundColor != color1)
                    {
                        // check if we have check only two cells, or more. 
                        // If only two, we need another one to be sure of the
                        // distinct cell. If more than two cells, this is the distinct cell

                        console.log ("Distinct cell backgroundColor found!");
                        if (ncellColor1 == 1)
                        {             
                            if (color2 == ""){
                                // This is the first color2 distinct to color1 found
                                console.log ("Second cell, cannot decide yet");
                                color2 = cells[i].style.backgroundColor;
                                cellColor2 = i;

                            }
                            else if (color2 == cells[i].style.backgroundColor){
                                // cellColor1 is the distinct cell
                                console.log ("First color1 cell must be the cell");
                                foundDistinctCell = cellColor1;
                                break;
                            }
                            else
                            {
                                // Uopssss three different colors? this is an error!!!
                                alert("Something went wrong!! I can't help you.");
                                return;
                            }
                        }
                        else{
                            // ncellcolor1 is more than one. This cell is the distinct cell.
                            console.log ("I am the distinct cell");
                            foundDistinctCell = i;
                            break;
                        }
                    }
                    else{
                        if (color2 == "")
                        {
                            console.log ("Same as color 1, incrementing");
                            ncellColor1++;
                        }
                        else{
                            // color 2 is the distinct cell
                            foundDistinctCell = cellColor2;
                            break;
                        }

                    }
                }
            }
            // Be sure the color will be visible easily
            var borderColor = Color.parse(cells[foundDistinctCell].style.backgroundColor);

            var borderColorHsl = borderColor.hslData();
            if (borderColorHsl[1]>0.5)
            {
                borderColorHsl[1] = 0.0;
                borderColorHsl[2] = 0.0;
            }
            else
            {
                borderColorHsl[1] = 1.0;
                borderColorHsl[2] = 1.0;
            }
            borderColor = Color.hsl(borderColorHsl[0], borderColorHsl[1], borderColorHsl[2]);

            cells[foundDistinctCell].style.border = "3px dashed " + borderColor.hexTriplet();
        }
    }


    return methods;
}());

console.log("GAMEBOARD TEST START");
// Init Game with a 2x2 matrix.
GAMEBOARD.init("board");


