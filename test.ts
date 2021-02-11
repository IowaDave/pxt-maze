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
// * only during the creation of the maze.
// * The maze does not change during play
// * while the player is moving around in it.
// *
// *****************************************

// sets entrance and exit portal locations to be
// either in the corners or at random locations 
maze.setMazePortals(MazePortal.RANDOM);
// turns on treasure and makes it the exit portal key
maze.setMazeTreasure(MazeTreasure.KEY)
// create new maze, using minimum dimensions 
maze.newMaze(2, 2);
// pause to see the Entrance cell displayed
basic.pause(1000);


// make six moves: right, down, up, down, right, right 
// might end showing the Exit cell, might not!
maze.move(MazeDirection.RIGHT); // enter upper-left corner cell in the maze
basic.pause(1000);
maze.move(MazeDirection.DOWN); // attempt move to lower-left cell 
basic.pause(1000);
maze.move(MazeDirection.UP); // try re-entering the upper-left cell 
basic.pause(1000); // breadcrumb might show up now
maze.move(MazeDirection.DOWN); // back to lower-left cell 
basic.pause(1000);
maze.move(MazeDirection.RIGHT); // attempt move to lower-right cell 
basic.pause(1000);
maze.move(MazeDirection.RIGHT); // attempt move to Exit cell
basic.pause(1000);
if (maze.playerHasTreasure() == true) {
    basic.showString("RICH!");
} else {
    basic.showString("Poor");
}

