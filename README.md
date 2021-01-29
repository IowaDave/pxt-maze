# pxt-maze
## Create interactive maze games for the BBC micro:bit.

Give the MakeCode editor a set of custom blocks designed to create and interact with a virtual maze.

> Open this page at [https://iowadave.github.io/pxt-maze/](https://iowadave.github.io/pxt-maze/)

## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/iowadave/pxt-maze/raw/master/.github/makecode/maze_blocks.png)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/iowadave/pxt-maze** and import

## About the Blocks

### maze.newMaze(rows, columns) 
creates a grid of "cells" arranged in rows a columns. Visualize it as a rectangular maze. The entrance is at the upper-left corner. The exit is at the lower-right corner.

The minimum number of rows or columns is two, which means that the maze can be as small as 2 rows of 2 cells each: maze.newMaze(2,2);

It can be as large as 15 rows of 15 cells each: newMaze(15,15);

It does not have to be square; the row and column and column numbers can be different: newMaze(8, 10);

After the new maze has been created, this function actomatically displays the cell at the entrance to the maze. The display appears on the LED panel of the micro:bit.

### maze.maximumDimension() 
is a reporter block that gives the maximum number of columns or rows. If you write a game that lets the player select a number of rows or columns, you may use this block to compare and help ensure that the number does not exceed the maximum. If you choose to edit these custom blocks, keep in mind to edit both the newMaze() function and the maximumDimension() function so they both use the same maximum value. 

### maze.move(Directions.UP) 
attempts to move the player's position to a new cell that is Up, Down, Left or Right of the cell currently displayed. If the cell has a boundary in that direction, the boundary flashes and the position does not change. If there is not a boundary, the position is updated and the new cell is displayed on the micro:bit.  Directions are chosen from a list. The choices include: UP, DOWN, LEFT and RIGHT.

The move block is used over and over again until the player finds their way to the exit.

### maze.displayCrumbs(Crumbstatus.ON) 
turns the display of "breadcrumbs" on or off. Internally, the custom code conditions a flag to indicate when a player has visited a cell. The player can use this function to tell the code whether to display the "breadcrumb" the next time the player visits that cell.  The Crumbstatus is chosen from a list. The choices are: ON and OFF.

## These blocks are tools

The blocks are here for you, the code writer, to create a game with a micro:bit. Think of the blocks like a ball, which does nothing until you take it out and play with it. 

## Edit this project ![Build status badge](https://github.com/iowadave/pxt-maze/workflows/MakeCode/badge.svg)

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/iowadave/pxt-maze** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
