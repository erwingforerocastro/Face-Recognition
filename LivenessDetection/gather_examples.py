# -*- coding: utf-8 -*-
"""
Created on Wed Oct  7 14:55:45 2020

@author: Erwing_fc
"""

import numpy as np
import argparse
import cv2
import os

#Analizar los argumentos

ap = argparse.ArgumentParser()
ap.add_argument("-i","--input",type=str,required=True,
                 help="ruta de entrada del video")
ap.add_argument("-o", "--output", type=str, required=True,
                help="ruta al directorio de salida de caras recortadas")
ap.add_argument("-d", "--detector", type=str, required=True,
                help="ruta al detector facial de aprendizaje profundo de OpenCV")
ap.add_argument("-c", "--confidence", type=float, default=0.5,
                help="probabilidad mínima de filtrar detecciones débiles")
ap.add_argument("-s", "--skip", type=int, default=16,
                help="# de fotogramas para omitir antes de aplicar la detección de rostros")
args = vars(ap.parse_args())

# se carga el detector facial serializado desde el disco

print("[INFO] cargando Face Detector...")
protoPath = os.path.sep.join([args["detector"], "deploy.prototxt"])
modelPath = os.path.sep.join([args["detector"],
	"res10_300x300_ssd_iter_140000_fp16.caffemodel"])
net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)

# se abre un puntero a la secuencia del archivo de video e inicialice el total de
# número de fotogramas leídos y guardados hasta ahora
vs = cv2.VideoCapture(args["input"])
read = 0
saved = 0

# recorrer los fotogramas de la secuencia del archivo de video

while True:
    # toma el fotograma del archivo
    (grabbed, frame) = vs.read()
    
    # si no se tomo el fotograma, entonces 
    if not grabbed:
        break
    
    # incrementar el número total de fotogramas leídos hasta ahora
    read += 1
    
    # comprobar para ver si debemos procesar este fotograma
    if read % args["skip"] != 0:
        continue
    
    # tomar las dimensiones del fotograma y se construye un blob a partir del fotograma
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
		(300, 300), (104.0, 177.0, 123.0))
    
    # pasar el blob a través de la red y obtener las detecciones y
    # predicciones
    net.setInput(blob)
    detections = net.forward()
    
    # asegúrar de que se haya encontrado al menos una cara
    if len(detections) > 0:
        # se asume que cada imagen tiene solo UNA
        # cara, entonces se encuentra el cuadro delimitador con la mayor probabilidad
        i = np.argmax(detections[0, 0, :, 2])
        confidence = detections[0, 0, i, 2]
        
        # asegúrar de que la detección con la mayor probabilidad también
        # filtra la probabilidad minima que se asigno (lo que ayuda a filtrar
        # detecciones débiles)
        if confidence > args['cofidence']:
            # se calculan las coordenadas (x, y) del cuadro delimitador para
            # el rostro y extraer el ROI del rostro
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h]) #localizacion 
            (X, startY, endX, endY) = box.astype("int") #convierte en entero
            face = frame[startY:endY, startX:endX] #se recorta el fotograma
            
            # se escribe el fotograma en el disco
            p = os.path.sep.join([args["output"],
				"{}.png".format(saved)])
            cv2.imwrite(p, face)
            saved += 1
            print("[INFO] guardada {} en el disco".format(p))
        
    # hacer un poco de limpieza
    vs.release()
    cv2.destroyAllWindows()
    







