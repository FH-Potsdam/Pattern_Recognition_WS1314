import sojamo.drop.*;
import processing.pdf.*;

SDrop drop;
Table table;

String dataFilename = "";
int N_DATASETS = 1; // table columns to be visualized, if more that 1, pixelgroups will be generated
int nTableRows = -1;
boolean CROP_DATASET = false;
int nTableRowsToDisplay = -1; // if we want to only display parts of the data, edit this accordingly 

int PIXEL_RATIO = 2; // 1 = normal, 2 = retina

int PIXEL_W = 4;
int PIXEL_H = 4;
int PIXELS_PER_ROW = 40;

boolean DRAW_HORIZONTAL_DIVIDERS = false;
boolean DRAW_VERTICAL_DIVIDERS = false;
int HORIZONTAL_DIV_H = 2;
int VERTICAL_DIV_W = 1;

int C_DIVIDERS = color(0); // color for dividers

PGraphics viz;
int vizW, vizH; // will be calculated

// TODO
boolean BLIND_MODE = false; // disables screen display, for very large images, not implemented, yet

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SETUP
 */

void setup(){
  size(350, 768);
  drop = new SDrop(this);
  showStartScreen();
}

void showStartScreen(){
  background(12);
  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Drag’n’Drop a csv-File here", width/2, height/2);
  text("Press “s” to save image", width/2, height/2+20);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DRAW
 */

void draw(){
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CALCULATE VIZ SIZE
 * Calculates vizW and vizH
 */
void calculateVizSize(){
  vizW = PIXELS_PER_ROW*PIXEL_W*PIXEL_RATIO; // visualization width
  if(DRAW_VERTICAL_DIVIDERS){
    vizW += (PIXELS_PER_ROW-1)*VERTICAL_DIV_W*PIXEL_RATIO;
  }
  int nColumns = nTableRowsToDisplay / PIXELS_PER_ROW;
  // add last line to columns
  if(nTableRowsToDisplay % PIXELS_PER_ROW != 0){
    nColumns++;
  }  
  vizH = nColumns*PIXEL_H*PIXEL_RATIO;
  if(DRAW_HORIZONTAL_DIVIDERS){
    vizH += (nColumns-1)*HORIZONTAL_DIV_H*PIXEL_RATIO;
  }
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GENERATE PIXELMAP
 */

void generatePixelmap(){
  calculateVizSize();
  println("Visualization w: " + vizW + ", h: " + vizH);
  viz = createGraphics(vizW, vizH);
  viz.beginDraw();
  viz.noStroke();
  int x=0, y=0;
  int pixelsPerRowCount = 0;
  for(int i=0; i<nTableRowsToDisplay; i++){
    pixelsPerRowCount++;
    if(pixelsPerRowCount > PIXELS_PER_ROW){
      x = 0;
      y+= PIXEL_H*PIXEL_RATIO;
      if(DRAW_HORIZONTAL_DIVIDERS){
        viz.fill(C_DIVIDERS);
        viz.rect(x, y, vizW, HORIZONTAL_DIV_H*PIXEL_RATIO);
        y+= HORIZONTAL_DIV_H*PIXEL_RATIO;
      }
      pixelsPerRowCount = 1;
    }
    color c = color(map(table.getInt(i, "data1"), 0, 9, 0, 255));
    viz.fill(c);
    viz.rect(x, y, PIXEL_W*PIXEL_RATIO, PIXEL_H*PIXEL_RATIO);
    x += PIXEL_W*PIXEL_RATIO;
    if(DRAW_VERTICAL_DIVIDERS && pixelsPerRowCount <= PIXELS_PER_ROW-1){
      viz.fill(C_DIVIDERS);
      viz.rect(x, y, VERTICAL_DIV_W*PIXEL_RATIO, PIXEL_H*PIXEL_RATIO);
      x += VERTICAL_DIV_W*PIXEL_RATIO; 
    }
  }
  viz.endDraw();
  image(viz, 0, 0);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ KEY PRESSED
 */
void keyPressed(){
  switch(key){
    case 's':
      String imgFilename = dataFilename.substring(0, dataFilename.length()-4) + getTimestamp("_viz_", ".png");
      println("Trying to save to " + imgFilename);
      //PImage viz = createImage(vizW, vizH);
      //viz.copy();
      //saveFrame(imgFilename);
      //PImage img = createImage(vizW, vizH);
      
      viz.save(imgFilename);
      break;
  }
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ IMPORT DATA
 */
void importData(){
  table = loadTable(dataFilename, "header");

  nTableRows = table.getRowCount();
  if(!CROP_DATASET){
    nTableRowsToDisplay = nTableRows;   
  }
  else{} // use nTableRowsToDisplay (definition on top)
  println(nTableRows + " total rows in table"); 

  /*
  for (TableRow row : table.rows()) {
    int d1 = row.getInt("data1");
    int d2 = row.getInt("data2");
    int d3 = row.getInt("data3");
    println(d1 + ", " + d2 + ", " + d3);
  }
  */
}

/**
 * * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ IMPORT DATA
 * Returns a String with the current timestamp surrounded by begin and end
 * e.g. begin = "data_", end = ".csv"
 */
public String getTimestamp(String begin, String end){
  return begin + year() + "-" + month() + "-" + day() + "_" 
    + hour() + "-" + minute() + "-" + second() + end;
}

void dropEvent(DropEvent theDropEvent) {
  File f = theDropEvent.file();
  if(f.isFile()) {
    dataFilename = f.getAbsolutePath();
    println("File dropped: " + dataFilename);
    importData();
    generatePixelmap();  
  }
}

