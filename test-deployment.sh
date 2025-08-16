#!/bin/bash

# FinJar Deployment Verification Script
echo "==============================================="
echo "FinJar Deployment Verification"
echo "==============================================="

# Set the base URL for your Render deployment
BASE_URL="https://finjar.onrender.com"

# If you want to test locally, uncomment this:
# BASE_URL="http://localhost:8080"

echo "Testing endpoints at: $BASE_URL"
echo ""

# Test 1: Health endpoint
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/health" || echo "❌ Health endpoint failed"
echo ""

# Test 2: Status endpoint  
echo "2. Testing status endpoint..."
curl -s "$BASE_URL/status" || echo "❌ Status endpoint failed"
echo ""

# Test 3: Root endpoint
echo "3. Testing root endpoint..."
curl -s "$BASE_URL/" || echo "❌ Root endpoint failed"
echo ""

# Test 4: Ping endpoint (if available)
echo "4. Testing ping endpoint..."
curl -s "$BASE_URL/ping" || echo "❌ Ping endpoint failed"
echo ""

echo "==============================================="
echo "Verification complete!"
echo "==============================================="
