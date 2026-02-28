# HobBees Application Plan
## Description
HobBees is a web application designed to track Hobbies. You will be able to create, delete, and edit Hobbies from the main screen. Once a Hobby is created then you will be able to add Categories to the Hobby. Within the categories will be Sub Categories taht hold the data on items, qty etc. 

The details are custom so every entry in the DB should be seen as a Document, maybe store in JSON in a MongoDB would be best. So A Hobby will have custom Categories added to it. Within those categories are Sub Categories that will be the details of the items needed for the hobby and quantiy. Details could be descriptive measurements, quantity that you have in stock ,etc. The Sub Categories would be assigned to a Category but the fields and values in the Sub Categories should be custom. This is so we can keep things separate as an example of what NOT should happen is looking in Slingshots nad seeing Knitting Needles. 


## Usage HowTo
Main page shows a login which will have database login and possibly access to SSO (single Sign-On).
After logging in there will be a main page that has a drop down menu. Use the three line "burger' style for this menu. The menu Items will be
- New Hobby
- Edit/Delete
- Settings
- Logout

If Edit/Delete is selected then the screen goes in to Edit Mode where values can be edited or deleted. When in Edit mode there will be a Save, and a Cancel button wappear at the bottom of the screen. It would be great if those could be floating so they stay on the screen whilst scrolling. . 

## Hierarchy of Data
1. Hobby Name (e.g. Slingshot)
2. Categories (e.g. Slingshot Frame, and Latex, etc.)
3. Sub Categories (e.g. for Latex would be things like thickness, Colour, Brand etc)

If the database already has one or more Hobby's entrered then the main screen will show these down the left side of the screen as tabs. If you click on a Hobby tab from the left then the main section of the screen will show the details of the hobby and items you have. 

## Working Example
1. User logs in with username and password
2. Main screen has burger style menu
3. Main screen shows three previously set up Hobbys as tabs down the left hand side, these are:
    Slingshot
    Clay
    Knitting
4. User clicks on Slingshot and the right panel shows the Categories in the database we have for this hobby. Examples of items could be
    Slingshot Frames
    Latex
    Pouches
    Steel Ammo
5. Within each Category there will be data. There will be a box surrounding all of the Slingshot Frames and then a list of the Frames, with their details, entered inside that box.  So this could be Brand, Fork Width, etc. All of these are custom created for each of the Sub Categories. 

### Example Hierarchy 
{
  "Hobbys": {
    "Slingshot": {
      "Slingshot Frames": [
        {
          "Brand": "Simpleshot",
          "Name": "Scout X",
          "ForkWidth_mm": 95,
          "Clips": true
        }
      ],
      "Latex": [
        {
          "Brand": "Snipersling",
          "Colour": "Yellow",
          "Thickness": 0.4,
          "Quantity": 4
        },
        {
          "Brand": "Snipersling",
          "Colour": "Black",
          "Thickness": 0.45,
          "Quantity": 1
        },
        {
          "Brand": "Tritium",
          "Colour": "Pink",
          "Thickness": 0.45,
          "Quantity": 3
        }
      ],
      "Steel Ammo": [
        {
          "Size": 8,
          "Quantity": 1000
        },
        {
          "Size": 9.5,
          "Quantity": 5000
        },
        {
          "Size": 11,
          "Quantity": 25
        }
      ]
    },
    "Knitting": {
      "Needles": [
        {
          "Brand": "MyNeedles.com",
          "Size": 0.5,
          "Quantity": 2
        },
        {
          "Brand": "MyNeedles.com",
          "Size": 0.75,
          "Quantity": 2
        }
      ],
      "Yarn": [
        {
          "Brand": "Willie_Woolies",
          "Size": 10,
          "Colour": "Yellow",
          "Quantity": 1
        },
        {
          "Brand": "Willie_Woolies",
          "Size": 10,
          "Colour": "Tartan",
          "Quantity": 1
        },
        {
          "Brand": "Willie_Woolies",
          "Size": 10,
          "Colour": "Black",
          "Quantity": 1
        }
      ]
    }
  }
}







When a Hobby is selected the "Burger' menu will have these options:
- New Category or Item
- Edit/Delete
If "New Category or Item" is clioked the na pop up window appears with jsut a text Box and Ok and Cancel buttons. The user would enter a Category of items for the hobby. 

## Technologies used
1. FastAPI
2. Database back end either Postgres or MongoDB 
3. Front End will be either React or HTMX