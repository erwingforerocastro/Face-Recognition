# -*- coding: utf-8 -*-
"""
Created on Sat Oct 10 13:01:00 2020

@author: Erwing_fc
"""

# configura el backend de matplotlib para que las figuras 
# se puedan guardar en segundo planoconfigura el backend de matplotlib 
# para que las figuras se puedan guardar en segundo plano
import matplotlib
matplotlib.use('Agg')

from pyimagesearch.livenessnet import LivenessNet
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from imutils import paths
import matplotlib.pyplot as plt
import numpy as np
import argparse
import pickle
import cv2
import os

# se construye el analizador de argumentos y analiza los argumentos
ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", required=True,
	help="ruta al conjunto de datos de entrada")
ap.add_argument("-m", "--model", type=str, required=True,
	help="ruta al modelo entrenado")
ap.add_argument("-l", "--le", type=str, required=True,
	help="ruta al codificador de etiquetas")
ap.add_argument("-p", "--plot", type=str, default="plot.png",
	help="ruta a la gráfica de pérdida / precisión de salida")

args = vars(ap.parse_args())


