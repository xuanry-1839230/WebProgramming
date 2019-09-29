-- Susan Yang
-- Section AB
-- A web store setup file for final project.
CREATE DATABASE IF NOT EXISTS store;

USE store;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS qas;

-- A table to hold information for all the products in the store
CREATE TABLE products(
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  img VARCHAR(55) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  pricerange VARCHAR(55) NOT NULL,
  deal VARCHAR(255)
);

-- A table to hold information for all all registered loyal customers
CREATE TABLE customers(
  customerid INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(55) NOT NULL,
  lastname VARCHAR(55) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- A table to hold information for all the user content entered in the contact page
CREATE TABLE contacts(
  contactid INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(55) NOT NULL,
  lastname VARCHAR(55) NOT NULL,
  email VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  customerid INT DEFAULT NULL,
  FOREIGN KEY (customerid) REFERENCES customers(customerid)
);

-- A table to hold information for for all the frequently asked questions and answers
CREATE TABLE qas(
  id VARCHAR(7) PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer VARCHAR(255) NOT NULL
);


INSERT INTO products
VALUES ("1", "Website Design", 40, "website.png", "Website design icon", "I will help you design your website.", "high/mid", ""),
       ("2", "Dog Grooming (Small and Medium dog only)", 20, "dog.png", "Dog grooming icon", "I will take care of your dog and make it look nice and pretty.", "mid", ""),
       ("3", "Translation", 15, "dictionary.png", "Dictionary translation icon", "I will translate between English and Chinese.", "mid/low", ""),
       ("4", "Group Swim Lesson (30 min/Up to 3 people)", 10, "people-swimming.png", "Two people swimming icon", "I will teach you swimming, along with other people.", "low", ""),
       ("5", "Group Swim Lesson (30 min Up to 3 people)", 8, "people-swimming.png", "Two people swimming icon", "I will teach you swimming, along with other people. Buy more for a lower price", "low", "BUNDLE DEAL"),
       ("6", "Private Swim Lesson (30 min)", 22, "swimming.png", "A person swimming icon", "I will teach you swimming, just you alone.", "mid", ""),
       ("7", "Private Swim Lesson (30 min)", 17, "swimming.png", "A person swimming icon", "I will teach you swimming, just you alone. Buy more for a lower price", "mid", "BUNDLE DEAL"),
       ("8", "Portrait Photography", 50, "portrait.png", "Portrait Photography icon", "I will take pictures for you and retouch them.", "high", ""),
       ("9", "Product Photography", 35, "product.png", "Product Photography icon", "I will take pictures for your product and retouch them.", "mid", ""),
       ("10", "Photo editing", 5, "retouch.png", "Photoshop icon", "I will edit/retouch your photos.", "low", ""),
       ("11", "Chinese Lessons", 20, "language.png", "Chinese lesson icon", "I will teach you Chinese.", "mid", ""),
       ("12", "Math Lessons", 20, "maths.png", "Math lesson icon", "I will teach you math.", "mid", ""),
       ("13", "Vinyl print sticker", 5, "sticker.png", "Sticker icon", "I will print custom stickers.", "low", ""),
       ("14", "Chat and give life advice", 100, "counsel.png", "Counseling icon", "I will chat with you and give you life advice.", "high", ""),
       ("15", "Donate here", 1, "donation.png", "Donation icon", "If you liked this website, please donate here to support us.", "low", "");


INSERT INTO customers
VALUES ("1", "testFirst", "testLast", "test@uw.edu", "testCustomer", "test");


INSERT INTO contacts
VALUES ("1", "testFirst", "testLast", "test@uw.edu", "I have an issue with the test", 1);

INSERT INTO qas
VALUES ("1", "When will the product be delivered?", "On the eighth day of the week, if I'm feeling it."),
       ("2", "What does starting at mean?", "The starting at price is our regular price, but at Susan's inconvinience store, we thrive to accommodate our customer's needs. So you can specify the details of your request on the Contact Us page and a new quote will be sent to you."),
       ("3", "How do I pay you?", "We accept venmo, paypal, check, and cash payment, just not credit or debit card. :)"),
       ("4", "Where will the offline services take place?", "Susan's inconvinience store is based in Seattle, WA, so all offline services will be offer in this area."),
       ("5", "Can I purchase/redeem a gift card?", "Maybe? Later?");
