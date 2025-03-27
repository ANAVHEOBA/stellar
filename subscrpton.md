a@a:~/stellar$ curl -X POST http://localhost:3000/api/subscriptions   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"   -H "Content-Type: application/json"   -d '{
    "rateId": "67e49f3ca3dcb36e1fdd5962",
    "customerId": "customer@example.com",
    "amount": "100.0000000",
    "sourceAsset": "XLM",
    "destinationAsset": "USD",
    "billingPeriod": "monthly"
  }'
{"success":true,"data":{"subscription":{"merchantId":"67e4833104100ca49d0899c6","rateId":"67e49f3ca3dcb36e1fdd5962","customerId":"customer@example.com","amount":"100.0000000","sourceAsset":"XLM","destinationAsset":"USD","billingPeriod":"monthly","nextBillingDate":"2025-04-27T06:30:23.627Z","status":"active","failedAttempts":0,"_id":"67e4f07f51723170b26d94e9","createdAt":"2025-03-27T06:30:23.657Z","updatedAt":"2025-03-27T06:30:23.657Z","__v":0}}}a@a:~/stellar$ 








a@a:~/stellar$ curl -X GET http://localhost:3000/api/subscriptions/merchant \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"subscriptions":[{"_id":"67e4f07f51723170b26d94e9","merchantId":"67e4833104100ca49d0899c6","rateId":"67e49f3ca3dcb36e1fdd5962","customerId":"customer@example.com","amount":"100.0000000","sourceAsset":"XLM","destinationAsset":"USD","billingPeriod":"monthly","nextBillingDate":"2025-04-27T06:30:23.627Z","status":"active","failedAttempts":0,"createdAt":"2025-03-27T06:30:23.657Z","updatedAt":"2025-03-27T06:30:23.657Z","__v":0}],"total":1}}a@a:~/stellar$ 










a@a:~/stellar$ curl -X GET http://localhost:3000/api/subscriptions/67e4f07f51723170b26d94e9 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"subscription":{"_id":"67e4f07f51723170b26d94e9","merchantId":"67e4833104100ca49d0899c6","rateId":"67e49f3ca3dcb36e1fdd5962","customerId":"customer@example.com","amount":"100.0000000","sourceAsset":"XLM","destinationAsset":"USD","billingPeriod":"monthly","nextBillingDate":"2025-04-27T06:30:23.627Z","status":"active","failedAttempts":0,"createdAt":"2025-03-27T06:30:23.657Z","updatedAt":"2025-03-27T06:30:23.657Z","__v":0}}}a@a:~/stellar$ 










a@a:~/stellar$ curl -X PATCH http://localhost:3000/api/subscriptions/67e4f07f51723170b26d94e9/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paused"
  }'
{"success":true,"data":{"subscription":{"_id":"67e4f07f51723170b26d94e9","merchantId":"67e4833104100ca49d0899c6","rateId":"67e49f3ca3dcb36e1fdd5962","customerId":"customer@example.com","amount":"100.0000000","sourceAsset":"XLM","destinationAsset":"USD","billingPeriod":"monthly","nextBillingDate":"2025-04-27T06:30:23.627Z","status":"paused","failedAttempts":0,"createdAt":"2025-03-27T06:30:23.657Z","updatedAt":"2025-03-27T08:19:14.620Z","__v":0}}}a@a:~/stellar$ 











a@a:~/stellar$ curl -X GET "http://localhost:3000/api/subscriptions/merchant?status=paused" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"subscriptions":[{"_id":"67e4f07f51723170b26d94e9","merchantId":"67e4833104100ca49d0899c6","rateId":"67e49f3ca3dcb36e1fdd5962","customerId":"customer@example.com","amount":"100.0000000","sourceAsset":"XLM","destinationAsset":"USD","billingPeriod":"monthly","nextBillingDate":"2025-04-27T06:30:23.627Z","status":"paused","failedAttempts":0,"createdAt":"2025-03-27T06:30:23.657Z","updatedAt":"2025-03-27T08:19:14.620Z","__v":0}],"total":1}}a@a:~/stellar$ 



a@a:~/stellar$ curl -X POST "http://localhost:3000/api/subscriptions/process" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \
-H "Content-Type: application/json"
{"success":true,"message":"Subscription processing initiated"}a@a:~/stellar$ 





a@a:~/stellar$ curl -X GET "http://localhost:3000/api/subscriptions/due" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" -H "Content-Type: application/json"
{"success":true,"data":{"subscriptions":[],"total":0}}a@a:~/stellar$ 








a@a:~/stellar$ curl -X PATCH "http://localhost:3000/api/subscriptions/bulk-status" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \
-H "Content-Type: application/json" \
-d '{
    "subscriptionIds": ["60d5ecb54f1a2c001f3e1234", "60d5ecb54f1a2c001f3e5678"],
    "status": "paused"
}'
{"success":true,"data":{"updatedSubscriptions":[null,null],"total":2}}a@a:~/stellar$ 











a@a:~/stellar$    curl -X PATCH "http://localhost:3000/api/subscriptions/bulk-status" \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \
   -H "Content-Type: application/json" \
   -d '{
       "subscriptionIds": ["67e4f07f51723170b26d94e9"],
       "status": "active"
   }'
{"success":true,"data":{"updatedSubscriptions":[{"_id":"67e4f07f51723170b26d94e9","merchantId":"67e4833104100ca49d0899c6","rateId":"67e49f3ca3dcb36e1fdd5962","customerId":"customer@example.com","amount":"100.0000000","sourceAsset":"XLM","destinationAsset":"USD","billingPeriod":"monthly","nextBillingDate":"2025-04-27T06:30:23.627Z","status":"active","failedAttempts":0,"createdAt":"2025-03-27T06:30:23.657Z","updatedAt":"2025-03-27T09:03:08.443Z","__v":0}],"total":1}}a@a:~/stellar$ 