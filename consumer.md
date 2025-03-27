a@a:~/stellar$ curl -X POST http://localhost:3000/api/consumers/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MzI4LCJleHAiOjE3NDM2MDkxMjh9.PRA3riFrOpzlnZKdVlwurWcM2FTNWlD-Q0Yf1OK730U" \
-H "Content-Type: application/json" \
-d '{
    "email": "consumer@example.com",
    "merchantId": "67e421ec753ad638219d1804",
    "firstName": "John",
    "lastName": "Doe",
}'  "phoneNumber": "1234567890"
{"success":true,"data":{"userId":"67e421ec753ad638219d1804","merchantId":"67e421ec753ad638219d1804","email":"consumer@example.com","firstName":"John","lastName":"Doe","phoneNumber":"1234567890","_id":"67e5218a061e09cc270b8ee1","createdAt":"2025-03-27T09:59:38.120Z","updatedAt":"2025-03-27T09:59:38.120Z","__v":0}}a@a:~/stellar$ 



a@a:~/stellar$    curl -X GET http://localhost:3000/api/consumers/67e5218a061e09cc270b8ee1 \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MzI4LCJleHAiOjE3NDM2MDkxMjh9.PRA3riFrOpzlnZKdVlwurWcM2FTNWlD-Q0Yf1OK730U"
{"success":true,"data":{"_id":"67e5218a061e09cc270b8ee1","userId":"67e421ec753ad638219d1804","merchantId":"67e421ec753ad638219d1804","email":"consumer@example.com","firstName":"John","lastName":"Doe","phoneNumber":"1234567890","createdAt":"2025-03-27T09:59:38.120Z","updatedAt":"2025-03-27T09:59:38.120Z","__v":0}}a@a:~/stellar$ 



a@a:~/stellar$    curl -X POST http://localhost:3000/api/consumers/67e5218a061e09cc270b8ee1/payment-methodsa@a:~/stellar$    curl -X POST http://localhost:3000/api/consumers/67e5218a061e09cc270b8ee1/payment-methods \ -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5Z
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MzI4LCJleHAiOjE3NDM2MDkxMjh9.PRA3riFrOpzlnZKdVlwurWcM2FTNWlD-Q0Yf1OK730U" \ype: application/json" \
   -H "Content-Type: application/json" \
   -d '{type": "stellar_wallet",
       "type": "stellar_wallet",CMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZN",
       "identifier": "GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZN",
       "isDefault": true
   }'
{"success":true,"data":{"consumerId":"67e5218a061e09cc270b8ee1","type":"stellar_wallet","identifier":"GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZN","isDefault":true,"_id":"67e5229f061e09cc270b8ee6","createdAt":"2025-03-27T10:04:15.889Z","updatedAt":"2025-03-27T10:04:15.889Z","__v":0}}a@a:~/stellar$ 











a@a:~/stellar$    curl -X GET http://localhost:3000/api/consumers/67e5218a061e09cc270b8ee1/payment-methods \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MzI4LCJleHAiOjE3NDM2MDkxMjh9.PRA3riFrOpzlnZKdVlwurWcM2FTNWlD-Q0Yf1OK730U"
{"success":true,"data":[{"_id":"67e5229f061e09cc270b8ee6","consumerId":"67e5218a061e09cc270b8ee1","type":"stellar_wallet","identifier":"GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZN","isDefault":true,"createdAt":"2025-03-27T10:04:15.889Z","updatedAt":"2025-03-27T10:04:15.889Z","__v":0}]}a@a:~/stellar$ 




a@a:~/stellar$    curl -X PATCH http://localhost:3000/api/consumers/67e5218a061e09cc270b8ee1 \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MzI4LCJleHAiOjE3NDM2MDkxMjh9.PRA3riFrOpzlnZKdVlwurWcM2FTNWlD-Q0Yf1OK730U" \
   -H "Content-Type: application/json" \
   -d '{
       "phoneNumber": "9876543210"
   }'
{"success":true,"data":{"_id":"67e5218a061e09cc270b8ee1","userId":"67e421ec753ad638219d1804","merchantId":"67e421ec753ad638219d1804","email":"consumer@example.com","firstName":"John","lastName":"Doe","phoneNumber":"9876543210","createdAt":"2025-03-27T09:59:38.120Z","updatedAt":"2025-03-27T10:05:11.560Z","__v":0}}a@a:~/stellar$ 