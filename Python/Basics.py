# -*- coding: utf-8 -*-
"""
Created on Tue Sep  1 14:21:18 2020

@author: Erwing_fc
"""

#librerias necesarias
import cv2
import numpy as np
import face_recognition

#imagen de referencia
imgElon = face_recognition.load_image_file('ImagesBasic/Elon1.jpg')
imgElon = cv2.cvtColor(imgElon,cv2.COLOR_BGR2RGB)

#imagen de test
imgTest = face_recognition.load_image_file('ImagesBasic/Elon2.jpg')
imgTest = cv2.cvtColor(imgTest,cv2.COLOR_BGR2RGB)

#localizar el rostro
faceLocation = face_recognition.face_locations(imgElon)[0] # retorna @tuple (arriba, derecha, abajo, izquierda)
encodedElon = face_recognition.face_encodings(imgElon)[0]  
cv2.rectangle(imgElon, (faceLocation[3],faceLocation[0]),(faceLocation[1],faceLocation[2]),(255,0,255),2)

faceLocationT = face_recognition.face_locations(imgTest)[0] # retorna @tuple (arriba, derecha, abajo, izquierda)
encodedElonT = face_recognition.face_encodings(imgTest)[0]  
cv2.rectangle(imgTest, (faceLocationT[3],faceLocationT[0]),(faceLocationT[1],faceLocationT[2]),(255,0,255),2)

#resultados
result = face_recognition.compare_faces([encodedElon],encodedElonT)
faceDis = face_recognition.face_distance([encodedElon], encodedElonT)

#observar las imagenes
cv2.imshow( 'Elon musk',imgElon)
cv2.imshow( 'Elon musk test',imgTest)
cv2.waitKey(0)