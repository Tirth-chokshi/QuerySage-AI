# File: pages/api/analyze_csv.py

from lida import Manager, TextGenerationConfig, llm
from dotenv import load_dotenv
import base64
from PIL import Image
from io import BytesIO
import json
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

lida = Manager(text_gen=llm("openai"))

def base64_to_image(base64_string):
    byte_data = base64.b64decode(base64_string)
    return Image.open(BytesIO(byte_data))

@app.post("/api/analyze_csv")
async def analyze_csv(file: UploadFile = File(...), query: str = None):
    # Save the uploaded file temporarily
    with open("temp.csv", "wb") as buffer:
        buffer.write(await file.read())
    
    # Analyze the CSV
    textgen_config = TextGenerationConfig(n=1, temperature=0.2, use_cache=True)
    summary = lida.summarize("temp.csv", summary_method="default", textgen_config=textgen_config)
    
    # Generate visualization based on the query
    charts = lida.visualize(summary=summary, goal=query, textgen_config=textgen_config)
    
    # Convert the chart to base64
    image_base64 = charts[0].raster
    
    # Return the results
    return {
        "summary": summary,
        "chart": image_base64
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)