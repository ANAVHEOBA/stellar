a@a:~/stellar$ curl -X POST http://localhost:3000/api/auth/challenge   -H "Content-Type: application/json"   -d '{"walletAddress": "GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZNZ"}'
{"success":true,"data":{"transaction":"AAAAAgAAAABxvKCvGy2is1n4ohgc2A3QU6BuuwblQDbC6mnPNJnIUgAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5CIRAAAAAAAAAAEAAAABAAAAAIghd72xxMV1hzEcUvCDNLSSBL4bcmEHtOUOyyyP7DbdAAAACgAAAARhdXRoAAAAAQAAACxybURkbTJFYVBKUzN5RzVuWk4yeEE1b1VNYVpaaE5hZG5yRS9ncENXV3ZRPQAAAAAAAAAA","networkPassphrase":"Test SDF Network ; September 2015"}}a@a:~/stellar$ 




CHALLENGE_TX="AAAAAgAAAABxvKCvGy2is1n4ohgc2A3QU6BuuwblQDbC6mnPNJnIUgAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5CIRAAAAAAAAAAEAAAABAAAAAIghd72xxMV1hzEcUvCDNLSSBL4bcmEHtOUOyyyP7DbdAAAACgAAAARhdXRoAAAAAQAAACxybURkbTJFYVBKUzN5RzVuWk4yeEE1b1VNYVpaaE5hZG5yRS9ncENXV3ZRPQAAAAAAAAAA"




a@a:~/stellar$ npx ts-node src/scripts/sign-challenge.ts "$CHALLENGE_TX" "SBXAAEWXWU2GXHVRTWU7CW3G2C3YSRNOR64JZTWK2UXUC6SM57G5XVA5"
AAAAAgAAAABxvKCvGy2is1n4ohgc2A3QU6BuuwblQDbC6mnPNJnIUgAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5CIRAAAAAAAAAAEAAAABAAAAAIghd72xxMV1hzEcUvCDNLSSBL4bcmEHtOUOyyyP7DbdAAAACgAAAARhdXRoAAAAAQAAACxybURkbTJFYVBKUzN5RzVuWk4yeEE1b1VNYVpaaE5hZG5yRS9ncENXV3ZRPQAAAAAAAAABj+w23QAAAECaySA4FovSY/wVl5ZRvRqtgpkK/CrQjEnByW/vDgnRvZfqGX5NYIOvPGB8u1h0AIBHnGnkFDUa4V7KO4NGLucG








a@a:~/stellar$ curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "signedChallenge": "AAAAAgAAAABxvKCvGy2is1n4ohgc2A3QU6BuuwblQDbC6mnPNJnIUgAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABn5CIRAAAAAAAAAAEAAAABAAAAAIghd72xxMV1hzEcUvCDNLSSBL4bcmEHtOUOyyyP7DbdAAAACgAAAARhdXRoAAAAAQAAACxybURkbTJFYVBKUzN5RzVuWk4yeEE1b1VNYVpaaE5hZG5yRS9ncENXV3ZRPQAAAAAAAAABj+w23QAAAECaySA4FovSY/wVl5ZRvRqtgpkK/CrQjEnByW/vDgnRvZfqGX5NYIOvPGB8u1h0AIBHnGnkFDUa4V7KO4NGLucG",
    "walletAddress": "GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZNZ",
    "userType": "consumer"
}'
{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MTQxLCJleHAiOjE3NDM2MDg5NDF9.hlPQgZ9xEUivX9aCsYg_N7W2YxYZG2Fgk51VvjApYks","user":{"walletAddress":"GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZNZ","userType":"consumer","isActive":true,"lastLogin":"2025-03-26T15:49:00.929Z","_id":"67e421ec753ad638219d1804","createdAt":"2025-03-26T15:49:00.952Z","updatedAt":"2025-03-26T15:49:00.952Z"}}}a@a:~/stellar$ 







a@a:~/stellar$ curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
{"success":true,"data":{"user":{"_id":"67e421ec753ad638219d1804","walletAddress":"GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZNZ","userType":"consumer","isActive":true,"lastLogin":"2025-03-26T15:49:00.929Z","createdAt":"2025-03-26T15:49:00.952Z","updatedAt":"2025-03-26T15:49:00.952Z"}}}







a@a:~/stellar$ curl -X GET http://localhost:3000/api/auth/check-token \
  -H "Authorization: Bearer $TOKEN"
{"success":true,"valid":true}a@a:~/stellar$ 






a@a:~/stellar$ curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Authorization: Bearer $TOKEN"
{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MjFlYzc1M2FkNjM4MjE5ZDE4MDQiLCJ1c2VyVHlwZSI6ImNvbnN1bWVyIiwid2FsbGV0QWRkcmVzcyI6IkdDRUNDNTU1V0hDTUs1TUhHRU9GRjRFREdTMkpFQkY2RE5aR0NCNVU0VUhNV0xFUDVRM04yWk5aIiwiaWF0IjoxNzQzMDA0MzI4LCJleHAiOjE3NDM2MDkxMjh9.PRA3riFrOpzlnZKdVlwurWcM2FTNWlD-Q0Yf1OK730U","user":{"_id":"67e421ec753ad638219d1804","walletAddress":"GCECC555WHCMK5MHGEOFF4EDGS2JEBF6DNZGCB5U4UHMWLEP5Q3N2ZNZ","userType":"consumer","isActive":true,"lastLogin":"2025-03-26T15:49:00.929Z","createdAt":"2025-03-26T15:49:00.952Z","updatedAt":"2025-03-26T15:49:00.952Z"}}}a@a:~/stellar$ 






curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"