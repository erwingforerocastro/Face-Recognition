# -*- coding: utf-8 -*-
"""
Created on Thu Oct  8 10:28:17 2020

@author: Erwing_fc
"""

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import BatchNormalization, Conv2D, MaxPooling2D, Activation, Flatten, Dropout, Dense
from tensorflow.keras import backend as K


class LivenessNet:
	
    @staticmethod
    def build(width, height, depth, classes):
		# inicializar el modelo junto con la forma de entrada que se
		# "los ultimos canales" y la dimensión de los canales en sí
		model = Sequential()
		inputShape = (height, width, depth)
		chanDim = -1

		# si se usa "primeros canales", se actualiza la forma de entrada
		# y dimensión de canales
		if K.image_data_format() == "channels_first":
			inputShape = (depth, height, width)
			chanDim = 1

		# primer conjunto CONV => RELU => CONV => RELU => Conjunto de capas POOL
		model.add(Conv2D(16, (3, 3), padding="same",
								input_shape=inputShape))
		model.add(Activation("relu"))
		model.add(BatchNormalization(axis=chanDim))
		model.add(Conv2D(16, (3, 3), padding="same"))
		model.add(Activation("relu"))
		model.add(BatchNormalization(axis=chanDim))
		model.add(MaxPooling2D(pool_size=(2, 2)))
		model.add(Dropout(0.25))

		# segundo conjunto  CONV => RELU => CONV => RELU => Conjunto de capas POOL
		model.add(Conv2D(32, (3, 3), padding="same"))
		model.add(Activation("relu"))
		model.add(BatchNormalization(axis=chanDim))
		model.add(Conv2D(32, (3, 3), padding="same"))
		model.add(Activation("relu"))
		model.add(BatchNormalization(axis=chanDim))
		model.add(MaxPooling2D(pool_size=(2, 2)))
		model.add(Dropout(0.25))

		# primer (y único) conjunto de FC => capas RELU
		model.add(Flatten())
		model.add(Dense(64))
		model.add(Activation("relu"))
		model.add(BatchNormalization())
		model.add(Dropout(0.5))

		#clasificador softmax
		model.add(Dense(classes))
		model.add(Activation("softmax"))

		return model
