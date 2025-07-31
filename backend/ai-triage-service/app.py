from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

class SymptomInput(BaseModel):
    symptoms: List[str]

# Simple symptom-to-specialist mapping
rules = {
    "fever": "General Physician",
    "cough": "Pulmonologist",
    "rash": "Dermatologist",
    "headache": "Neurologist",
    "chest pain": "Cardiologist",
    "joint pain": "Orthopedic",
    "anxiety": "Psychiatrist"
}

@app.post("/predict")
def predict_specialist(data: SymptomInput):
    matched = set(data.symptoms).intersection(rules.keys())
    if not matched:
        raise HTTPException(status_code=404, detail="No match found.")
    
    # Return first match (extend to confidence score later)
    for symptom in data.symptoms:
        if symptom in rules:
            return {"specialist": rules[symptom]}
    
    return {"specialist": "General Physician"}
