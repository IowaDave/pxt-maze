# pxt-maze
## Create interactive maze games for the BBC micro:bit.

Give the MakeCode editor a set of custom blocks designed to create and interact with a virtual maze.

> Open this as a web page at [https://iowadave.github.io/pxt-maze/](https://iowadave.github.io/pxt-maze/)

## A Hardware-Agnostic MakeCode Extension

This repository directly targets only the actual micro:bit itself, but not any specific accessory device. It is designed as an **extension** in MakeCode empowering users to build their own devices and to write their own code for playing games in a virtual maze. 

The maze is implemented inside the micro:bit by the code in this repository. Users may select or assemble hardware of their own choice for attrachment to the micro:bit. 

For reference purposes, the developers demonstrate the assembly of a game using this repository with MakeCode and the MakerBit by Roger Wagner, offered by 1010 Technologies. The example can be accessed at the following URL: 

[https://iowadave.github.io/pxt-makerbit-maze](https://iowadave.github.io/pxt-makerbit-maze)

The corresponding repository holding the code for that demonstration project is:

[https://github.com/iowadave/pxt-makerbit-maze](https://github.com/iowadave/pxt-makerbit-maze)

We recognize and actually hope that users may think of other ways to enjoy the features of this repository with other, different hardware too! It's our gift to the larger community in gratitude for the welcome that the MakerBit has received.

## Import the Extension into MakeCode

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/iowadave/pxt-maze** and import

## Blocks preview

This image shows how the blocks appear after being imported into the MakeCode editor.

![A rendered view of the blocks](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/maze_blocks.png)

## About the Blocks

![The new maze block](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/new_maze_block.png)

### maze.newMaze(rows, columns) 
creates a grid of "cells" arranged in rows a columns. Visualize it as a rectangular maze. The entrance is at the upper-left corner. The exit is at the lower-right corner.

The minimum number of rows or columns is two, which means that the maze can be as small as 2 rows of 2 cells each: maze.newMaze(2,2);

It does not have to be square; the row and column and column numbers can be different: newMaze(8, 10);

After the new maze has been created, this function actomatically displays the cell at the entrance to the maze. The display appears on the LED panel of the micro:bit.

**A comment on dimensions**: The newMaze() block is designed with a slider for selecting dimensions in a range between 2 and 15. The block can actually accept values larger than 15. The larger values just need to be put in explicitly. For example, the following code segment would produce a maze having 30 rows and 20 columns:

```typescript
let bigRows = 30;
let bigCols = 20;
maze.newMaze(bigRows, bigCols);
```

NOTE: bigger dimensions take longer to play, of course. They also take longer to create. The create-time gets longer because the maze algorithm produces what mathematicians call "uniform spanning trees". Basically it means that every cell in the maze can be reached; no areas are blocked off. Also, it means that the mazes are produced by a random process. This algorithm has advantages and disadvantages. 

The advantage, for mazes larger than, say, 8 rows by 8 columns, is that you are unlikely ever to see exactly the same maze twice. 

The disadvantage is the process that creates the maze takes longer as the dimensions get larger. 15 x 15 goes pretty fast, which is why the slider goes up to 15. Experiment with larger dimensions if you wish to gauge a practical upper limit for your situation. How patient are your players likely to be?

Also, keep in mind that each cell of a maze occupies one byte of memory. It means the amount of available memory imposes an upper limit.

![The move block](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/move_block.png)

### maze.move(Directions.UP) 
attempts to move the player's position to a new cell that is Up, Down, Left or Right of the cell currently displayed. If the cell has a boundary in that direction, the boundary flashes and the position does not change. If there is not a boundary, the position is updated and the new cell is displayed on the micro:bit.  Directions are chosen from a list. The choices include: UP, DOWN, LEFT and RIGHT.

The move block is used over and over again until the player finds their way to the exit.

![The breadcrumbs block](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/breadcrumbs_block.png)

### maze.displayCrumbs(Crumbstatus.ON) 
turns the display of "breadcrumbs" on or off. Internally, the custom code conditions a flag to indicate when a player has visited a cell. The player can use this function to tell the code whether to display the "breadcrumb" the next time the player visits that cell.  The Crumbstatus is chosen from a list. The choices are: ON and OFF. Your code can test the setting of this flag with the showingBreacdcrumbs() function, described below.

![The showing breadcrumbs block](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/showingBreadcrumbs.png)

### maze.showingBreadcrumbs() 
is a reporter block that returns a true-false value. It tests the value that the displayCrumbs() block sets.

## How Cells of the Maze are Displayed

Think of a cell as one spot, or "room" in the maze. If you were walking along a corridor in a real maze, a cell would be the part of the floor where the path turns a corner, or hits a dead end, or where it intersects with another path. The micro:bit displays one cell at a time. It shows the corridor walls at that location. If you try moving toward a wall, the wall will flash. If there is not a wall, it means you can move in that direction.

#### The Entrance
The first cell you see in a new maze is the entrance. It has a double wall on the left side, and looks like this:

![The maze entrance](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/Entrance.jpg)

You can only move to the right from the entrance cell. What you see next might any one of the following examples:

#### Corridor
![A corridor cell](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/MoveRight.jpg)

A corridor has walls on opposing sides, but allows movement in the other two directions.

#### Turn
![A corridor cell](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/turn.jpg)

A turn cell has walls on two sides of one corner, but allows movement in the other two directions.

#### Intersection
![A corridor cell](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/branch.jpg)

An intersection cell allows movement in more than two directions.  Single dots indicate corners of the cell that have no walls touching them. The path in the example shown above continues in three directions. Deeper into the maze, you might find cells that have no walls, in which case you can move in all four directions.

#### Breadcrumbs
![A corridor cell](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/crumb.jpg)

As you leave a cell that you have visited, the maze automatically marks it with a "breadcrumb". Your code can use the displayCrumbs() block to show or hide these markers. If the display of breadcrumbs is turned on, players will see a dot in the center of a cell the next time they visit the cell.

#### The Exit
![A corridor cell](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/Exit.jpg)

This cell is the players' goal!  It is the end of the maze. When players see this, it means they have solved the maze. A double right-side line distinguishes the exit from the other cells.

#### Terminus

I will let you imagine what a terminus cell looks like. It has three walls, and only lets you move back out the same way you came in.  Better yet, use the blocks to create your own maze game then play it. You'll encounter plenty of terminus cells as you virtually "wander around" in there.

## These blocks are tools for Makers

The blocks are here for you, the code writer, to create a game with a micro:bit. Think of the blocks like a ball. The fun begins when you take it out and play with it! 

Make a game controller and write some code that lets players tell the micro:bit which way they want to move in the maze. Use these blocks to create a maze and to transmit the players' directions.

Here is a link to an article showing an example of how I made a maze game using the blocks. It describes assembly of a game player console and gives the code that interacts with the player.  [https://iowadave.github.io/pxt-makerbit-maze](https://iowadave.github.io/pxt-makerbit-maze)

I hope you will find a way to use these blocks in a maze game that you invent. There are some ideas for embellishment in that link mentioned above. 

Hint: small mazes are trivially easy to solve. Use small dimensions to develop your code, test it, and show players how your game works. Larger mazes can be quite interesting and may take some time to solve. You might like it!

## Edit this project ![Build status badge](https://github.com/iowadave/pxt-maze/workflows/MakeCode/badge.svg)

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/iowadave/pxt-maze** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
