// Board
const tileSize = 32;
const rows = 16;
const columns = 16;

let board;

const boardWidth = tileSize * columns // This means 32 * 16
const boardHeight = tileSize* rows; //  This means 32 * 16

let context;



// Ship
const shipWidth = tileSize*2;
const shipHeight = tileSize;
const shipX = tileSize * columns /2 - tileSize; // this is to get the ship in the column #8 of the board 
const shipY = tileSize * rows - tileSize*2; // This is to get the ship to the first two lines at the bottom

const ship = {
    x : shipX,
    y : shipY,
    width: shipWidth,
    height: shipHeight
}
let shipImg;
const shipVelocityX = tileSize; // Speed of the ship in X positions





//Alien Creation
let alienArray = [];
const alienWidth = tileSize * 2;
const alienHeight = tileSize; 
const alienX = tileSize;
const alienY = tileSize;


let alienVelocityX = 1; //alien move speed
let alienImg;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // Number of aliens defeated


//Bullets
let bulletArray = [];
let bulletVelocityY = -10; // Bullet Speed

//Score
let score = 0;
let gameOver = false;

//Main

window.onload = () =>{
    board = document.getElementById('game-board')
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d'); // This is for drawing in the board

    // // Draw the initial ship but, we will use the picture instead
    // context.fillStyle= "green";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //Load Images

    //Ship Images
    shipImg = new Image();
    shipImg.src = 'spaceimg/ship.png'
    shipImg.onload = () =>{
         context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    
    //Alien Images
    alienImg = new Image();
    alienImg.src = 'spaceimg/alien.png'
    createAlien();


    requestAnimationFrame(update)
    document.addEventListener('keydown', moveShip); // Input Controls Event Listener
    document.addEventListener('keyup', shoot);  // shoot Event Listener
}














// Redrawing the frame in this update Function

const update = () =>{
    requestAnimationFrame(update) // update the frames
    if(gameOver){
        return;
    }


    // clear the canvas
    context.clearRect(0,0, board.width, board.height) 

    //ship draw  
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //alien draw 
    for (let i = 0 ; i < alienArray.length; i++){
        let alien = alienArray[i]

        if(alien.alive){
            alien.x += alienVelocityX;
            

            //if alien touches the end of the board
            if(alien.x + alien.width >= board.width || alien.x <= 0){
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;

                // move aliens one row closer
                for (j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            }

            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height)

            if(alien.y >= ship.y){
                gameOver = true;
            }
        }
    }

    //Bullets draw update
    for(let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i]
        bullet.y += bulletVelocityY;
        context.fillStyle= 'green'
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

        //bullet collision with aliens
        for(let j = 0; j < alienArray.length; j++){
            let alien = alienArray[j]
            if(!bullet.used && alien.alive && detectCollision(bullet,alien)){
                bullet.used = true;
                alien.alive = false;
                alienCount --;
                score += 100;
            }
        }
    }

    //clear bullet, to avoid acumulation and game performance
    while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
        bulletArray.shift(); // removes the first element of the array
    }


    //Add next Level
    if(alienCount == 0 ){
        //increase the number of aliens in columns and rows by 1 
        alienColumns = Math.min(alienColumns + 1, columns/2 -2); //cap at 16/2 -2 = 6
        alienRows = Math.min(alienRows + 1, rows-4);  //cap at 16-4 = 12
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2; //this is for increase  speed to  the right
        }
        else {
            alienVelocityX -= 0.2; //this is for increase  speed to  the left
        }
        alienArray = [];
        bulletArray = [];
        createAlien();
    }


    context.fillStyle= 'white'
    context.font = '16px courier'
    context.fillText(score, 5, 20)
    
}














//  moving the ship
const moveShip = (e) =>{
    if(gameOver){
        return;
    }

    if (e.code == 'ArrowLeft' && ship.x - shipVelocityX >= 0){
        ship.x -=  shipVelocityX // Move left one tile
    } else if (e.code == 'ArrowRight' && ship.x + shipVelocityX + shipWidth <= board.width){
        ship.x +=  shipVelocityX // Move Right one tile
    }
}


// Creating the alien
const createAlien = () =>{
    for(let c = 0; c < alienColumns; c++){
        for (let r = 0; r < alienRows; r++){
            let alien ={
                img: alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive: true
            }

            alienArray.push(alien);
        }
    }

    alienCount = alienArray.length;
}



//shooting aliens Function
const shoot = (e) =>{
    if(gameOver){
        return;
    }

    if(e.code == 'Space'){
        //shoot
    let bullet = {
        x: ship.x + shipWidth*15/32,
        y: ship.y,
        width: tileSize/8,
        height: tileSize/2,
        used: false // if the bullet touches an alien
    }
    bulletArray.push(bullet);

}
}


//Detecting the collision

const detectCollision = (a,b) =>{
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
