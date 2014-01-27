/* @pjs preload="latest.png"; */

PImage img;
int brushD = 20;
color c = color(255, 0, 0, 10);
boolean drawn = false;
PGraphics pg;

void setup(){
  size(600, 600);
  
  img = loadImage("latest.png");
  
  pg = createGraphics(width, height, P2D);
  pg.background(255);
  pg.image(img, 0, 0);
  pg.fill(c);
  pg.noStroke();
}

void draw(){
  //if(!drawn){image(img, 0, 0);}
  image(pg);
}

void mousePressed(){
  paint();
}

void mouseDragged(){
  paint();
}

void paint(){
  pg.ellipse(mouseX, mouseY, brushD, brushD);
}



