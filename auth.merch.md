a@a:~/stellar$ # Run the script to generate a new keypair
npx ts-node src/scripts/generate-keypair.ts
Public Key (Wallet Address): GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE
Secret Key (Keep this safe!): SCLI6224INXOK3VF7HHNJR6OKUNXAWK62PD35F7TU6IVWYZHXHWIMRU3
a@a:~/stellar$ 





a@a:~/stellar$ curl -X POST http://localhost:3000/api/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE"
  }'
{"success":true,"data":{"transaction":"AAAAAgAAAAA1zv4b3gU5OCpAdzIhd1gVsOS6aKFGna9qq1YP3+K2DAAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5IOVAAAAAAAAAAEAAAABAAAAAJP+SQZbchQ2YA0zt5apKeLg4hkA0X1H5+JI7zjGqiL3AAAACgAAAARhdXRoAAAAAQAAACxFOEhTZEpNL0dxR2IrK1JpL2FHTWhTY2JDV2xzaEs0Q3EvVmxKZ2c3QmpZPQAAAAAAAAAA","networkPassphrase":"Test SDF Network ; September 2015"}}a@a:~/stellar$ 




a@a:~/stellar$ chmod +x test-merchant-auth.sh
./test-merchant-auth.sh
1. Getting challenge...
Challenge response:
{"success":true,"data":{"transaction":"AAAAAgAAAABxARFrwXfI+46qVKcvcj5Dt5LmjyqN6Cp0ThrQNyi/twAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5IRUAAAAAAAAAAEAAAABAAAAAJP+SQZbchQ2YA0zt5apKeLg4hkA0X1H5+JI7zjGqiL3AAAACgAAAARhdXRoAAAAAQAAACxUaTk0Rzc4c0s0WG0xMUJvbWdUNlRldFlDK2RYOXZPbXFabHl6REJnZEpjPQAAAAAAAAAA","networkPassphrase":"Test SDF Network ; September 2015"}}

2. Signing challenge...
Signed challenge: AAAAAgAAAABxARFrwXfI+46qVKcvcj5Dt5LmjyqN6Cp0ThrQNyi/twAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5IRUAAAAAAAAAAEAAAABAAAAAJP+SQZbchQ2YA0zt5apKeLg4hkA0X1H5+JI7zjGqiL3AAAACgAAAARhdXRoAAAAAQAAACxUaTk0Rzc4c0s0WG0xMUJvbWdUNlRldFlDK2RYOXZPbXFabHl6REJnZEpjPQAAAAAAAAABxqoi9wAAAEDaDrVvxdR4oxZeqOX0vcMlkCBBCVTCSgi06YRqS6riKvYVecb6JTLPCXD6N2n5n0GGh5UPxONT9hyD1KjCRdIC

3. Verifying and getting merchant token...
Auth response:
{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o","user":{"walletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","userType":"merchant","isActive":true,"lastLogin":"2025-03-26T22:44:01.312Z","_id":"67e4833104100ca49d0899c6","createdAt":"2025-03-26T22:44:01.335Z","updatedAt":"2025-03-26T22:44:01.335Z"}}}

4. Testing merchant token by creating a rate...
Rate creation response:
{"error":"Route not found"}

Saving credentials to merchant-auth.txt...
Done! Check merchant-auth.txt for your credentials
a@a:~/stellar$ 



Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o










a@a:~/stellar$ curl -X POST http://localhost:5000/api/rates -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" -H "Content-Type: application/json" -d '{
    "baseCurrency": "XLM",
    "quoteCurrency": "USD",
    "rate": 0.11,
    "validityPeriod": 30
}'
{"success":true,"data":{"rate":{"merchantId":"67e4833104100ca49d0899c6","baseCurrency":"XLM","quoteCurrency":"USD","rate":0.11,"validFrom":"2025-03-26T23:34:07.943Z","validTo":"2025-04-25T23:34:07.943Z","status":"pending","_id":"67e48eefe3192f789f2c7d8f","createdAt":"2025-03-26T23:34:07.972Z","updatedAt":"2025-03-26T23:34:07.972Z","__v":0}}}a@a:~/stellar$ 








a@a:~/stellar$ curl -X GET http://localhost:3000/api/rates/merchant \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"rates":[{"_id":"67e48eefe3192f789f2c7d8f","merchantId":"67e4833104100ca49d0899c6","baseCurrency":"XLM","quoteCurrency":"USD","rate":0.11,"validFrom":"2025-03-26T23:34:07.943Z","validTo":"2025-04-25T23:34:07.943Z","status":"active","createdAt":"2025-03-26T23:34:07.972Z","updatedAt":"2025-03-26T23:34:08.334Z","__v":0}]}}a@a:~/stellar$ 




a@a:~/stellar$ curl -X GET http://localhost:3000/api/rates/67e4833104100ca49d0899c6/XLM/USD
{"success":true,"data":{"rate":{"_id":"67e48eefe3192f789f2c7d8f","merchantId":"67e4833104100ca49d0899c6","baseCurrency":"XLM","quoteCurrency":"USD","rate":0.11,"validFrom":"2025-03-26T23:34:07.943Z","validTo":"2025-04-25T23:34:07.943Z","status":"active","createdAt":"2025-03-26T23:34:07.972Z","updatedAt":"2025-03-26T23:34:08.334Z","__v":0}}}a@a:~/stellar$ 




a@a:~/stellar$ curl -X POST http://localhost:3000/api/rates/check-viability/67e4833104100ca49d0899c6 \
-H "Content-Type: application/json" \
-d '{
    "baseCurrency": "XLM",
    "quoteCurrency": "USD",
    "amount": "100.0000000"
}'
{"success":true,"data":{"isViable":false,"rate":0.11,"expectedDestinationAmount":"11.0000000"}}a@a:~/stellar$ 



































a@a:~/stellar$ curl -X POST http://localhost:3000/api/rates \
a@a:~/stellar$ curl -X POST http://localhost:3000/api/rates \CJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwOD
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \ype: application/json" \
  -H "Content-Type: application/json" \
  -d '{seCurrency": "XLM",
    "baseCurrency": "XLM",,
    "quoteCurrency": "USD",
    "rate": 0.11,od": 7
    "validityPeriod": 7
  }'
{"success":true,"data":{"rate":{"merchantId":"67e4833104100ca49d0899c6","baseCurrency":"XLM","quoteCurrency":"USD","rate":0.11,"validFrom":"2025-03-27T00:43:40.753Z","validTo":"2025-04-03T00:43:40.753Z","status":"pending","_id":"67e49f3ca3dcb36e1fdd5962","createdAt":"2025-03-27T00:43:40.778Z","updatedAt":"2025-03-27T00:43:40.778Z","__v":0}}}a@a:~/stellar$ 




a@a:~/stellar$ curl -X GET http://localhost:3000/api/rates/merchant \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"rates":[{"_id":"67e49f3ca3dcb36e1fdd5962","merchantId":"67e4833104100ca49d0899c6","baseCurrency":"XLM","quoteCurrency":"USD","rate":0.11,"validFrom":"2025-03-27T00:43:40.753Z","validTo":"2025-04-03T00:43:40.753Z","status":"active","createdAt":"2025-03-27T00:43:40.778Z","updatedAt":"2025-03-27T00:43:40.971Z","__v":0},{"_id":"67e48eefe3192f789f2c7d8f","merchantId":"67e4833104100ca49d0899c6","baseCurrency":"XLM","quoteCurrency":"USD","rate":0.11,"validFrom":"2025-03-26T23:34:07.943Z","validTo":"2025-04-25T23:34:07.943Z","status":"active","createdAt":"2025-03-26T23:34:07.972Z","updatedAt":"2025-03-26T23:34:08.334Z","__v":0}]}}a@a:~/stellar$ 











a@a:~/stellar$ curl -X POST http://localhost:3000/api/rates/check-viability/67e4833104100ca49d0899c6 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \
  -H "Content-Type: application/json" \
  -d '{
    "baseCurrency": "XLM",
    "quoteCurrency": "USD",
    "amount": "1000.00"
  }'
{"success":true,"data":{"isViable":true,"rate":0.11,"expectedDestinationAmount":"110.0000000","viabilityDetails":{"paths":{"direct":true,"indirect":true,"bestPath":["XLM","USD"]},"liquidity":{"poolLiquidity":1000000,"orderbookDepth":500000,"sufficient":true},"pricing":{"currentPrice":0.11,"slippage":0.1,"priceImpact":0.05},"volume":{"last24Hours":150000,"averageTradeSize":1200},"trustlines":{"source":true,"destination":true}}}}a@a:~/stellar$ 
