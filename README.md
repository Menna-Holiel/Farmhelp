##### 1+1=10
#### Project summary
- [The issue we are hoping to solve](#the-issue-we-are-hoping-to-solve)
  - [How our technology solution can help](#how-our-technology-solution-can-help)
  - [Our idea](#our-idea)
- [Technology implementation](#technology-implementation)
  - [IBM watsonx product(s) used](#ibm-watsonx-products-used)
  - [Other IBM technology used](#other-ibm-technology-used)
  - [Solution architecture](#solution-architecture)
- [Presentation materials](#presentation-materials)
  - [Solution demo video](#solution-demo-video)
  - [Project development roadmap](#project-development-roadmap)
- [Additional details](#additional-details)
  - [How to run the project](#how-to-run-the-project)
 

### The issue we are hoping to solve
Farmers face big challenges from unexpected weather events like floods and droughts,
which can damage crops and lower productivity. On top of that, crops might not grow well
if their environment (like soil moisture, temperature, or humidity) isn’t right. 
Farmers need better information to make decisions about planting and taking care of their crops

### How our technology solution can help

Farmhelp predicts Floods and drought events and recommends crops using historical data.

### Our idea
Farmhelp is a website developed to help farmers predict floods and droughts while recommending the best crops to plant. It uses two AI models: the Flood Prediction Model and the Drought Prediction Model. 
The flood model uses a method called the Support Vector Machine (SVM) Classifier and is trained using past data from the mPing Flood dataset, which helps it predict when and where floods might happen. The drought model uses a Random Forest Classifier and is trained on the U.S. Drought Monitor dataset to predict when droughts might occur. These AI models take information like state and time from the farmer and give predictions about Risk level flood and drought.
Farmhelp doesn't just rely on predictions based on historical weather data; it also uses sensors to get real-time data about the crop’s environment. The sensors check important environmental factors like: soil moisture, temperature and humidity.
based on this data our wesite provide the farmer with crops that it sutible to plant
In addition to predicting floods and droughts, Farmhelp offers crop recommendations. Based on the predictions, it suggests crops that are better suited to upcoming weather conditions. For example, if a drought is expected, the system might recommend drought-resistant crops. If flooding is predicted, it could suggest crops that can handle more water or recommend planting at a different time. 
Farmhelp is designed to be a complete solution for farmers. It helps them plan ahead by predicting weather risks using past data while also keeping them informed about the real-time conditions of their crops. With this combination of AI predictions and real-time monitoring, Farmhelp gives farmers the tools they need to make smarter decisions and avoid crop losses. It removes the guesswork from farming, giving farmers reliable, data-based insights into when to plant, which crops to grow.
By using this technology, farmers can better protect their crops from unexpected weather events and ensure they are growing in the best possible conditions. Overall, Farmhelp helps farmers increase their yield, reduce losses, and manage their farms more effectively, leading to better results in the long term. It combines historical weather data with real-time monitoring to offer a solution that helps farmers deal with unpredictable weather and make better farming decisions.
Farmhelp is built using the MERN stack (MongoDB, Express, React, Node.js) with two main backend servers: AI Models and Crop Recommendations Server: Handles requests related to predictions and crop recommendations based on user inputs.
Serial Server: Processes real-time data from the sensors (temperature, soil moisture, humidity) using Socket.io

### Technology implementation

### IBM watsonx product(s) used
watsonx.ai:
We used watsonx.ai to build two AI models:
Flood Prediction Model: This model uses a Support Vector Machine (SVM) Classifier, trained on the mPing Flood dataset, to predict flood risks.
Drought Prediction Model: This model uses a Random Forest Classifier, trained on the U.S. Drought Monitor dataset, to predict drought risks.

### Other IBM technology used
Watson Machine Learning: 
We used Watson Machine Learning to automate the training, tuning, and deployment of our flood and drought prediction models, 
ensuring optimal performance predictions.

### Solution architecture
![Solution_architecture](Solution architecture.png)
1.Farmers input state and other date.
2.AI models predict flood and drought risks.
3.The website gives the farmer crop recommendations based on that weather risk
3.Sensors provide real-time environmental conditions and return the sutible crops.


### Presentation materials
 
### Solution demo video
https://drive.google.com/file/d/1991VjX2YUtD71Vx348JvLNkD-jubaYyI/view?usp=drive_link

### Project development roadmap
### The project currently does the following things.
The project currently does the following things:
Flood Risk Prediction
Drought Risk Prediction
Recommend crops can plant in this flood and drought risk
Sensors provide real-time environmental conditions and return the sutible crops
In the future we plan to:
Expand the dataset by including more regions and climatic factors to improve the accuracy of the flood and drought predictions.
Advanced Crop Management: Incorporate more sensor data (such as nutrient levels) to provide precise recommendations for crop watering, fertilization, and pest control, enhancing overall agricultural efficiency.
![Roadmap ](Roadmap Timeline.png)
### Additional details
### How to run the project
1.Clone the repository.
2.Install the necessary dependencies:
npm install express mongoose cors serialport socket.io xmlhttprequest
3.Configure MongoDB and the backend connection settings.
4.Start the backend server:
npm start
4.Start the serial server:
npm start
5.Start the frontend:
npm start
6.Ensure sensors are connected and transmitting data via Socket.io.



 

