#include <DHT.h>

#define DHTPIN 2        
#define DHTTYPE DHT22   
#define SOIL_PIN A1     
#define SOIL_WET 300    
#define SOIL_DRY 1023   


DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);  
  dht.begin();         
}

void loop() {
  
  delay(2000);
  float h = dht.readHumidity();         
  float t = dht.readTemperature();      
  int soilMoistureValue = analogRead(SOIL_PIN);  
  int soilMoisturePercent = map(soilMoistureValue, SOIL_DRY, SOIL_WET, 0, 100);
  soilMoisturePercent = constrain(soilMoisturePercent, 0, 100);
  
 
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  
  Serial.print(t);
  Serial.print(",");
  Serial.print(h);
  Serial.print(",");
  Serial.println(soilMoisturePercent);
}