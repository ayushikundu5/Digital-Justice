"""
Indian Constitutional Legal Dataset - Model Training Script
============================================================
This script trains an AI model on the Indian Constitutional Legal Dataset
for automated judicial decision-making.

Dataset: 150+ cases based on Indian Constitution, IPC, and various Acts
Author: Code Vibers Team
Purpose: AI Court System
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text:^70}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

# -----------------------------
# Step 1: Load Indian Legal Dataset
# -----------------------------
def load_dataset():
    print_header("INDIAN CONSTITUTIONAL LEGAL DATASET - MODEL TRAINING")
    print_info("Loading Indian Constitutional Legal Dataset...")
    
    # Get the correct path
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'indian_constitution_legal_dataset.csv')
    
    try:
        df = pd.read_csv(data_path)
        print_success(f"Dataset loaded successfully!")
        print_info(f"Total cases: {len(df)}")
        return df
    except FileNotFoundError:
        print_warning("Indian legal dataset not found. Using fallback dataset...")
        # Fallback to original dataset if new one doesn't exist
        fallback_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'ai_judge_dataset_clean.csv')
        df = pd.read_csv(fallback_path)
        print_success(f"Fallback dataset loaded: {len(df)} cases")
        return df

# -----------------------------
# Step 2: Analyze Dataset
# -----------------------------
def analyze_dataset(df):
    print_header("DATASET ANALYSIS")
    
    # Verdict distribution
    print(f"{Colors.BOLD}Verdict Distribution:{Colors.ENDC}")
    verdict_counts = df['verdict'].value_counts()
    for verdict, count in verdict_counts.items():
        percentage = (count / len(df)) * 100
        print(f"  {verdict}: {count} ({percentage:.1f}%)")
    
    # Legal basis categories (if available)
    if 'legal_basis' in df.columns:
        print(f"\n{Colors.BOLD}Top 10 Legal Provisions:{Colors.ENDC}")
        legal_basis_counts = df['legal_basis'].value_counts().head(10)
        for i, (basis, count) in enumerate(legal_basis_counts.items(), 1):
            print(f"  {i}. {basis}: {count} cases")
    
    # Evidence statistics
    print(f"\n{Colors.BOLD}Evidence Statistics:{Colors.ENDC}")
    if 'plaintiff_score' in df.columns and 'defendant_score' in df.columns:
        print(f"  Average Plaintiff Score: {df['plaintiff_score'].mean():.2f}")
        print(f"  Average Defendant Score: {df['defendant_score'].mean():.2f}")
    
    print()

# -----------------------------
# Step 3: Prepare Data
# -----------------------------
def prepare_data(df):
    print_header("DATA PREPARATION")
    print_info("Preparing features for training...")
    
    # Combine text columns
    if 'legal_basis' in df.columns:
        df['combined_text'] = (
            df['plaintiff'] + ' ' + 
            df['defendant'] + ' ' + 
            df['evidence'] + ' ' + 
            df['legal_basis']
        )
        print_success("Combined text with legal basis")
    else:
        df['combined_text'] = df['plaintiff'] + ' ' + df['defendant'] + ' ' + df['evidence']
        print_success("Combined text without legal basis")
    
    X = df['combined_text']
    y = df['verdict']
    
    print_success(f"Features prepared: {len(X)} samples")
    print_success(f"Labels prepared: {y.nunique()} unique classes")
    
    return X, y

# -----------------------------
# Step 4: Split and Vectorize
# -----------------------------
def split_and_vectorize(X, y):
    print_header("DATA SPLITTING & VECTORIZATION")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print_success(f"Train set: {len(X_train)} samples ({(len(X_train)/len(X))*100:.1f}%)")
    print_success(f"Test set: {len(X_test)} samples ({(len(X_test)/len(X))*100:.1f}%)")
    
    # Vectorize with enhanced parameters
    print_info("Creating TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(
        stop_words='english',
        max_features=5000,
        ngram_range=(1, 2),  # Unigrams and bigrams
        min_df=2,
        max_df=0.95
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print_success(f"Vectorization complete: {X_train_tfidf.shape[1]} features")
    print_info(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
    
    return X_train_tfidf, X_test_tfidf, y_train, y_test, vectorizer

# -----------------------------
# Step 5: Train Multiple Models
# -----------------------------
def train_models(X_train, X_test, y_train, y_test):
    print_header("MODEL TRAINING")
    
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=200, random_state=42, max_depth=20),
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, C=1.0)
    }
    
    trained_models = {}
    results = {}
    
    for model_name, model in models.items():
        print_info(f"Training {model_name}...")
        
        # Train
        model.fit(X_train, y_train)
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
        
        # Test prediction
        y_pred = model.predict(X_test)
        
        # Metrics
        accuracy = accuracy_score(y_test, y_pred)
        
        trained_models[model_name] = model
        results[model_name] = {
            'accuracy': accuracy,
            'cv_scores': cv_scores,
            'predictions': y_pred
        }
        
        print_success(f"{model_name} trained!")
        print(f"  Accuracy: {accuracy*100:.2f}%")
        print(f"  Cross-validation Score: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*2*100:.2f}%)")
    
    return trained_models, results, y_test

# -----------------------------
# Step 6: Evaluate and Compare
# -----------------------------
def evaluate_models(results, y_test):
    print_header("MODEL EVALUATION & COMPARISON")
    
    best_model = None
    best_accuracy = 0
    
    for model_name, result in results.items():
        print(f"\n{Colors.BOLD}{model_name} Performance:{Colors.ENDC}")
        print(f"\nClassification Report:")
        print(classification_report(y_test, result['predictions']))
        
        if result['accuracy'] > best_accuracy:
            best_accuracy = result['accuracy']
            best_model = model_name
    
    print(f"\n{Colors.OKGREEN}{Colors.BOLD}Best Model: {best_model} (Accuracy: {best_accuracy*100:.2f}%){Colors.ENDC}")
    
    return best_model

# -----------------------------
# Step 7: Save Model
# -----------------------------
def save_model(model, vectorizer, model_name):
    print_header("MODEL SAVING")
    
    # Create models directory if it doesn't exist
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save model
    model_path = os.path.join(models_dir, 'indian_legal_judge_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print_success(f"Model saved: {model_path}")
    
    # Save vectorizer
    vectorizer_path = os.path.join(models_dir, 'indian_legal_vectorizer.pkl')
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    print_success(f"Vectorizer saved: {vectorizer_path}")
    
    # Also save to parent directory for compatibility
    parent_model_path = os.path.join(os.path.dirname(__file__), '..', 'model.pkl')
    with open(parent_model_path, 'wb') as f:
        pickle.dump(model, f)
    
    parent_vectorizer_path = os.path.join(os.path.dirname(__file__), '..', 'vectorizer.pkl')
    with open(parent_vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    
    print_success("Model files copied to Backend directory for API access")

# -----------------------------
# Step 8: Test Model with Sample Cases
# -----------------------------
def test_sample_cases(model, vectorizer):
    print_header("TESTING WITH SAMPLE CASES")
    
    sample_cases = [
        {
            "plaintiff": "Plaintiff claims violation of Right to Equality under Article 14 due to discriminatory hiring",
            "defendant": "Defendant argues merit-based selection without discrimination",
            "evidence": "Employment records and selection criteria"
        },
        {
            "plaintiff": "Worker alleges unsafe working conditions violating Article 21",
            "defendant": "Company claims compliance with all safety regulations",
            "evidence": "Safety audit reports and accident records"
        },
        {
            "plaintiff": "Consumer alleges fraud under Section 420 IPC",
            "defendant": "Seller denies fraudulent intent and provides transaction records",
            "evidence": "Purchase receipts and communication logs"
        }
    ]
    
    for i, case in enumerate(sample_cases, 1):
        combined = f"{case['plaintiff']} {case['defendant']} {case['evidence']}"
        vectorized = vectorizer.transform([combined])
        prediction = model.predict(vectorized)[0]
        
        print(f"\n{Colors.BOLD}Sample Case {i}:{Colors.ENDC}")
        print(f"  Plaintiff: {case['plaintiff'][:60]}...")
        print(f"  Defendant: {case['defendant'][:60]}...")
        print(f"  {Colors.OKGREEN}Predicted Verdict: {prediction}{Colors.ENDC}")

# -----------------------------
# Main Execution
# -----------------------------
def main():
    try:
        # Step 1: Load dataset
        df = load_dataset()
        
        # Step 2: Analyze dataset
        analyze_dataset(df)
        
        # Step 3: Prepare data
        X, y = prepare_data(df)
        
        # Step 4: Split and vectorize
        X_train, X_test, y_train, y_test, vectorizer = split_and_vectorize(X, y)
        
        # Step 5: Train models
        trained_models, results, y_test = train_models(X_train, X_test, y_train, y_test)
        
        # Step 6: Evaluate and compare
        best_model_name = evaluate_models(results, y_test)
        
        # Step 7: Save the best model
        best_model = trained_models[best_model_name]
        save_model(best_model, vectorizer, best_model_name)
        
        # Step 8: Test with sample cases
        test_sample_cases(best_model, vectorizer)
        
        # Final message
        print_header("TRAINING COMPLETE")
        print_success("Indian Legal Model is ready for deployment!")
        print_info("Model can now be used via the AI Court API")
        print_info(f"Total training samples: {len(X)}")
        print_info(f"Model accuracy: {results[best_model_name]['accuracy']*100:.2f}%")
        print()
        
    except Exception as e:
        print(f"\n{Colors.FAIL}Error during training: {str(e)}{Colors.ENDC}")
        raise

if __name__ == "__main__":
    main()
