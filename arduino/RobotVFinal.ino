#include <SPI.h>
#include <SoftwareSerial.h>

// nouveau
#define DEBUG true
SoftwareSerial esp8266(4,8);
int senderdata=0;    
String currentLine="";


//position des codeurs
const int codeurD=A1;
const int codeurG=A0;
//moteurs avant
const int avantDroite=5;
const int avantGauche=9;
// moteurs arriére
const int arriereDroite=3;
const int arriereGauche=10;

//Etat des Moteurs
int moteurStateDroite = LOW;             
int moteurStateGauche= LOW;
// Etat des codeurs  
int codeurDState;         
int codeurGState;

int nb_impulsionG=0;
int nb_impulsionD=0;
//pour gerer les rebond;
int gaucheavant=LOW;
int droiteavant=LOW;
int dernierRebondG=0;
int dernierRebondD=0;
int delaisRebond=1;

//pour decripter le message
char g='G';
char d='D';
char a='A';
//reconnaisance message
boolean debut=false;
boolean fin=false;
//pour les déplacement 
//useless


void setup() {
	//new

	Serial.begin(9600);
	esp8266.begin(9600);
	//ancien 
	delay(5000);
	Serial.println("test du port serial");
	//new

	
	// les moteurs
	pinMode(avantDroite, OUTPUT);
	pinMode(avantGauche, OUTPUT);
	pinMode(arriereDroite, OUTPUT);
	pinMode(arriereGauche, OUTPUT);
	//les boutons
	pinMode(codeurD, INPUT);
	pinMode(codeurG, INPUT);
}

void loop() {
    String message="";
    while(message==""){
        sendData("AT+RST",2000,DEBUG); // reset module
        sendData("AT+CIOBAUD=9600",1000,DEBUG);
        sendData("AT+CWMODE=1",1000,DEBUG);
        sendData("AT+CWJAP=\"TP-LINK_7A134E\",\"C27A134E\"",1000,DEBUG);// configure as client
        delay(10000);
        sendData("AT+CIFSR",1000,DEBUG); // get ip address   
        sendData("AT+CIPSTART=\"TCP\",\"192.168.0.100\",80",1000,DEBUG);
        String get = "GET /Projet_tuteure/index.php/arduino HTTP/1.0\r\nHost: 192.168.0.100\r\n\r\n";
        String cmd = "AT+CIPSEND=";
        cmd += get.length();
        sendData(cmd,1000,DEBUG);
        delay(500);
        String reponse=sendData(get,2000,DEBUG);
        delay(5000);
        int debut=reponse.indexOf("@");
        if(debut > 0) {
            int fin=reponse.indexOf("#");
            Serial.println("deb");
            message=reponse.substring(debut+1,fin);
            Serial.println(message);
        }
        delay(1000); 
    }
    
	Serial.println("fin");

	/**
  while (client.available() && fin==false){
    char c = client.read();
    if(c=='#'){
      fin==true;
    }else{
      if(debut==true && fin==false){
        message.concat(c);
      }
      if(c=='@'){
        debut=true;
      }
    }
  }
	 */
	Serial.print("Le message recu est :"+message);

	char *commandes;
	int taille=message.length()+1;
	commandes=(char*)malloc(taille);
	int t=0;
	for(t;t<taille;t++){
		commandes[t]=message.charAt(t);
	}
	//gestion du message
	char c;
	int i=0;
	for(i;i<taille;i++){
		c=commandes[i];
		if(c ==d){
			analogWrite(avantDroite,0);
			analogWrite(avantGauche,225);
			analogWrite(arriereDroite,0);
			analogWrite(arriereGauche,0);
			boolean realiser=false;
			while(realiser!=true){
				// recupere etat bouton dans une variable local
				int lectureG=digitalRead(codeurG);
				if(lectureG!=gaucheavant){
					dernierRebondG=millis();
				}
				//actions avec prise en compte du rebond
				if((millis()-dernierRebondG)>delaisRebond){
					if(codeurGState!=lectureG){
						codeurGState=lectureG;
						if(codeurGState==HIGH){
							nb_impulsionG++;
						}
					}        
				}
				if ( nb_impulsionG==22) {
					analogWrite(avantGauche,0);
					realiser=true;
					nb_impulsionG=0;
				}
				gaucheavant=lectureG;
			}   
		}
		if(c==g){
			analogWrite(avantDroite,225);
			analogWrite(avantGauche,0);
			analogWrite(arriereDroite,0);
			analogWrite(arriereGauche,0);

			boolean realiser=false;
			while(realiser!=true){
				// recupere etat bouton dans une variable local
				int lectureD=digitalRead(codeurD);
				if(lectureD!=droiteavant){
					dernierRebondD=millis();
				}
				//actions avec prise en compte du rebond
				if((millis()-dernierRebondD)>delaisRebond){
					if(codeurDState!=lectureD){
						codeurDState=lectureD;
						if(codeurDState==HIGH){
							nb_impulsionD++;
						}
					}        
				}
				if ( nb_impulsionD==23){
					realiser=true;
					nb_impulsionD=0;
					analogWrite(avantDroite,0);
					analogWrite(avantGauche,0);
					analogWrite(arriereDroite,0);
					analogWrite(arriereGauche,0);

				}
				droiteavant=lectureD;
			}   

		}
		if(c==a){
			analogWrite(avantDroite,255);
			analogWrite(avantGauche,255);
			analogWrite(arriereDroite,0);
			analogWrite(arriereGauche,0);
			boolean finD=false;
			boolean finG=false;
			boolean realiser=false;
			while(realiser!=true){
				// recupere etat bouton dans une variable local
				int lectureG=digitalRead(codeurG);
				int lectureD=digitalRead(codeurD);
				if(lectureG!=gaucheavant){
					dernierRebondG=millis();
				}
				if(lectureD!=droiteavant){
					dernierRebondD=millis();
				}
				//actions avec prise en compte du rebond
				if((millis()-dernierRebondG)>delaisRebond){
					if(codeurGState!=lectureG){
						codeurGState=lectureG;
						if(codeurGState==HIGH){
							nb_impulsionG++;
						}
					}        
				}
				if((millis()-dernierRebondD)>delaisRebond){
					if(codeurDState!=lectureD){
						codeurDState=lectureD;
						if(codeurDState==HIGH){
							nb_impulsionD++;
						}
					}        
				}
				if(nb_impulsionG==22){
					analogWrite(avantGauche,0);
					finG=true;
				}
				if(nb_impulsionD==22){
					analogWrite(avantDroite,0);
					finD=true;
				}
				if ( finD && finG) {
					realiser=true;
					nb_impulsionG=0;
					nb_impulsionD=0;
					if(commandes[i+1]!='A'){
						delay(750);
					}
				}
				gaucheavant=lectureG;
				droiteavant=lectureD;
			}
		}   

	}
	
	delay(10000);
}


String sendData(String command, const int timeout, boolean debug) {
	String response = "";
	esp8266.println(command); // send the read character to the esp8266
	long int time = millis();
	while( (time+timeout) > millis()) {
		while(esp8266.available()) {
			// The esp has data so display its output to the serial window 
			char c = esp8266.read(); // read the next character.
			//        Serial.write(c);
			response+=c;
		}  
	}
	if(debug) {
		Serial.println(response);
	}

	return response;
}

