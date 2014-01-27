import java.io.BufferedWriter;
import java.io.FileWriter;

int nDatasets = 3000;
int[] data1, data2, data3;
int ranMin = 0, ranMax = 9;

String anomalyLog = "";

void generateData(){
  data1 = new int[nDatasets];
  data2 = new int[nDatasets];
  data3 = new int[nDatasets];
  
  anomalyLog += "#General\n\n";
  anomalyLog += "Base-Noise-Min: " + ranMin + "\n";
  anomalyLog += "Base-Noise-Max: " + ranMax + "\n";
  
  for(int i=0; i<nDatasets; i++){
    data1[i] = (int)random(ranMin, ranMax);
    data2[i] = (int)random(ranMin, ranMax);
    data3[i] = (int)random(ranMin, ranMax);
  }
  anomalyLog += "#Data1\n\n";
  for(int i=0; i<0; i++){
    ;
  }
  //anomalyLog += addRandomRepetition(data1, ranMin, ranMax, 7, 40);
  for(int i=0; i<1; i++){
    ;    
  }
  anomalyLog += addRandomRhythm(data1, 7, 7, 9, 9, false);
  //anomalyLog += addRandomRhythm(data1, 17, 17, 5, 5, false);
  //anomalyLog += addRandomRhythm(data1, 31, 31, 9, 9, false);
}

String addRandomRhythm(int[] data, int ranStepsMin, int ranStepsMax, int ranValueMin, int ranValueMax, boolean hasHole){
  int steps = (int)random(ranStepsMin, ranStepsMax);
  int iStart = (int)random(0, steps);
  int val = (int)random(ranValueMin, ranValueMax);
  for(int i=iStart; i<data.length; i+=steps){
    data[i] = val;
  }
  String ret = "##Adding Rhythm\n";
  ret += "Steps: " + steps + "\n";
  ret += "Start-Index: " + iStart + "\n";
  ret += "Value: " + val + "\n";
  ret += "\n";
  return ret;
}

/**
 * Creates Repeting data on a random location in the array
 * minValue: minimum value which is repeated
 * maxValue: maximum value which is repeated
 * minRepetition: minimum number of repetitions
 * maxRepetition: maximum number of repetitions
 */
String addRandomRepetition(int[] data, int minValue, int maxValue, int minRepetitions, int maxRepetitions){
  int r = (int)random(minRepetitions, maxRepetitions);
  int iStart = (int)random(0, data.length-1-r);
  int val = (int)random(minValue, maxValue);
  for(int i=0; i<r; i++){
    data[iStart+i] = val;
  }
  String ret = "##Adding Repetition\n";
  ret += "Repetitions: " + r + "\n";
  ret += "Start-Index: " + iStart + "\n";
  ret += "Value: " + val + "\n";
  ret += "\n";
  return ret;
}

void setup(){
  generateData();
  
  String timestamp = getTimestamp("", "");
  String outFilename = "data_" + timestamp + ".csv";
  String logFilename = "data_" + timestamp + "_log.md";
  String out = "data1,data2,data3\n";
  for(int i=0; i<nDatasets; i++){
    out += data1[i] + "," + data2[i] + "," + data3[i] + "\n";   
  } 
  appendTextToFile(outFilename, out);
  // write log
  appendTextToFile(logFilename, anomalyLog);
}

/**
 * Appends text to the end of a text file located in the data directory, 
 * creates the file if it does not exist.
 * Can be used for big files with lots of rows, 
 * existing lines will not be rewritten
 */
void appendTextToFile(String filename, String text){
  File f = new File(dataPath(filename));
  if(!f.exists()){
    createFile(f);
  }
  try {
    PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(f, true)));
    out.println(text);
    out.close();
  }catch (IOException e){
      e.printStackTrace();
  }
}

/**
 * Creates a new file including all subfolders
 */
void createFile(File f){
  File parentDir = f.getParentFile();
  try{
    parentDir.mkdirs(); 
    f.createNewFile();
  }catch(Exception e){
    e.printStackTrace();
  }
}  

/**
 * Returns a String with the current timestamp surrounded by begin and end
 * e.g. begin = "data_", end = ".csv"
 */
public String getTimestamp(String begin, String end){
  return begin + year() + "-" + month() + "-" + day() + "_" 
    + hour() + "-" + minute() + "-" + second() + end;
}
