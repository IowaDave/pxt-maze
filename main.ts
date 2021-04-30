/**
 * Custom blocks for maze games
 * by David Sparks February-April 2021
 */

// The following declarations are global

// select how to arrange maze's entry and exit
enum MazePortal {
    //% block="exit only"
    EXIT_ONLY,
    //% block="corners"
    CORNERS,
    //% block="both random"
    RANDOM,
    //% block="random exit"
    RANDOM_EXIT
}

// used by functions that activate or deactivate a feature
enum MazeFlag {
    //% block="on"
    ON,
    //% block="off"
    OFF
}

// select direction of next move in the maze
enum MazeDirection {
    //% block="up"
    UP, 
    //% block="down" 
    DOWN, 
    //% block="left" 
    LEFT, 
    //% block="right" 
    RIGHT 
}

// select the treasure feature of a maze
enum MazeTreasure {
    //% block="none"
    NONE,
    //% block="hidden"
    HIDE,
    //% block="magic key"
    KEY
}

// used by functions to set or get the location of a maze cell
enum MazeCellCoordinate {
    //% block="row"
    ROW,
    //% block="column"
    COL
}

// Here ends the list of global declarations.
// **************************************************************
// The following code resides within the "maze" namespace


/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace custom {

// variables having namespace scope 

// encode whether the exit portal is located on the
// North, East, South or West (NESW) side of the maze
enum NESW {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

let showCrumbs = false; // for breadcrumbs display 

// portal- related variables
let entranceActive = true; // new Mar2021, default value
let entranceRow = 0; // set during the makeMaze() function
let exitRow = 0; // set during the makeMaze() function, deprecated Mar21
let exitPosition = 0; // new Mar2021, set during the makeMaze() function 
let randomPortals = false; // set by the setMazePortals() block, deprectated Mar2021 
let mazePortalType = MazePortal.CORNERS; // new Mar2021, set by the setMazePortalType() block
let mazeExitBoundary = NESW.EAST; // new Mar2021, default value
// facts about the maze 
let maze: Buffer; // to be defined later during makeMaze() function
let mazeCOLS = 2; // set by the newMaze() block then used as a constant
let mazeROWS = 2; // set by the newMaze() block then used as a constant

// game set-up flag modified only by the setMazeTreasure() block
// and evaluated in the makeMaze() function
let hiddenTreasure = false;

// game set-up flag modified only by the setMazeTreasure() block
// and evaluated in the has-x-Boundary() functions
let treasureExitKey = false;

// status flag modified by the functions checkTreasure() and makeMaze()
// and its value reported by the playerHasTreasure() block
let treasureTaken = false; 

// game status flag becomes true after player exits the maze
let mazeExitReached = false;

// constants for defining and analyzing maze contents
const LEFTLINE = 1;
const TOPLINE = 2;
const RIGHTLINE = 4;
const BOTTOMLINE = 8;
const VISITFLAG = 16;
const TREASURE = 32;

// facts about a cell, defined here, used everywhere
let cellRow = 0;
let cellCol = 0;

// ***************************************************************

// exported functions that expose blocks

/**
 * turn showing of breadcrumbs on and off 
 * @param status 
 */
//% block="turn breadcrumbs %status"
export function displayCrumbs(status: MazeFlag) {
    switch (status) {
        case MazeFlag.ON:
            showCrumbs = true;
            break;
        case MazeFlag.OFF:
            showCrumbs = false;
            break;
        default:
            // do nothing
    }
}

/**
 * return the value of the showCrumbs flag
 */
//% block
export function showingBreadcrumbs (): boolean {
    return showCrumbs;
}

/**
 * return the row or column number
 * of the player's location in the maze
 */
//% block="%rowcol|of player's location"
export function currenLocation(rowcol: MazeCellCoordinate): number {
    switch (rowcol as MazeCellCoordinate) {
        case MazeCellCoordinate.ROW:
            return cellRow;
            break;
        case MazeCellCoordinate.COL:
            return cellCol;
            break;
        default:
            return cellCol;
    }
}

/**
 * redraw the current cell
 */
//% block="redraw current position"
export function redrawCell() {
    // only for coordinates within the maze
    if (( (cellRow >= 0) && (cellRow < mazeROWS) 
      && (cellCol >= 0) && (cellCol < mazeCOLS))
    || isEntrance(cellRow, cellCol)
    || isExit(cellRow, cellCol)
    ) displayCell(cellRow, cellCol);
}

/**
 * set the maze portal type
 */
//% block="set maze portal type %selectedType"
export function setMazePortalType(userSelectedType: MazePortal) {
    mazePortalType = userSelectedType;
}

/**
 * set the value of the hiddenTreasure flag
 */
//% block="set maze treasure to %status"
export function setMazeTreasure (status: MazeTreasure) {
    switch (status) {
        case MazeTreasure.HIDE:
            hiddenTreasure = true;
            treasureExitKey = false;
            break;
        case MazeTreasure.KEY:
            hiddenTreasure = true;
            treasureExitKey = true;
            break;
        case MazeTreasure.NONE:
        default:
            hiddenTreasure = false;
            treasureExitKey = false;
    }
}

/**
 * return the value of the treasureTaken flag
 */
//% block
export function playerHasTreasure (): boolean {
    return treasureTaken;
}

/**
 * return the value of the mazeExitReached flag
 */
//% block="player has reached the maze exit"
export function getMazeExitReachedFlag(): boolean {
    return mazeExitReached;
}

/**
 * start a new game
 */

//% block="new maze with %rows rows and %cols columns"
export function newMaze(rows: number, cols: number) {
    mazeCOLS = cols;
    mazeROWS = rows;
    startNewGame();
}

/**
 * initiate motion out of current cell 
 * @param direction 
 */
//% block="move %direction"
export function move(direction: MazeDirection) {
    switch (direction) {
        case MazeDirection.UP:
            moveUp(cellRow, cellCol);
            break;
        case MazeDirection.DOWN:
            moveDown(cellRow, cellCol);
            break;
        case MazeDirection.LEFT:
            moveLeft(cellRow, cellCol);
            break;
        case MazeDirection.RIGHT:
            moveRight(cellRow, cellCol);
            break;
        default:
            // do nothing
    }
}

// *********************************************
// exported functions that do NOT expose blocks
// but are accessble to javascript code
// *********************************************

// I would like to add functions here 
// to save and restore games in progress
// and to export or import the game data structure

// ***********************************************
// internal (private) functions of the namespace 
// ***********************************************

// calculates an index number into the maze buffer,
// from a pair of row and column numbers
function index (row: number, col: number) {
  return (row * mazeCOLS) + col;
}


/**
 * cellValue returns the value stored
 * at row,col of a maze
 */
function cellValue (row: number, col: number): number {
    return maze.getNumber(NumberFormat.Int8LE, 
                    index(row, col)); 
}

function toggleCellFlag(row: number, col:number, flag: number) {
    maze.setNumber(NumberFormat.Int8LE, index(row, col), 
    cellValue(row, col) ^ flag);
}

function setCellFlag(row: number, col:number, flag: number) {
    while ( (cellValue(row, col) & flag) == 0 )
    // flag is not set, toggle it on
    toggleCellFlag(row, col, flag);
}

function clearCellFlag(row: number, col: number, flag: number) {
    while ( (cellValue(row, col) & flag) != 0)
    // flag is set, toggle it off
    toggleCellFlag(row, col, flag);
}

// functions to ascertain cell attributes

/**
 * hasTopBoundary
 * return true if cell at (row, col) has a top boundary
 */
function hasTopBoundary(row: number, col: number): boolean {
    // true if cell is Entrance 
    if (isEntrance(row, col)) return true;
    // true if cell is Exit to N, E or W but not to S
    if (isExit(row, col)) {
        // check S
        if (mazeExitBoundary as NESW === NESW.SOUTH) return false;
        // otherwise it is to N, E or W
        return true;
    };

    // next, a special check when on exit threshhold 
    // and treasure is key
    // and player does not possess it
    // and the exit to the NORTH
    if ( isExitThreshhold(row, col) && exitIsHidden()
        && (mazeExitBoundary as NESW === NESW.NORTH) ) return true;
    
    // true if cell defines a TOPLINE 
    if ((cellValue(row, col) & TOPLINE) != 0)  return true;
    // otherwise
    return false;
    
}

/**
 * hasLeftBoundary
 * return true if cell at (row, col) has a left boundary
 */
function hasLeftBoundary(row: number, col: number): boolean {
    // treat special case of portals first
    // true if cell is Entrance 
    if (isEntrance(row, col)) return true;
    // true if exit is to N, S or W but not to E 
    if (isExit(row, col)) {
        // check E
        if (mazeExitBoundary === NESW.EAST) return false;
        // otherwise it is N, S or W
        return true;
    }

    // next, a special check when on exit threshhold 
    // and treasure is key
    // and player does not possess it
    // and the exit to the WEST
    if ( isExitThreshhold(row, col) && exitIsHidden() 
        && (mazeExitBoundary as NESW === NESW.WEST) ) return true;
    
    // true if non-exit cell defines a LEFTLINE 
    if  ((cellValue(row, col) & LEFTLINE) != 0) return true;
    // otherwise
    return false;
}

/**
 * hasRightBoundary
 * return true if cell at (row, col) has a right boundary
 */
function hasRightBoundary(row: number, col: number): boolean {
    // treat special case of portals first 
    // true if cell is Exit to N, E or S but not to W
    if (isExit(row, col)) {
        // check W
        if (mazeExitBoundary as NESW === NESW.WEST) return false;
        // otherwise it is N, E or S
        return true;
    }
    // next, a special check when we are in the entrance 
    if (isEntrance(row, col)) {
        // we hope to return false for this location 
        // however, to be sure, check the cell to the right 
        if ((cellValue(row, col + 1) & LEFTLINE) != 0) return true;
        // otherwise
        return false;
    }
    // next, a special check when on exit threshhold 
    // show a right boundary when treasure is key
    // and player does not possess it
    // and the exit to the EAST
    if ( isExitThreshhold(row, col) && exitIsHidden() 
        && (mazeExitBoundary as NESW === NESW.EAST) ) return true;
    
    // true if non-entrance cell defines a RIGHTLINE 
    if  ((cellValue(row, col) & RIGHTLINE) != 0) return true;
    // true if the column number to the right is in the maze
    // and the cell in that column on this row defines a LEFTLINE
    if (((col + 1) < mazeCOLS) 
        && ((cellValue(row, col + 1) & LEFTLINE) != 0)) return true;
    // otherwise
    return false;
}

/**
 * hasBottomBoundary
 * return true if cell at (row, col) has a bottom boundary
 */
function hasBottomBoundary(row: number, col: number): boolean {
    // true if cell is Entrance 
    if (isEntrance(row, col)) return true;
    // true if cell is Exit to E, S or W but not to N
    if (isExit(row, col)) {
        // check N
        if (mazeExitBoundary as NESW === NESW.NORTH) return false;
        // otherwise it is to E, S or W
        return true;
    }

    // next, a special check when on exit threshhold 
    // show a bottom boundary when treasure is key
    // and player does not possess it
    // and the exit to the SOUTH
    if ( isExitThreshhold(row, col) && exitIsHidden() 
        && (mazeExitBoundary as NESW === NESW.SOUTH) ) return true;
    
    // true if cell defines a BOTTOMLINE 
    if ((cellValue(row, col) & BOTTOMLINE) != 0) return true;
    // true if the row number below is in the maze 
    // and the cell in this column on that row defines a TOPLINE 
    if (((row + 1) < mazeROWS)
        && ((cellValue(row+1, col) & TOPLINE) != 0)) return true;
    // otherwise
    return false;
}

function hasBreadcrumb(row: number, col:number): boolean {
    // true if cell's VISITFLAG is turned off 
    // I know, that sounds backwards.
    // The reason is that we're re-using a flag
    // that was turned on when the maze was being initialized.
    // During play, the flag is off for cells that have been visited
    if ((cellValue(row, col) & VISITFLAG) == 0) return true;
    // otherwise
    return false;
}

function isExit(row: number, col:number): boolean{
    switch (mazeExitBoundary as NESW) {
        case NESW.NORTH:
            if ( (row == -1) && (col == exitPosition) ) return true;
            break;
        case NESW.EAST:
            if ( (row == exitPosition) && (col == mazeCOLS) ) return true;
            break;
        case NESW.SOUTH:
            if ( (row == mazeROWS) && (col == exitPosition) ) return true;
            break;
        case NESW.WEST:
            if ( (row == exitPosition) && (col == -1) ) return true;
            break;
        default:
            return false;
    }
    // next line is not redundant.
    // it executes when the above logic tests fail
    return false;
}

// tests whether exit portal is hidden
function exitIsHidden(): boolean {
    // portal is not hidden if not using treasure as an exit key
    if (treasureExitKey == false) return false;
    // portal is not hidden if treasure has been taken
    if (treasureTaken == true) return false;
    // OK, treasure is key but player does not have it yet
    return true; // portal remains locked
}

function isExitThreshhold(row: number, col:number): boolean{
    switch (mazeExitBoundary as NESW) {
        case NESW.NORTH:
            if ( (row == 0) && (col == exitPosition) ) return true;
            break;
        case NESW.EAST:
            if ( (row == exitPosition) && (col == mazeCOLS-1) ) return true;
            break;
        case NESW.SOUTH:
            if ( (row == mazeROWS-1) && (col == exitPosition) ) return true;
            break;
        case NESW.WEST:
            if ( (row == exitPosition) && (col == 0) ) return true;
            break;
        default:
            // respond false for unexpected values of mazeExitBoundary
            return false;
    }
    // next line is not redundant.
    // it executes when none of the above logic tests succeed
    // which would be most of the time, i.e., not in threshhold cell
    return false;
}

function isEntrance(row: number, col: number) {
    // true if on entrance row and col is -1
    // and entranceActive is true
    if (entranceActive && (row == entranceRow) && (col < 0)) return true;
    // otherwise
    return false;
}

function isMazeCell(row: number, col: number) {
    // true for 0 <= row < mazeROWS && 0 <= col < mazeCOLS
    if ( 
        (row >= 0) && (row < mazeROWS) 
     && (col >= 0) && (col < mazeCOLS)
    ) return true;
    // otherwise 
    return false;
}

function hasTreasure (row: number, col: number): boolean {
    // true if in a maze cell and the TREASURE flag is set
    if  (
            ((cellValue(row, col) & TREASURE) != 0)
            && isMazeCell(row, col) 
        ) return true;
    // otherwise
    return false;
}

/*****************************************************************
 * manage movement from one cell to the next 
 *****************************************************************/

// checkCrumb checks for and drops breadcrumb when departing a cell
function checkCrumb(row: number, col: number) {
    if (hasBreadcrumb(row, col)) {
        // the VISITFLAG is already clear; do nothing 
    } else {
        // clear the VISITFLAG
        clearCellFlag(row, col, VISITFLAG);
    }
}

function hideTreasure(row: number, col: number) {
    // player does not have treasure 
    treasureTaken = false;
    // turn the treasure flag on in the cell 
    setCellFlag(row, col, TREASURE);
}

function takeTreasure(row: number, col: number) {
    // turn treasure flag off in the cell 
    clearCellFlag(row, col, TREASURE);
    // give treasure to the player 
    treasureTaken = true;
}

function checkTreasure (row: number, col: number) {
    if (hasTreasure(row, col)) {
        // draw the treasure icon
        drawTreasure();
        // then flash it a little, leaving it visible
        for (let count = 0; count < 5; count++) {
            basic.pause(100);
            clearTreasure();
            basic.pause(100);
            drawTreasure();
        }
        // take the treasure
            takeTreasure(row, col);
    }
}

// moveUp is called from the main loop when pinUp flag is true 
function moveUp(row: number, col: number) {
    if (hasTopBoundary(row, col)) {
        flashTopLine();
    } else {
//        checkCrumb(row, col);
        arrowsUp();
        cellRow--;
        displayCell(cellRow, cellCol);
    }
}

// moveLeft is called from the main loop when pinLeft flag is true 
function moveLeft(row: number, col: number) {
    if (hasLeftBoundary(row, col)) {
        flashLeftLine();
    } else {
//        checkCrumb(row, col);
        arrowsLeft();
        cellCol--;
        displayCell(cellRow, cellCol);
    }
}

// moveRight is called from the main loop when pinRight flag is true
function moveRight(row: number, col: number) {
    if (hasRightBoundary(row, col)) {
        flashRightLine();
    } else {
//        checkCrumb(row, col);
        arrowsRight(); 
        cellCol++;
        displayCell(cellRow, cellCol);
    }
}

//moveDown is called from the main loop when pinDown flag is true 
function moveDown(row: number, col: number) {
    if (hasBottomBoundary(row, col)) {
        flashBottomLine();
    } else {
//        checkCrumb(row, col);
        arrowsDown(); 
        cellRow++;
        displayCell(cellRow, cellCol);
    }
}

/************************************************************
 * maze motion indicators                                   *
 *   these functions animate a pair of arrowheads           *
 *   moving in the named direction across the LED display   *
 ************************************************************/
let dwellTime = 50; // animation speed, smaller = faster

function arrowsLeft () {
    basic.clearScreen();
    for (let x = 10; x > 0; x--) {
        shift2ByCol(x-5, x-6);
        shift13ByCol(x-4, x-5);
        shift2ByCol(x-2, x-3);
        shift13ByCol(x-1, x-2);
        basic.pause(dwellTime);
    }
}

function arrowsUp () {
    basic.clearScreen();
    for (let x2 = 10; x2 > 0; x2--) {
        shift2ByRow(x2-5, x2-6);
        shift13ByRow(x2-4, x2-5);
        shift2ByRow(x2-2, x2-3);
        shift13ByRow(x2-1, x2-2);
        basic.pause(dwellTime);
    }
}

function arrowsRight () {
    basic.clearScreen();
    for (let x3 = 0; x3 < 10; x3++) {
        shift2ByCol(x3-1, x3);
        shift13ByCol(x3-2, x3-1);
        shift2ByCol(x3-4, x3-3);
        shift13ByCol(x3-5, x3-4);
        basic.pause(dwellTime);
    }
}

function arrowsDown () {
    basic.clearScreen();
    for (let x4 = 0; x4 < 10; x4++) {
        shift2ByRow(x4-1, x4);
        shift13ByRow(x4-2, x4-1);
        shift2ByRow(x4-4, x4-3);
        shift13ByRow(x4-5, x4-4);
        basic.pause(dwellTime);
    }
}

/*******************************************************
 * shift2ByRow turns off the LED in column 2 of a row  *
 * and turns the same position on in an adjacent row.  *
 *******************************************************/
function shift2ByRow (prior: number, next: number) {
    // turn off the dot in column 2 of the prior row 
    if ((prior >= 0) && (prior < 5)) led.unplot(2, prior);
    // turn  on the dot in column two of the next row 
    if ((next >= 0) && (next < 5)) led.plot(2, next);
}

/****************************************************************
 * shift13ByRow turns off the LEDs in columns 1 and 3 of a row  *
 * and turns the same positions on in an adjacent row.          *
 ****************************************************************/
function shift13ByRow (prior: number, next: number) {
    if ((prior >= 0) && (prior < 5)) {
    // turn off the dots in columns 1 and 3 of the prior row     
        led.unplot(1, prior);
        led.unplot(3, prior);
    }
    if ((next >= 0) && (next < 5)) {
    // turn on the dots in columns 1 and 3 of the next row 
        led.plot(1, next);
        led.plot(3, next);
    }
}

/**********************************************************
 * shift2ByCol turns off the LED in row 2 of a column     *
 * and turns the same position on in an adjacent column.  *
 **********************************************************/
function shift2ByCol (prior: number, next: number) {
    // turn off the dot in row 2 of the prior column 
    if ((prior >= 0) && (prior < 5)) led.unplot(prior, 2);
    // turn on the dot in row 2 of the next column 
    if ((next >= 0) && (next < 5)) led.plot(next, 2);
}

/***************************************************************
 * shift13ByCol turns off the LEDs in rows 1 and 3 of a column *
 * and turns the same positions on in an adjacent column.      *
 ***************************************************************/
function shift13ByCol (prior: number, next: number) {
    if ((prior >= 0) && (prior < 5)) {
    // turn off the dots in rows 1 and 3 of the prior column 
        led.unplot(prior, 1);
        led.unplot(prior, 3);
    }
    if ((next >= 0) && (next < 5)) {
    // turn on the dots in rows 1 and 3 of the next column 
        led.plot(next, 1);
        led.plot(next, 3);
    }
}

 /****************************************************************
  * display functions for the current cell
  ****************************************************************/
function displayCell(row: number, col: number) {
    outlineCell();
    // fill-in applicable edge lines
//    if (hasLeftBoundary(row, col)) drawLeftLine();
//    if (hasTopBoundary(row, col)) drawTopLine();
//    if (hasRightBoundary(row, col)) drawRightLine();
//    if (hasBottomBoundary(row, col)) drawBottomLine();
    drawEdges(row, col);
    // show breadcrumbs if flag enabled
    if (showCrumbs && hasBreadcrumb(row, col)) {
        led.plot(2,2);
    } else {led.unplot(2,2)} // turn crumbs off otherwise
    // condition the breadcrumb flag for future visits
    checkCrumb(row, col);
    // don't show a breadcrumb at Entry and Exit locations 
    if (isEntrance(row, col)) {
        drawEntryBar();
        led.unplot(2,2);
    }
    if (isExit(row, col)) {
        drawExitBar();
        led.unplot(2,2);
        // new 08Apr2021 for-loop attempts to flash the exit
        for (let count = 0; count < 6; count++) {
            basic.pause(80);
            basic.clearScreen();
            basic.pause(80);
            outlineCell();
            drawEdges(row, col);
            drawExitBar();
        }
    }
    // finally, check for treasure!
    checkTreasure(row, col);
}

// functions to render cell elements on the led display 

function outlineCell() {
    basic.clearScreen();
    led.plot(0,0);
    led.plot(0,4);
    led.plot(4,0);
    led.plot(4,4);
}

function drawLeftLine() {
    led.plot(0,1);
    led.plot(0,2);
    led.plot(0,3);
}

function drawRightLine() {
    led.plot(4,1);
    led.plot(4,2);
    led.plot(4,3);
}

function drawTopLine() {
    led.plot(1,0);
    led.plot(2,0);
    led.plot(3,0);
}

function drawBottomLine() {
    led.plot(1,4);
    led.plot(2,4);
    led.plot(3,4);
}

function drawEdges(row: number, col: number) {
    if (hasLeftBoundary(row, col)) drawLeftLine();
    if (hasTopBoundary(row, col)) drawTopLine();
    if (hasRightBoundary(row, col)) drawRightLine();
    if (hasBottomBoundary(row, col)) drawBottomLine();
}

// Portal indicator bar functions REDEFINED March 2021
function drawEntryBar() {
//    led.plot(1,1);
//    led.plot(1,2);
//    led.plot(1,3);
    drawWestPortalBar();
}

function drawExitBar() {
    switch (mazeExitBoundary as NESW) {
        case NESW.NORTH:
            drawNorthPortalBar();
            break;
        case NESW.EAST:
            drawEastPortalBar();
            break;
        case NESW.SOUTH:
            drawSouthPortalBar();
            break;
        case NESW.WEST:
            drawWestPortalBar();
            break;
        default:
            // should never get here, but do nothing in that case        
    }
    // signal exit from maze
    mazeExitReached = true;
}
// new functions March 2021 for portal bars based on respective edge
function drawWestPortalBar() {
    led.plot(1,1);
    led.plot(1,2);
    led.plot(1,3);
}

function drawEastPortalBar() {
    led.plot(3,1);
    led.plot(3,2);
    led.plot(3,3);
}

function drawNorthPortalBar() {
    led.plot(1,1);
    led.plot(2,1);
    led.plot(3,1);
}

function drawSouthPortalBar() {
    led.plot(1,3);
    led.plot(2,3);
    led.plot(3,3);
}


function drawTreasure() {
    // in the shape of a diamond!
    led.plot(2,1);
    led.plot(1,2);
//    led.plot(2,2);
    led.plot(3,2);
    led.plot(2,3);
}

function clearTreasure() {
    led.unplot(2,1);
    led.unplot(1,2);
//    led.unplot(2,2);
    led.unplot(3,2);
    led.unplot(2,3);
}

// the following functions flash a boundary line

function flashLeftLine() {
    for (let count = 0; count < 6; count++) {
        led.toggle(0,0);
        led.toggle(0,1);
        led.toggle(0,2);
        led.toggle(0,3);
        led.toggle(0,4);
        basic.pause(100);
    }
}

function flashTopLine() {
    for (let count2 = 0; count2 < 6; count2++) {
        led.toggle(0,0);
        led.toggle(1,0);
        led.toggle(2,0);
        led.toggle(3,0);
        led.toggle(4,0);
        basic.pause(100);
    }
}

function flashRightLine() {
    for (let count3 = 0; count3 < 6; count3++) {
        led.toggle(4,0);
        led.toggle(4,1);
        led.toggle(4,2);
        led.toggle(4,3);
        led.toggle(4,4);
        basic.pause(100);
    }
}

function flashBottomLine() {
    for (let count4 = 0; count4 < 6; count4++) {
        led.toggle(0,4);
        led.toggle(1,4);
        led.toggle(2,4);
        led.toggle(3,4);
        led.toggle(4,4);
        basic.pause(100);
    }
}

/***************************************************************
 * The following relate to creating a new maze 
 * having mazeROWS rows and mazeCOLS columns 
 ***************************************************************/
    // random-number generator returns 0 or 1
    // used below in makeMaze() function
    function rand01() {
      let randByte = 0;
    	if (Math.random() >= 0.5) {
    		randByte = 1;
	    }
      return randByte;
    }

// select a boundary at random for the exit
// function expects boundaryCount to be either 3 or 4
function randomBoundary( boundaryCount: number ): NESW {
    // choose a random number 0 <= x < boundaryCount
    let boundaryChoice = Math.floor(Math.random() * boundaryCount);
    // return the corresponding boundary
    switch (boundaryChoice) {
        case 0:
            return NESW.NORTH;
            break;
        case 1:
            return NESW.EAST;
            break;
        case 2:
            return NESW.SOUTH;
            break;
        case 3:
            return NESW.WEST;
            break;
        // note: only 4 directions are valid
        default:
            return NESW.EAST; // same as default declaration       
    }
}

// a debug function displays maze cell values
function displayMazeCellValues() {
    for (let i = 0; i < mazeROWS * mazeCOLS; i++) {
        basic.showNumber(maze[i] - VISITFLAG);
        basic.pause(1000);
        basic.clearScreen();
        basic.pause(500);
    }
    basic.showString("X");
    basic.pause(1000);
    if (mazeExitBoundary as NESW === NESW.NORTH) basic.showString("N");
    if (mazeExitBoundary as NESW === NESW.EAST) basic.showString("E");
    if (mazeExitBoundary as NESW === NESW.SOUTH) basic.showString("S");
    if (mazeExitBoundary as NESW === NESW.WEST) basic.showString("W");
    basic.pause(1000);
    basic.showNumber(exitPosition);
    basic.pause(1000);
}

function startNewGame() {
    // initialize certain namespace variables
    // turn off breadcrumb display 
    showCrumbs = false;
    // create a new maze
    makeMaze();

    // the following calls a debug display function
    // displayMazeCellValues();
    
    // clear the maze exit reached flag
    mazeExitReached = false;
    // place the player at the game entrance
    // these values are for CORNERS, RANDOM and RANDOM_EXIT portal type games
    cellRow = entranceRow;
    cellCol = -1;
    // for EXIT_ONLY portal type, place the player randomly within the maze
    if (mazePortalType as MazePortal === MazePortal.EXIT_ONLY) {
        // avoiding any cell that has treasure in it
        do {
        cellRow = Math.floor(Math.random() * mazeROWS);
        cellCol = Math.floor(Math.random() * mazeCOLS);
        } while (hasTreasure(cellRow, cellCol) );
    }
    // display the player's initial position
    displayCell(cellRow, cellCol);
}

/****************************************************************
 * makeMaze													*
 * Applies the Aldus-Broder algorithm for discovering			*
 * uniform spanning trees within a rectangular matrix.  		*
 * See discussion in the following web pages:					*
 * http://weblog.jamisbuck.org/2011/1/17/...					*
 *      ...maze-generation-aldous-broder-algorithm				*
 * http://people.cs.ksu.edu/~ashley78/wiki.ashleycoleman.me/... *
 *      ...index.php/Aldous-Broder_Algorithm.html				*
 *																*
 * David Sparks Original c code written October 2019			*
 * Adapted January 2021 for MakeCode to run on a micro:bit 		*
 ****************************************************************/
function makeMaze() {
    /********************************************************************************* 
     * GENERAL INFORMATION ABOUT THE MAZE DATA STRUCTURE
     * The maze array is stored in a buffer of raw bytes, 
     * one byte per maze cell, in an effort to conserve RAM.
     * The one byte operates as a bitfield representing six distinct cell properties.
     * The buffer object is declared above with the name, maze.
     * It gets defined below, in the following sections.
     * The buffer's values are exposed by getter and setter methods,
     * getNumber() and setNumber().
     * The methods take a NumberFormat object as an argument.
     * We use the NumberFormat.Int8LE, representing 8-bit integers.
     * The methods also take an offset into the buffer.
     * Example, 10 rows of 5 cols gives 10 x 5 = a 50-byte buffer.
     * Its values may be accessed with an offset value of 0 through 49.
     * Translating offset from a row, column context requires calculation.
     * offset = (<row number> * <number of columns>) + <column number>.
     * This is handled by the index(row, col) function defined above.
     * Example of getting a value at row, col:
     * value = maze.getNumber(NumberFormat.Int8LE, index(row, col))
     * The cellValue(row, col) function defined above works that way.
     *********************************************************************************/

    // maze-creation variables


    // Calculate number of cells from mazeROWS and mazeCOLS
    // as those values stand at the time this function gets run.
    // Note: 2 x 2 is the startup default but user may change.
    let unVisited = mazeROWS*mazeCOLS; 
  	// initialize maze buffer (declared above in namespace scope)
    maze = pins.createBuffer(unVisited);
    // Set each and all cells to have a top line and a left line
    maze.fill(TOPLINE + LEFTLINE);

    /*********************************************************************************
     * I want to keep the program in row,col context as much as possible.
     * Because it is easier for me, a human, 
     * to read and understand the code that way.
     * The arrays for origin, destination, and motion
     * are regular Typescript numbers because it's easiest that way.
     *********************************************************************************/

    // workhorse variables having function scope
    let origin = [0,0];  // [row, col]
    let destination = [0,0];
    let motion = [0,0];
    let treasureCell = [0,0];
    let row = 0;
    let col = 0;

    // establish the portal parameters
    switch (mazePortalType as MazePortal) {
        case MazePortal.CORNERS:
            // entrance at upper-left corner
            entranceActive = true;
            entranceRow = 0;
            // exit at lower-right corner
            exitPosition = mazeROWS - 1;
            mazeExitBoundary = NESW.EAST;
            break;
        case MazePortal.RANDOM_EXIT:
            // entrance at upper-left corner
            entranceActive = true;
            entranceRow = 0;
            // place exit randomly on a boundary other than West
            mazeExitBoundary = randomBoundary(3); // N + E + S = 3
            // establish exit position on the boundary
            if ( (mazeExitBoundary as NESW === NESW.EAST) || (mazeExitBoundary as NESW === NESW.WEST) ) {
                exitPosition = Math.floor(Math.random() * mazeROWS);
            } else {
                exitPosition = Math.floor(Math.random() * mazeCOLS);
            } 
            break;
        case MazePortal.RANDOM:
            // place entrance randomly on west boundary
            entranceActive = true;
            entranceRow = Math.floor(Math.random() * mazeROWS);
            // place exit on a boundary other than West
            mazeExitBoundary = randomBoundary(3); // N + E + S = 3
            // establish exit position on the boundary
            if ( (mazeExitBoundary as NESW === NESW.EAST) || (mazeExitBoundary as NESW === NESW.WEST) ) {
                exitPosition = Math.floor(Math.random() * mazeROWS);
            } else {
                exitPosition = Math.floor(Math.random() * mazeCOLS);
            } 
            break;
        case MazePortal.EXIT_ONLY:
            // no entrance portal
            entranceActive = false;
            // no entrance row defined
            // place exit randomly on any one of the four boundaries
            mazeExitBoundary = randomBoundary(4); // N + E + S + W = 4
            if ( (mazeExitBoundary as NESW === NESW.EAST) || (mazeExitBoundary as NESW === NESW.WEST)  ) {
                exitPosition = Math.floor(Math.random() * mazeROWS);
            } else {
                exitPosition = Math.floor(Math.random() * mazeCOLS);
            }
    }

    // select a random location for the optional treasure 
    // the column is a simple calculation
    treasureCell[1] = Math.floor(Math.random() * mazeCOLS);
    // and likewise for the row
    treasureCell[0] = Math.floor(Math.random() * mazeROWS);

    /****************************************************
    * The following section modifies the initial values
    * of certain cells in the buffer
    ****************************************************/

    // place the treasure if using treasure 
    if (hiddenTreasure == true) {
        // hide the treasure 
        hideTreasure(treasureCell[0], treasureCell[1]);
    }

  	// turn off the left line on the entrance row
    // for CORNER and RANDOM maze portal types
    if ( (mazePortalType as MazePortal === MazePortal.CORNERS)
         || (mazePortalType as MazePortal === MazePortal.RANDOM) 
         || (mazePortalType as MazePortal === MazePortal.RANDOM_EXIT)) {
            clearCellFlag(entranceRow, 0, LEFTLINE);
    }

  	// give bottom row of cells a bottom line
  	for (col = 0; col < mazeCOLS; col++) {
      /*********************************************************
       * (mazeROWS - 1) gives the row number of the bottom row
       * when counting from zero, as Javascript does for arrays.
       *********************************************************/
        setCellFlag(mazeROWS - 1, col, BOTTOMLINE);
  	}
      
  	// Give the right-most column of cells a right side line
  	for (row = 0; row < mazeROWS; row++) {
      /**********************************************************
       * mazeCOLS - 1 is the offset for the right-most cell of a row
       **********************************************************/
        setCellFlag(row, mazeCOLS-1, RIGHTLINE);
  	}

    // Remove the boundary line for the exit threshhold cell
        switch (mazeExitBoundary as NESW) {
            case NESW.NORTH: // remove the top line of the threshhold cell
                // 0 is the top row, exitPosition gives a column number
                clearCellFlag(0, exitPosition, TOPLINE);
                break;
            case NESW.EAST: // remove right line of the threshhold cell
                // exitPosition gives a row number, mazeCOLS-1 is the rightmost column
                clearCellFlag(exitPosition, mazeCOLS-1, RIGHTLINE);
                break;
            case NESW.SOUTH: // remove bottom line of the threshhold cell
                // mazeROWS-1 is the bottom row, exitPosition gives a column number
                clearCellFlag(mazeROWS-1, exitPosition, BOTTOMLINE);
                break;
            case NESW.WEST: // remove left line of the threshhold cell
                // exitPosition gives a row number, 0 is the leftmost column
                clearCellFlag(exitPosition, 0, LEFTLINE);
                break;
            default:
                // should never get here. do nothing
        }
//    }

    /******************************************************************
    * The next section provides the method for navigating the buffer  
    ******************************************************************/

    /**************************************************************
     * The following steps for determing location within the maze
     * take place in row, col context. This is OK because
     * code calculates index into the cell array
     * at the moment of accessing the array.
     **************************************************************/
      
    // select random starting cell
  	origin[0] = Math.trunc(Math.random() * mazeROWS);
  	origin[1] = Math.trunc(Math.random() * mazeCOLS);
  	// mark it as visited
    // origin[0] is a row number, and origin[1] is a col number
    setCellFlag(origin[0], origin[1], VISITFLAG);
  	// decrement count of unvisited cells
  	unVisited -= 1;
/******************************* */
  	// visit all the other cells
  	while (unVisited > 0) {

  		// find a valid destination
  		do {
  			if (rand01() == 0) {
  				motion[0] = (rand01() * 2) - 1;
  				motion[1] = 0;
  			} else {
  				motion[0] = 0;
  				motion[1] = (rand01() * 2) - 1;
  			}
  			destination[0] = origin[0] + motion[0];
  			destination[1] = origin[1] + motion[1];
  		} while (
  			destination[0] < 0
  			|| destination[0] >= mazeROWS
  			|| destination[1] < 0
  			|| destination[1] >= mazeCOLS
  		);      

  		// test destination for visited
        if ((cellValue( destination[0], destination[1] ) & VISITFLAG) == 0) {
            // this cell has not been visited, 
            // therefore, continue the path into it from the origin cell

            // mark the destination cell as visited
            setCellFlag(destination[0], destination[1], VISITFLAG);
            // decrement unVisited counter
            unVisited--;
/******************************** */

/****************************************************************** 
 * Modify the values of cells in the buffer to clear cell boundary 
 * between the origin and the destination cells  
 ******************************************************************/

  			if (motion[0] < 0) {
                // moving up one row, clear top line of origin cell   
                clearCellFlag(origin[0], origin[1], TOPLINE);
  			}
  			if (motion[0] > 0) {
                // moving down one row, clear top line of destination cell 
                clearCellFlag(destination[0], destination[1], TOPLINE);
  			}
  			if (motion[1] < 0) {
                // moving left one column, clear left line of origin cell 
                clearCellFlag(origin[0], origin[1], LEFTLINE);
  			}
  			if (motion[1] > 0) {
                // moving right one column, clear left line of destination cell 
                clearCellFlag(destination[0], destination[1], LEFTLINE);
  			}
        } // End of if cell not visited 
  		// Destination becomes the new origin
  		origin[0] = destination[0];
  		origin[1] = destination[1];
    } // End of while (unVisited) loop
    // All cells have been visited. Maze is completely defined.

}
    
}
