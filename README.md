# Stealthy Snake

A procedurally generated game first written for the CodeDay: Portland event in February of 2015, using a custom-built JavaScript game engine: Argyle. 

## Game

Sneak around the enemies to make your way to the teleporter, without being seen, to get to the next level. Walking over the enemies increases your score and moving speed, but also makes you longer. The resulting tail can be seen by enemies, so plan carefully, and see how long your tail can get!

Play [here](http://gl0vgames.github.io/SneakySnake/)!

## Dev

Clone the repo first.

1. run `npm i` to get all the packages
1. build for development with `npm start` - this will compile the typescript and start the project on localhost:3000 with browsersync
1. build for prod with `npm run prod` - this cleans the output folder; compiles, rolls up, uglifies, and minifies everything; moves it all into the dist folder; copies a basic express server over; and starts up the server on localhost:4000 (this allows dev and prod versions to be running simultaneously)

## Our Team

**Graham Barber**: Design, Production Workflow, Project Management <br />
**Ben Arvey**: Programmer <br />
**Damian Kulp**: Programmer <br />
**Mikey Moreland**: Art <br />
**Dylan Shumway**: Design, Sound/Music, Legal Things
