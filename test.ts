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

// maximum diension reporter block
basic.showNumber(maze.maximumDimension());

// create new maze, using minimum dimensions 
maze.newMaze(2, 2);
// pause to see the Entrance cell displayed
basic.pause(2000);

// turn on the breadcrumbs display setting 
maze.displayCrumbs(Crumbstatus.ON);

// make six moves: right, down, up, down, right, right 
// might end showing the Exit cell, might not!
maze.move(Directions.RIGHT); // enter upper-left corner cell in the maze
basic.pause(2000);
maze.move(Directions.DOWN); // attempt move to lower-left cell 
basic.pause(2000);
maze.move(Directions.UP); // try re-entering the upper-left cell 
basic.pause(2000); // breadcrumb might show up now
maze.move(Directions.DOWN); // back to lower-left cell 
maze.move(Directions.RIGHT); // attempt move to lower-right cell 
maze.move(Directions.RIGHT); // attempt move to Exit cell


