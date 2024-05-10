import sys
import pickle
import numpy as np
import json

def amount_classification():
    f = open('../models/amount_clusters.pkl','rb')
    model = pickle.load(f)
    arg = json.loads(sys.argv[1])
    mean = arg['mean']
    prediction = model.predict([[np.log(float(mean))]])
    if prediction == [0]:
        print('High')
    else:
        print('Low')

amount_classification()