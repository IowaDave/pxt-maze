// ***************************************
// *
// * demonstrates use of blocks
// * by simulating a certain series of "moves". 
// * note: final display after this sequence 
// * will vary because mazes are created
// * by a random process and will
// * be different each time the code runs. 
// * Run this code a few times to see some variety. 
// * Keep in mind that the randomness applies 
// * only during the creation of the maze; however,
// * the maze does not change during play
// * while the player is moving around in it.
// *
// *****************************************

// * The following test of the breadcrumbs reporter block 
// * might not appear to function correctly. 
// * I have noticed this problem only in test.ts. 
// * The block does work correctly when the extension 
// * has been imported into the regular MakeCode editor. 


// turn on the breadcrumbs display setting 
maze.displayCrumbs(Crumbstatus.OFF);

// test the breadcrumbs reporter block
if (maze.showingBreadcrumbs) {
    basic.showString("ON");
} else {
    basic.showString("OFF");
}
// turn on the breadcrumbs display setting 
maze.displayCrumbs(Crumbstatus.ON);

// breadcrumbs reporter block
if (maze.showingBreadcrumbs) {
    basic.showString("ON");
} else {
    basic.showString("OFF");
}
// create new maze, using minimum dimensions 
maze.newMaze(2, 2);
// pause to see the Entrance cell displayed
basic.pause(1000);


// make six moves: right, down, up, down, right, right 
// might end showing the Exit cell, might not!
maze.move(Directions.RIGHT); // enter upper-left corner cell in the maze
basic.pause(1000);
maze.move(Directions.DOWN); // attempt move to lower-left cell 
basic.pause(1000);
maze.move(Directions.UP); // try re-entering the upper-left cell 
basic.pause(1000); // breadcrumb might show up now
maze.move(Directions.DOWN); // back to lower-left cell 
basic.pause(1000);
maze.move(Directions.RIGHT); // attempt move to lower-right cell 
basic.pause(1000);
maze.move(Directions.RIGHT); // attempt move to Exit cell


