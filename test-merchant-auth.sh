#!/bin/bash

# Merchant credentials
PUBLIC_KEY="GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE"
SECRET_KEY="SCLI6224INXOK3VF7HHNJR6OKUNXAWK62PD35F7TU6IVWYZHXHWIMRU3"

echo "1. Getting challenge..."
CHALLENGE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/challenge \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\": \"$PUBLIC_KEY\"}")

echo "Challenge response:"
echo $CHALLENGE_RESPONSE

# Extract transaction using grep and cut
CHALLENGE_TX=$(echo $CHALLENGE_RESPONSE | grep -o '"transaction":"[^"]*"' | cut -d'"' -f4)

echo -e "\n2. Signing challenge..."
if [ -z "$CHALLENGE_TX" ]; then
    echo "Error: Could not extract challenge transaction"
    exit 1
fi

SIGNED_CHALLENGE=$(npx ts-node src/scripts/sign-challenge.ts "$CHALLENGE_TX" "$SECRET_KEY")
echo "Signed challenge: $SIGNED_CHALLENGE"

echo -e "\n3. Verifying and getting merchant token..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d "{
    \"signedChallenge\": \"$SIGNED_CHALLENGE\",
    \"walletAddress\": \"$PUBLIC_KEY\",
    \"userType\": \"merchant\"
  }")

echo "Auth response:"
echo $AUTH_RESPONSE

# Extract token using grep and cut
MERCHANT_TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$MERCHANT_TOKEN" ]; then
    echo "Error: Could not extract merchant token"
    exit 1
fi

echo -e "\n4. Testing merchant token by creating a rate..."
RATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/rates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -d '{
    "baseCurrency": "EUR",
    "quoteCurrency": "USD",
    "rate": 1.1,
    "validityPeriod": 30
  }')

echo "Rate creation response:"
echo $RATE_RESPONSE

# Save credentials
echo -e "\nSaving credentials to merchant-auth.txt..."
cat > merchant-auth.txt << EOL
Public Key: $PUBLIC_KEY
Secret Key: $SECRET_KEY
Token: $MERCHANT_TOKEN
EOL

echo "Done! Check merchant-auth.txt for your credentials"