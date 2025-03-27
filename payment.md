a@a:~/stellar$ curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o" \
  -H "Content-Type: application/json" \
  -d '{
    "rateId": "67e4a1202c13ebf6080ce154",
    "sourceAmount": "1000.00",
    "customerEmail": "customer@example.com"
  }'
{"success":true,"data":{"payment":{"merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-27T01:38:34.538Z","_id":"67e4a5127157bc880365c481","createdAt":"2025-03-27T01:08:34.568Z","updatedAt":"2025-03-27T01:08:34.568Z","__v":0}}}a@a:~/stellar$ 





a@a:~/stellar$ curl -X GET "http://localhost:3000/api/payments/merchant?status=pending" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"payments":[{"_id":"67e4a5127157bc880365c481","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-27T01:38:34.538Z","createdAt":"2025-03-27T01:08:34.568Z","updatedAt":"2025-03-27T01:08:34.568Z","__v":0}],"total":1}}a@a:~/stellar$ 










a@a:~/stellar$ curl -X GET http://localhost:3000/api/payments/67e4a5127157bc880365c481 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"payment":{"_id":"67e4a5127157bc880365c481","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-27T01:38:34.538Z","createdAt":"2025-03-27T01:08:34.568Z","updatedAt":"2025-03-27T01:08:34.568Z","__v":0}}}a@a:~/stellar$ 






a@a:~/stellar$ curl -X GET http://localhost:3000/api/payments/67e4a5127157bc880365c481/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"status":"pending","updatedAt":"2025-03-27T01:08:34.568Z"}}a@a:~/stellar$ 






a@a:~/stellar$ curl -X POST http://localhost:3000/api/payments/67e4a5127157bc880365c481/process \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"payment":{"_id":"67e4a5127157bc880365c481","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-27T01:38:34.538Z","createdAt":"2025-03-27T01:08:34.568Z","updatedAt":"2025-03-27T01:08:34.568Z","__v":0},"paymentInstructions":{"amount":"1000.00","asset":"XLM"}}}a@a:~/stellar$ 






a@a:~/stea@a:~/stellar$ curl -X GET http://localhost:3000/api/payments/67e4a5127157bc880365c481/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"status":"processing","updatedAt":"2025-03-27T01:43:35.820Z"}}a@a:~/stellar$ 







