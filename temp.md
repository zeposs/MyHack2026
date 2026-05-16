To run locally

# 1. Create MySQL database
mysql -u root -p -e "CREATE DATABASE startconnector CHARACTER SET utf8mb4;"

# 2. Copy and fill env
copy version2\backend\.env.example version2\backend\.env

# 3. Install deps
cd version2\backend
pip install -r requirements.txt

# 4. Seed data
python seed.py

# 5. Start server
uvicorn main:app --reload --port 8000
Then open http://localhost:8000/docs for the interactive API docs.

Demo login: admin@cradle.com.my / admin1234

The seed data comes pre-loaded with AI matching results (94/89/86%) so the demo flow works immediately — you only need to call POST /applications/app-ali-2026/generate-matches if you want to regenerate them live with Gemini.