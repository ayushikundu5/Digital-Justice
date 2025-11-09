import joblib

model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

def predict_winner(plaintiff, defendant, evidence):
    text = f"{plaintiff} {defendant} {evidence}"
    X = vectorizer.transform([text])
    pred = model.predict(X)[0]
    return pred
