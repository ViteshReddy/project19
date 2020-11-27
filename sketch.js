var PLAY = 1;
var END = 0;
var gameState = PLAY;

var run, run_running, run_collided;
var ground, invisibleGround, groundImage;

var sunGroup, sunImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  run_running =   loadAnimation("run1.png","run2.png","run3.png","run4.png","run5.png","run6.png","run7.png","run8.png","run9.png","run10.png","run11.png");run_collided = loadAnimation("fall.png");
  
 
  groundImage = loadImage("ground2.png");
  
  sunImage = loadImage("sun.jpg");
  
  
 
  obstacle1 = loadImage("peel.png");
  obstacle2 = loadImage("bottle.jfif");

    
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
 
  run = createSprite(50,180,20,50);
 
  run.addAnimation("running", run_running); 
   run.addAnimation("collided", run_collided);
  run.scale = 0.5;
 
 
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  sunGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(255);
  //run.debug = true;
  
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
       ground.velocityX = -(6 + 3*score/100);
       if (ground.x < 0){
      ground.x = ground.width/2;
    }
    score = score + Math.round(getFrameRate()/60);
    
   
  
  
 
      if(keyDown("up") && run.y >= 140) {
      run.velocityY = -12;
    }
  
    run.velocityY = run.velocityY + 0.8
  
   
  
    run.collide(invisibleGround);
    spawnSuns();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(run)){
        gameState = END
         run.changeAnimation("collided",run_collided );
   
    }
  }
   if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
       
    //set velcity of each game object to 0
    ground.velocityX = 0;
    run.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    sunGroup.setVelocityXEach(0);
    
    //change the trex animation
     
 
     
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    sunGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnSuns() {
 
  if (frameCount % 200 === 0) {
    var sun = createSprite(600,120,40,10);
    sun.y = Math.round(random(0,60));
    sun.addImage(sunImage);
    sun.scale = 0.5; 
    sun.velocityX = -3;
    
     
    sun.lifetime = 200;
    
    //adjust the depth
    sun.depth = run.depth;
    run.depth = run.depth + 1;
    

    sunGroup.add(sun);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  sunGroup.destroyEach();
  
  run.changeAnimation("running",run_running);
  
  score = 0;
  
}