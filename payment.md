a@a:~/stellar$ curl -X POST http://localhost:5000/api/payments   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"   -H "Content-Type: application/json"   -d '{
    "rateId": "67e4a1202c13ebf6080ce154",
    "sourceAmount": "1000.00",
    "customerEmail": "jessicaanavheoba@gmail.com"
  }'
{"success":true,"data":{"payment":{"merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-28T17:12:45.443Z","stellarPaymentAddress":"GBAIWMSSGA2IGUHLEPAVAN3T4RIYSIMXPUXXIQO3IGE73JM7NZVP36XP","stellarMemo":"e783k8mooet","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","_id":"67e6d18558714ac90828e6bd","createdAt":"2025-03-28T16:42:45.463Z","updatedAt":"2025-03-28T16:42:45.463Z","__v":0},"paymentInstructions":{"address":"GBAIWMSSGA2IGUHLEPAVAN3T4RIYSIMXPUXXIQO3IGE73JM7NZVP36XP","memo":"e783k8mooet","amount":"1000.00","asset":"XLM"}}}a@a:~/stellar$ 





a@a:~/stellar$ curl -X GET "http://localhost:5000/api/payments/merchant?status=pending" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"payments":[{"_id":"67e91c345490ff3157a35243","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"expiresAt":"2025-03-30T10:55:56.143Z","stellarPaymentAddress":"GDND5LPEWDCIZN3PPATXAAMRIHFH27UVCAL4HXR2HVFYUBMRHOWRPSXX","stellarMemo":"o2s5r13d6i","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","consumerEmail":"jessicaanavheoba@gmail.com","paymentLink":"6cfac78fdf1da61285edceb9f928cbc4b5b61b22519c700f8f7b16055a373b39","createdAt":"2025-03-30T10:25:56.161Z","updatedAt":"2025-03-30T10:32:26.714Z","__v":0,"consumerWalletAddress":"GCZQTTGAQP6NGPZM2KDMSUEAIAEZHIJH7SDIJXLUGFZHIHH3G7D563LU"},{"_id":"67e7474e808ba014fc0b6d6c","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"expiresAt":"2025-03-29T01:35:18.156Z","stellarPaymentAddress":"GBWVZQRY33QDXMZS6AOUNSKQ2PIEGG77NZDPJOKVLQTCR2JQIENVX4MU","stellarMemo":"gzw0dldrhx","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","consumerEmail":"jessicaanavheoba@gmail.com","paymentLink":"026205e0298ad7f9317ceafed9f327fe6454751956d90bb56bc2473f41d354fb","createdAt":"2025-03-29T01:05:18.164Z","updatedAt":"2025-03-29T02:46:11.401Z","__v":0,"consumerWalletAddress":"GCZQTTGAQP6NGPZM2KDMSUEAIAEZHIJH7SDIJXLUGFZHIHH3G7D563LU"},{"_id":"67e746f0808ba014fc0b6d68","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"expiresAt":"2025-03-29T01:33:44.193Z","stellarPaymentAddress":"GBGDPUDQR4E6GTYLHNL7TWANVNZFYWJKR4CDBXQTG3DE3U3K7WI3F5EO","stellarMemo":"7lffb5c71i","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","consumerEmail":"anavheobajaz@gmail.com","paymentLink":"a23aa353e9b88e61f1b0f1a59fa255574d5c48fb33b5f8d18ea6440136b0df86","createdAt":"2025-03-29T01:03:44.219Z","updatedAt":"2025-03-29T01:03:44.219Z","__v":0},{"_id":"67e745857ac95e3cfb00bf10","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"expiresAt":"2025-03-29T01:27:41.904Z","stellarPaymentAddress":"GDNLEJZVACKRIQF73ESJ7ZFA3ZJ2MZXEZPIL7XXQUGUPFDTPC6NNMNZZ","stellarMemo":"hinymju5dxk","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","consumerEmail":"anavheobajaz@gmail.com","paymentLink":"8ed506737635570a1fa162ba76664a55dec5a4949b91c03d9ef35a18b400c215","createdAt":"2025-03-29T00:57:41.932Z","updatedAt":"2025-03-29T00:57:41.932Z","__v":0},{"_id":"67e6f687aa51110eaf803bfa","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"expiresAt":"2025-03-28T19:50:39.474Z","stellarPaymentAddress":"GDH4XVRM55JDHA5MIQA2LWB6JO4YYV4IFBLIIDVCWK67NIOJGPY4FJUV","stellarMemo":"va2ejbt5qme","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","consumerEmail":"anavheobajaz@gmail.com","paymentLink":"797eefa302ac54f20dacf761ec27ba608757b6a832105f62e3544e137c63ca41","createdAt":"2025-03-28T19:20:39.505Z","updatedAt":"2025-03-28T19:20:39.505Z","__v":0},{"_id":"67e6d18558714ac90828e6bd","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-28T17:12:45.443Z","stellarPaymentAddress":"GBAIWMSSGA2IGUHLEPAVAN3T4RIYSIMXPUXXIQO3IGE73JM7NZVP36XP","stellarMemo":"e783k8mooet","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","createdAt":"2025-03-28T16:42:45.463Z","updatedAt":"2025-03-28T16:42:45.463Z","__v":0}],"total":6}}a@a:~/stellar$ 





a@a:~/stellar$ curl -X GET "http://localhost:5000/api/payments/67e6d18558714ac90828e6bd" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"payment":{"_id":"67e6d18558714ac90828e6bd","merchantId":"67e4833104100ca49d0899c6","rateId":"67e4a1202c13ebf6080ce154","type":"crypto","status":"pending","sourceAmount":"1000.00","sourceAsset":"XLM","destinationAmount":"110.0000000","destinationAsset":"USD","exchangeRate":0.11,"customerEmail":"customer@example.com","expiresAt":"2025-03-28T17:12:45.443Z","stellarPaymentAddress":"GBAIWMSSGA2IGUHLEPAVAN3T4RIYSIMXPUXXIQO3IGE73JM7NZVP36XP","stellarMemo":"e783k8mooet","merchantWalletAddress":"GCJ74SIGLNZBINTABUZ3PFVJFHROBYQZADIX2R7H4JEO6OGGVIRPPDXE","createdAt":"2025-03-28T16:42:45.463Z","updatedAt":"2025-03-28T16:42:45.463Z","__v":0}}}a@a:~/stellar$ 





a@a:~/stellar$ curl -X GET "http://localhost:5000/api/payments/67e6d18558714ac90828e6bd/status" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0ODMzMTA0MTAwY2E0OWQwODk5YzYiLCJ1c2VyVHlwZSI6Im1lcmNoYW50Iiwid2FsbGV0QWRkcmVzcyI6IkdDSjc0U0lHTE5aQklOVEFCVVozUEZWSkZIUk9CWVFaQURJWDJSN0g0SkVPNk9HR1ZJUlBQRFhFIiwiaWF0IjoxNzQzMDI5MDQxLCJleHAiOjE3NDM2MzM4NDF9.cW7wUVClpT_R27qYmSGdPYMDwkRz0Abukrh9XJBVY3o"
{"success":true,"data":{"status":"pending","updatedAt":"2025-03-28T16:42:45.463Z"}}a@a:~/stellar$ 







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







