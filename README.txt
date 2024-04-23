Here's the API documentation with curl commands for your project:

### Login
```bash
curl --silent --location --request POST 'http://localhost:1500/user/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY' \
--data-raw '{
    "type": "user",
    "email": "harsh04@yopmail.com",
    "password": "harsh@123"
}'
```

### Get Portfolio
```bash
curl --silent --location --request GET 'http://localhost:1500/portfolio?page=1&limit=10' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_access_token_here' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY' \
--data '{
    "page":1,
    "limit":10
}'
```

### Portfolio Holdings
```bash
curl --silent --location --request GET 'http://localhost:1500/portfolio/holdings' \
--header 'Authorization: Bearer your_access_token_here' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY'
```

### Portfolio Returns
```bash
curl --silent --location --request GET 'http://localhost:1500/portfolio/returns' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_access_token_here' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY' \
--data '{
    "page":1,
    "limit":10
}'
```

### Add Trade to Portfolio
```bash
curl --silent --location --request POST 'http://localhost:1500/portfolio/addTrade' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_access_token_here' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY' \
--data '{
    "stockId":"66264025e0ce00111110c356",
    "price":800,
    "type":"sell", 
    "quantity":100
}'
```

### Update Trade in Portfolio
```bash
curl --silent --location --request PUT 'http://localhost:1500/portfolio/updateTrade/66268ee254ca75485862382a' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_access_token_here' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY' \
--data '{
    "price":1000,
    "type":"sell", 
    "quantity":50
}'
```

### Remove Trade from Portfolio
```bash
curl --silent --location --request DELETE 'http://localhost:1500/portfolio/removeTrade/6626644011d8ea371e97718b' \
--header 'Authorization: Bearer your_access_token_here' \
--header 'Cookie: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY'
```

### Get Stokes
```bash
curl --silent --location --request GET 'http://localhost:1500/stokes' \
--header 'Cookie

: connect.sid=s%3AKuqLXEiIQ-tROmgx7ErD1GJtRJ9cvkRq.Mz1GdTQuhx7zPpB9D3f6d7hXarsQtlsCNmRQQTad1qY'
```

Please replace `your_access_token_here` with the actual access token obtained during the login process.