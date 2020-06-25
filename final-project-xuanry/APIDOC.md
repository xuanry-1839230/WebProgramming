# *Susan's convenience store* API Documentation
*This API allows the client to see the products in the store, filter them by price, add them to cart, and they can also send messages using the contact page.*

## /items/all
**Request Format:** /items/all

**Request Type:** GET

**Returned Data Format**: JSON (array of JSON)

**Description:** Retrieves a JSON representing all the information about all the products.


**Example Request:** /items/all

**Example Response:**

```json
{
  "dog-grooming":
    {
      "id": "2",
      "name":"Dog Grooming Service(Small and Medium dog only)",
      "price":"20",
      "description":"Dog grooming service, will take care of your dog and make sure it looks fab.",
      "image":"img/dog.png"
    },
  "translation":
  {
    "id": "3",
    "name":"Translation Service",
    "price":"12",
    "description":"Translation service, can translate all kinds of documents.",
    "image":"img/dictionary.png"
  },
  "..."
}
```

**Error Handling:**
Responds with a 500 status plain text message if there's an issue with reading the file.

## /items/filter/:low/:mid/:high
**Request Format:** /items/filter/:low/:mid/:high

**Request Type:** GET

**Returned Data Format**: JSON (array of JSON)

**Description:** Takes in the range parameter and then retrieves a JSON representing all the items within the given price range.


**Example Request:** /items/filter/1/0/0

**Example Response:**

```json
{
  "translation":
  {
    "id": "3",
    "name":"Translation Service",
    "price":"12",
    "description":"I can translate all kinds of documents.",
    "image":"img/dictionary.png"
  },
  "group-swim":
  {
    "id": "4",
    "name":"Group Swim Lesson (30 min Up to 3 people)",
    "price":"10",
    "description":"I'll teach you to swim, you can bring a friend or not.",
    "image":"img/people-swimming.png"
  },
  "..."
}
```

**Error Handling:**
Responds with a 500 status plain text message if there's an issue with reading the file.


## /item/:id
**Request Format:** /item/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Takes in an id parameter and then retrieves the JSON of the item corresponding to the given id.

**Example Request:** /item/1

**Example Response:**

```json
{
  "id": "1",
  "name":"Website Design Service",
  "price":"40",
  "description":"I can design your website, any kind of website you'd like, whether it's personal, professional or just for fun.",
  "image":"img/website.png"
}
```

**Error Handling:**
Responds with a 400 status plain text message if the id doesn't correspond to an item's id.
Responds with a 500 status plain text message if there's an issue with reading the file.

## /faq
**Request Format:** /faq

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves an array of JSON representing all questions and answers on the database.

**Example Request:** /faq

**Example Response:**

```json
[
  {
    "question":"Is this a dummy question?",
    "answer":"This is a dumb question."
  },
  {
    "question":"When will the product be delivered?",
    "answer":"On the eighth day of the week, if I'm feeling it."
  },
  "..."
]
```

## /user/contact
**Request Format:** /contact

**Request Type:** POST

**Returned Data Format**: TEXT

**Description:** Takes in a form data that contains information of the message and adds it to the database then provides a plain text that indicate sending message was successful.

**Example Request:** /user/contact

Form data as below
``` form
{
  "first-name": "Susan",
  "last-name":"Yang",
  "email":"iammad@gmail.com",
  "text":"I never received this product",
}
```

**Example Response:**

```
  Message successfully sent!
```

**Error Handling:**
Responds with a 400 status plain text message if a field required in the form data is missing.
Responds with a 500 status plain text message if there's an issue with reading the file.

## /user/signup
**Request Format:** /user/signup

**Request Type:** POST

**Returned Data Format**: TEXT

**Description:** Takes in a form data that contains information of the new user and adds it to the database then provides a plain text that indicate adding new user was successful.

**Example Request:** /user/signup

Form data as below
``` form
{
  "first-name": "Susan",
  "last-name":"Yang",
  "email":"syang@gmail.com",
  "username":"s_yang",
  "password":"password",
}
```

**Example Response:**

```
  Account successfully created!
```

**Error Handling:**
Responds with a 400 status plain text message if there exists a duplicate email or username in the database.
Responds with a 500 status plain text message if there's an issue with reading the file.
