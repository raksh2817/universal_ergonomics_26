#!/bin/bash
# Quick setup script for local development

set -e

echo "=== Universal Ergonomics — Local Setup ==="

# Backend
echo "Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env 2>/dev/null || true
echo "Backend ready. Activate venv: source backend/venv/bin/activate"

# Frontend
echo ""
echo "Setting up frontend..."
cd ../frontend
npm install
echo "Frontend ready."

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Start development:"
echo "  Backend:  cd backend && uvicorn app.main:app --reload"
echo "  Frontend: cd frontend && npm run dev"
echo "  Docker:   cd docker && docker compose up"
echo ""
echo "Seed database:"
echo "  cd backend && python -m app.utils.seed"
