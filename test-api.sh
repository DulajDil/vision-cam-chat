#!/bin/bash

# Vision Cam Chat API Test Script
# This script demonstrates how to use the API endpoints

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "Vision Cam Chat API Test Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Check...${NC}"
curl -s "$BASE_URL/health" | jq '.'
echo ""
echo ""

# Test 2: Bedrock Status
echo -e "${BLUE}2. Testing Bedrock Status...${NC}"
curl -s "$BASE_URL/bedrock/status" | jq '.'
echo ""
echo ""

# Test 3: Analyze with Bedrock (requires image file)
echo -e "${BLUE}3. Testing /analyze with Bedrock${NC}"
echo -e "${YELLOW}Note: This requires an image file. Example:${NC}"
echo -e "${GREEN}curl -X POST $BASE_URL/analyze \\${NC}"
echo -e "${GREEN}  -F \"frame=@photo.jpg\" \\${NC}"
echo -e "${GREEN}  -F \"provider=bedrock\"${NC}"
echo ""

# Test 4: Analyze with OpenAI (requires image file and API key)
echo -e "${BLUE}4. Testing /analyze with OpenAI${NC}"
echo -e "${YELLOW}Note: This requires an image file and OpenAI API key. Example:${NC}"
echo -e "${GREEN}curl -X POST $BASE_URL/analyze \\${NC}"
echo -e "${GREEN}  -H \"X-Api-Key: sk-your-openai-key\" \\${NC}"
echo -e "${GREEN}  -F \"frame=@photo.jpg\" \\${NC}"
echo -e "${GREEN}  -F \"provider=openai\"${NC}"
echo ""

# Test 5: Ask with Bedrock
echo -e "${BLUE}5. Testing /ask with Bedrock${NC}"
echo -e "${YELLOW}Note: This requires an image to be uploaded first via /analyze. Example:${NC}"
echo -e "${GREEN}curl -X POST $BASE_URL/ask \\${NC}"
echo -e "${GREEN}  -H \"Content-Type: application/json\" \\${NC}"
echo -e "${GREEN}  -d '{\"provider\": \"bedrock\", \"question\": \"What color is the laptop?\"}'${NC}"
echo ""

# Test 6: Ask with OpenAI
echo -e "${BLUE}6. Testing /ask with OpenAI${NC}"
echo -e "${YELLOW}Note: This requires an image to be uploaded first via /analyze. Example:${NC}"
echo -e "${GREEN}curl -X POST $BASE_URL/ask \\${NC}"
echo -e "${GREEN}  -H \"X-Api-Key: sk-your-openai-key\" \\${NC}"
echo -e "${GREEN}  -H \"Content-Type: application/json\" \\${NC}"
echo -e "${GREEN}  -d '{\"provider\": \"openai\", \"question\": \"What do you see?\"}'${NC}"
echo ""

echo "=========================================="
echo "Test script completed!"
echo "=========================================="
echo ""
echo -e "${YELLOW}To test with an actual image:${NC}"
echo "1. Take a photo or use an existing image file"
echo "2. Run: curl -X POST $BASE_URL/analyze -F \"frame=@your-image.jpg\" -F \"provider=bedrock\""
echo "3. Then run: curl -X POST $BASE_URL/ask -H \"Content-Type: application/json\" -d '{\"provider\": \"bedrock\", \"question\": \"What do you see?\"}'"
echo ""

