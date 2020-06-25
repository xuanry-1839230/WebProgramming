# *Journals* API Documentation
*This API allows the client to send information of a journal and send a name, it can save and
 retrieve the information of the most recent journal and all the names entered.*

## /journal
**Request Format:** /journal

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves a JSON of the information of the current journal.


**Example Request:** /journal

**Example Response:**

```json
{
  "date":"2018-03-07",
  "title":"Hello",
  "text":"Hello world"
}
```

**Error Handling:**
Responds with a 500 status plain text message if there's an issue with reading the file.

## /names
**Request Format:** /names

**Request Type:** GET

**Returned Data Format**: TEXT

**Description:** Retrieves a plain text list of all names previously inputted to the page.

**Example Request:** /names

**Example Response:**

```
Foo
Bar
Susan
Chris
Mowgli
```

**Error Handling:**
Responds with a 500 status plain text message if there's an issue with reading the file.

## /journal/:data
**Request Format:** /journal/:data

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Takes in the data parameter and makes a new journal replacing the current journal,
then retrieves the JSON of the new journal.

**Example Request:** /journal/{"date":"2018-03-07","title":"Hello","text":"Hello world"}

**Example Response:**

```json
{
  "date":"2018-03-07",
  "title":"Hello",
  "text":"Hello world"
}
```

**Error Handling:**
Responds with a 400 status plain text message if the data in JSON form is missing a key/keys.
Responds with a 500 status plain text message if there's an issue with reading the file.

## /names/:names
**Request Format:** /names/:names

**Request Type:** GET

**Returned Data Format**: TEXT

**Description:** Takes in the name parameter and adds it to the current log of names, then provides
a plain text that indicate adding name was successful.

**Example Request:** /names/Susan

**Example Response:**

```
  Successfully added name!
```

**Error Handling:**
Responds with a 500 status plain text message if there's an issue with reading the file.
