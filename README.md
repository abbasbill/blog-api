# blog-api
This is an api for a blog app

---


## Base URL
- [https://jade-smiling-goat.cyclic.app/](https://jade-smiling-goat.cyclic.app/)


## Models
---

### User
| #field     |  #data_type | #constraints  
|  id        |  string     |  required 
|  firstname | string      |  required
|  lastname  |  string     |  required  
|  email     | string      |  required 
|  password  |  string     |  required  




## APIs
---

### Signup User

- Route: /register
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe"
}
```

- Responses

Success
```
{
    message: 'success',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "firstname": "jon",
        "lastname": "doe"
    }
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "username": 'jon_doe",
}
```

- Responses

Success
```
{
    message: 'success',
    token: 'sjlkafjkldsfjsd'
}
```

---
### Create article

- Route: /articles/
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    items: [{ title: '', description: "", author: '', state: "published/draft", read_count: "", reading_time: "", tags: "", body: "", timestamp: ""}]

}
```


---
### Get article

- Route: /articles/:id
- Method: GET
- Header
    - Authorization: Bearer {token}

---

### Get articles

- Route: /orders
- Method: GET
- Header:
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - per_page (default: 10)
    - order_by (default: created_at)
    - order (options: asc | desc, default: desc)
    - state
    - created_at

---

...

## Contributor
- Billiamin Abbas
