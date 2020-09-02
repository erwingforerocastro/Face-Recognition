# -*- coding: utf-8 -*-
"""
Created on Tue Sep  1 15:48:42 2020

@author: Erwing_fc
"""

#librerias necesarias
import cv2
import numpy as np
import face_recognition
import os
from datatime import datetime

#variables 
path = 'ImagesAttendance'
images = []
classImages = []
dirFiles = os.listdir(path)

#asignamos las imagenes y etiquetas
for file in dirFiles:
    img_temp = cv2.imread(f'{path}/{file}')
    images.append(img_temp)
    classImages.append(os.path.splitext(file)[0])
    
#funcion para codificar los 128 puntos faciales de los rostros de las imagenes
def findEncodings(images):
    
    encodeList = []
    
    for img in images:
        
        img_temp = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encoded = face_recognition.face_encodings(img_temp)[0]
        encodeList.append(encoded)
        
    return encodeList

def markAttendance(name):
    with open('Attendance.csv','r+') as f:
        
        myDataList = f.readlines()
        nameList = []
        
        for line in myDataList:
            entry = line.split(',')
            nameList.append(entry[0])
            
        if name not in nameList:
            now = datetime.now()
            dtString = now.strftime('%H:%M:%S')
            f.writelines(f'\n{name},{dtString}')

encodeListImages = findEncodings(images)
print('Codificación completa')

#capturamos la imagen
cap = cv2.VideoCapture(0)

while True:
    #capturar la imagen
    success, img = cap.read()
    #convertir para usar
    img_res = cv2.resize(img, (0,0),None,0.25,0.25)
    img_res = cv2.cvtColor(img_res, cv2.COLOR_BGR2RGB)
    
    #localización y codificación, de todas las caras
    facesLocations = face_recognition.face_locations(img_res)
    facesEncodes = face_recognition.face_encodings(img_res, facesLocations)
    
    for faceEncode, faceLocation in zip(facesEncodes, facesLocations):
         
        matches = face_recognition.compare_faces(encodeListImages,faceEncode) #comparacion entre rostros
        faceDis = face_recognition.face_distance(encodeListImages, faceEncode) #distancia entre rostros
        matchIndex=np.argmin(faceDis)  #menor distancia
        
        #cuadrado del rostro
        y1,x2,y2,x1=faceLocation
        y1,x2,y2,x1=y1*4,x2*4,y2*4,x1*4

        if matches[matchIndex]: #si el rostro con menor distancia y reonocido como verdadero:
            
            name = classImages[matchIndex].upper()  #nombre del reconocido
            
            cv2.rectangle(img, (x1,y1),(x2,y2),(0,255,0),2) #cuadrado delimitador
            cv2.rectangle(img, (x1,y2-35),(x2,y2),(0,255,0),cv2.FILLED) #cuadrado inferior para la etiqueta
            cv2.putText(img, name, (x1+6,y2-6),cv2.FONT_HERSHEY_COMPLEX, 1,(255,255,255),2)
            
        else:
            
            cv2.rectangle(img, (x1,y1),(x2,y2),(255,255,0),2) #cuadrado delimitador
            cv2.rectangle(img, (x1,y2-35),(x2,y2),(255,255,0),cv2.FILLED) #cuadrado inferior para la etiqueta
            cv2.putText(img, "Desconocido", (x1+6,y2-6),cv2.FONT_HERSHEY_COMPLEX, 1,(255,255,255),2)
            
    
    cv2.imshow('WebCam', img)
    cv2.waitKey(1)

