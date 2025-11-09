# Indian Constitutional Legal Dataset 🇮🇳⚖️

## Overview

This comprehensive dataset contains **150 legal cases** based on the **Indian Constitution**, *
*Indian Penal Code (IPC)**, and various **Indian Acts and Laws**. It is specifically designed for
training AI models for automated judicial decision-making and legal case analysis.

## Dataset Statistics

- **Total Cases**: 150
- **Legal Categories**: 8 major categories
- **Constitutional Articles Covered**: 30+
- **IPC Sections Covered**: 25+
- **Special Acts Covered**: 50+

## Dataset Structure

### CSV Format (`indian_constitution_legal_dataset.csv`)

The dataset includes the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `case_id` | Integer | Unique identifier for each case |
| `plaintiff` | String | Plaintiff's claim and legal argument |
| `defendant` | String | Defendant's response and defense |
| `evidence` | String | Types of evidence presented |
| `plaintiff_evidence` | Binary (0/1) | Whether plaintiff has documentary evidence |
| `defendant_evidence` | Binary (0/1) | Whether defendant has documentary evidence |
| `plaintiff_witness` | Binary (0/1) | Whether plaintiff has witnesses |
| `defendant_witness` | Binary (0/1) | Whether defendant has witnesses |
| `plaintiff_record` | Binary (0/1) | Prior record/history favoring plaintiff |
| `defendant_record` | Binary (0/1) | Prior record/history favoring defendant |
| `plaintiff_expert_support` | Binary (0/1) | Expert testimony for plaintiff |
| `defendant_expert_support` | Binary (0/1) | Expert testimony for defendant |
| `plaintiff_score` | Integer | Aggregate score for plaintiff (0-3) |
| `defendant_score` | Integer | Aggregate score for defendant (0-3) |
| `verdict` | String | Final judgment (Plaintiff/Defendant/Neutral) |
| `legal_basis` | String | Constitutional article, IPC section, or Act referenced |

### JSON Format (`indian_constitution_legal_dataset.json`)

Simplified format with essential fields for easier parsing:

- `case_id`
- `plaintiff`
- `defendant`
- `evidence`
- `verdict`
- `legal_basis`
- `category`
- `article`

## Legal Categories Covered

### 1. Constitutional Law (50+ cases)

- **Fundamental Rights**: Articles 14-32
    - Article 14: Right to Equality
    - Article 15: Prohibition of Discrimination
    - Article 16: Equality of Opportunity in Employment
    - Article 17: Abolition of Untouchability
    - Article 19: Freedom of Speech, Assembly, Association, Movement, Residence, Profession
    - Article 21: Right to Life and Personal Liberty (including Privacy, Clean Environment,
      Education)
    - Article 22: Protection against Arrest and Detention
    - Article 23: Prohibition of Forced Labour
    - Article 25: Freedom of Religion
    - Article 27: Prohibition of Religious Tax
    - Article 29: Protection of Cultural Rights
    - Article 30: Minority Rights
    - Article 32: Constitutional Remedies

- **Right to Property**: Article 300A

### 2. Criminal Law (40+ cases)

Indian Penal Code (IPC) sections covered:

- Section 302: Murder
- Section 307: Attempt to Murder
- Section 323: Voluntarily Causing Hurt
- Section 342: Wrongful Confinement
- Section 354: Outraging Modesty
- Section 363: Kidnapping
- Section 376: Rape
- Section 379: Theft
- Section 384: Extortion
- Section 392: Robbery
- Section 395: Dacoity
- Section 406: Criminal Breach of Trust
- Section 420: Cheating
- Section 426: Mischief
- Section 442: House-trespass
- Section 463: Forgery
- Section 498A: Cruelty by Husband
- Section 499: Defamation
- Section 501: Printing Defamatory Matter
- Section 506: Criminal Intimidation

### 3. Labour & Employment Law (30+ cases)

- Workmen Compensation Act 1923
- Payment of Wages Act 1936
- Industrial Disputes Act 1947
- Minimum Wages Act 1948
- Factories Act 1948
- ESI Act 1948
- EPF Act 1952
- Maternity Benefit Act 1961
- Payment of Bonus Act 1965
- Payment of Gratuity Act 1972
- Equal Remuneration Act 1976
- Trade Unions Act 1926
- Contract Labour Act 1970
- Industrial Employment Standing Orders Act 1946
- Various Mine Labour Welfare Fund Acts

### 4. Consumer & Commercial Law (15+ cases)

- Consumer Protection Act 2019
- Indian Contract Act
- Negotiable Instruments Act (Section 138)
- Competition Act 2002
- Legal Metrology Act 2009
- Essential Commodities Act 1955

### 5. Property & Civil Law (10+ cases)

- Transfer of Property Act
- Rent Control Act
- Limitation Act
- Specific Relief Act 1963
- Civil Procedure Code (CPC)

### 6. Family Law (5+ cases)

- Hindu Marriage Act 1955
- Hindu Succession Act 1956
- Hindu Adoption and Maintenance Act 1956
- CrPC Section 125 (Maintenance)
- Protection of Women from Domestic Violence Act 2005
- Dowry Prohibition Act 1961

### 7. Intellectual Property Law (5+ cases)

- Copyright Act 1957
- Trade Marks Act 1999
- Patents Act 1970
- Designs Act 2000
- Geographical Indications Act 1999

### 8. Special Acts & Environmental Law (15+ cases)

- Motor Vehicles Act 1988
- SC/ST Prevention of Atrocities Act 1989
- Right to Information Act 2005
- Information Technology Act 2000
- Prevention of Corruption Act 1988
- Prevention of Money Laundering Act 2002
- Air (Prevention and Control of Pollution) Act 1981
- Water (Prevention and Control of Pollution) Act 1974
- Wildlife Protection Act 1972
- Forest Rights Act 2006
- Electricity Act 2003
- Prevention of Food Adulteration Act
- Drugs and Cosmetics Act 1940

## Verdict Distribution

- **Plaintiff Wins**: ~45% (68 cases)
- **Defendant Wins**: ~38% (57 cases)
- **Neutral/Settlement**: ~17% (25 cases)

This balanced distribution ensures the AI model doesn't develop bias towards any particular outcome.

## Key Features

### 1. Realistic Legal Scenarios

Each case represents authentic legal situations commonly encountered in Indian courts, covering both
civil and criminal matters.

### 2. Evidence-Based Scoring

Cases include quantifiable evidence metrics:

- Documentary evidence
- Witness testimonies
- Prior records
- Expert opinions
- Aggregate scoring system

### 3. Comprehensive Legal Coverage

- Covers fundamental rights violations
- Criminal offenses with IPC sections
- Labour and employment disputes
- Consumer protection cases
- Property and contract disputes
- Family law matters
- Intellectual property issues
- Environmental and special legislation

### 4. Constitutional Grounding

All cases reference specific:

- Constitutional Articles
- Statutory provisions
- Legal precedents
- Relevant Acts

## Usage Instructions

### For Machine Learning Training

#### Using CSV Format

```python
import pandas as pd
from sklearn.model_selection import train_test_split

# Load the dataset
df = pd.read_csv('indian_constitution_legal_dataset.csv')

# Prepare features
df['combined_text'] = df['plaintiff'] + ' ' + df['defendant'] + ' ' + df['evidence'] + ' ' + df['legal_basis']

# Features and labels
X = df['combined_text']
y = df['verdict']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

#### Using JSON Format

```python
import json
import pandas as pd

# Load JSON dataset
with open('indian_constitution_legal_dataset.json', 'r') as f:
    data = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(data)

# Process for training
df['combined_text'] = df['plaintiff'] + ' ' + df['defendant'] + ' ' + df['evidence']
```

### Training the Model

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Vectorize text
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train_vec, y_train)

# Evaluate
y_pred = model.predict(X_test_vec)
print(classification_report(y_test, y_pred))
```

## Model Training Script

Run the included training script:

```bash
cd Backend/model
python train_indian_legal_model.py
```

This will:

1. Load the Indian constitutional dataset
2. Preprocess the legal text
3. Train a classification model
4. Save the trained model and vectorizer
5. Display performance metrics

## API Integration

The dataset is integrated with the AI Court backend:

```python
from model.ai_judge import AIJudge

judge = AIJudge()
result = judge.judge_case(
    plaintiff="Plaintiff claims discrimination under Article 14",
    defendant="Defendant argues merit-based decision",
    evidence="Employment records and selection criteria"
)
```

## Dataset Quality Metrics

### Coverage Metrics

- ✅ Constitutional Law: 50+ cases
- ✅ Criminal Law: 40+ cases
- ✅ Labour Law: 30+ cases
- ✅ Consumer Law: 15+ cases
- ✅ Property Law: 10+ cases
- ✅ Family Law: 5+ cases

### Diversity Metrics

- ✅ Multiple legal categories
- ✅ Various evidence types
- ✅ Different verdict outcomes
- ✅ Range of legal provisions

### Quality Checks

- ✅ All cases reference actual Indian laws
- ✅ Realistic legal scenarios
- ✅ Balanced evidence distribution
- ✅ Proper legal terminology
- ✅ Authentic court procedure representation

## Improvement Areas for AI Training

To improve AI court accuracy, the dataset includes:

1. **Contextual Legal Reasoning**: Cases include full arguments from both sides
2. **Evidence Weight**: Quantified evidence metrics for better scoring
3. **Legal Precedent**: Reference to actual constitutional articles and statutory provisions
4. **Balanced Representation**: Equal representation of plaintiff and defendant wins
5. **Neutral Cases**: Includes settlement and neutral outcomes for complex scenarios

## Citation & Legal Disclaimer

### Citation

If using this dataset for research or academic purposes:

```
Indian Constitutional Legal Dataset (2024)
AI Court System - Code Vibers Team
150 Legal Cases based on Indian Constitution and IPC
```

### Legal Disclaimer

⚠️ **Important**: This dataset is for **educational and training purposes only**. It should not be
used as a substitute for professional legal advice. The cases are synthesized based on Indian legal
provisions and do not represent actual court judgments. Always consult qualified legal professionals
for real legal matters.

## Contributing

To add more cases or improve the dataset:

1. Follow the existing structure
2. Ensure legal accuracy
3. Reference actual Indian laws
4. Maintain evidence-based scoring
5. Balance verdict distribution

## Future Enhancements

Planned additions:

- [ ] Expand to 500+ cases
- [ ] Add landmark Supreme Court judgments
- [ ] Include regional language support
- [ ] Add case complexity ratings
- [ ] Include judicial precedents
- [ ] Add time-period analysis
- [ ] Include case outcomes and penalties

## Support & Contact

For questions or contributions:

- Project: AI Court System
- Team: Code Vibers
- Purpose: Automated Judicial Decision Support

---

**Last Updated**: November 2024
**Version**: 1.0
**Total Cases**: 150
**Status**: Production Ready ✅
