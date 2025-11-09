import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# -----------------------------
# Step 1: Load or create dataset
# -----------------------------

# Example dataset (you can replace this with a CSV later)
data = [
    {
        "plaintiff": "The tenant claims the landlord failed to return the deposit.",
        "defendant": "The landlord argues the deposit was used for damages.",
        "evidence": "Lease agreement and damage photos.",
        "verdict": "Defendant"
    },
    {
        "plaintiff": "The worker was not paid overtime for extra hours.",
        "defendant": "The company says overtime was compensated with leave.",
        "evidence": "Salary slips and attendance sheet.",
        "verdict": "Plaintiff"
    },
    {
        "plaintiff": "The buyer complains the product was defective.",
        "defendant": "The seller claims the buyer misused it.",
        "evidence": "Purchase receipt and defect report.",
        "verdict": "Plaintiff"
    },
    {
        "plaintiff": "The student accuses the teacher of unfair grading.",
        "defendant": "The teacher insists grades were based on merit.",
        "evidence": "Exam scripts and grading policy.",
        "verdict": "Neutral"
    }
]

df = pd.DataFrame(data)

# Combine text columns for ML input
df["text"] = df["plaintiff"] + " " + df["defendant"] + " " + df["evidence"]

X = df["text"]
y = df["verdict"]

# -----------------------------
# Step 2: Split into train/test
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# -----------------------------
# Step 3: Vectorize text data
# -----------------------------
vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# -----------------------------
# Step 4: Train ML model
# -----------------------------
model = LogisticRegression(max_iter=1000)
model.fit(X_train_tfidf, y_train)

# -----------------------------
# Step 5: Evaluate model
# -----------------------------
y_pred = model.predict(X_test_tfidf)
print("Classification Report:")
print(classification_report(y_test, y_pred))

# -----------------------------
# Step 6: Save model & vectorizer
# -----------------------------
os.makedirs(os.path.join(os.path.dirname(__file__), "models"), exist_ok=True)

with open(os.path.join(os.path.dirname(__file__), "models", "judge_model.pkl"), "wb") as f:
    pickle.dump(model, f)

with open(os.path.join(os.path.dirname(__file__), "models", "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

print("\n✅ Model and vectorizer saved successfully in 'Backend/model/models/'")
