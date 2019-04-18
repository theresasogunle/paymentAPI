# User authentication

To authenticate a user. We have to consider User experience. So we have to first go through some steps

## 1. Get User Status
We use the `authenticateUser()` query to know if a user is registered or not.

> sample result
```json
{
  "data": {
    "authenticateUser": {
      "status": "register", // or login
      "phonenumber": "+2347036940767"
    }
  }
}
```

Two things happen.
1. if a user is not registered, it returns a `status` of `register`
2. if a user is registered, it returns a `status` of `login`

So we can show different screens depending on the status

## 2. Register User

So if the status is register we would run this mutation `signUp`

