import sys
import pickle
import numpy as np
import json

def amount_based_detection():
    arg = json.loads(sys.argv[1])
    amount = arg['amount']
    model_path = arg['model_path']
    f = open(model_path,'rb')
    model = pickle.load(f)

    prediction = model.predict([[np.log(float(amount))]])
    if prediction == [-1]:
        print('Flagged')
    else:
        print('Normal')

amount_based_detection()