# HobBees Application Plan
## Description
HobBees is a web application designed to track Hobbies. You will be able to create, delete, and edit Hobbies from the main screen. Once a Hobby is created then you will be able to add Categories to the Hobby. Within the categories will be Sub Categories that hold the data on items. See 'Hierarchy of Data' section for an example of data.

The details are custom so every entry in the DB should be seen as a Document, maybe store in JSON in a MongoDB would be best. So A Hobby will have custom Categories added to it. Within those categories are Sub Categories that will be the details of the items needed for the hobby. Details could be descriptive measurements, quantity that you have in stock , Brands, Name, etc. The Sub Categories would be assigned to a Category but the fields and values in the Sub Categories should be custom. This is so we can keep things separate as an example of what NOT should happen is looking in Slingshots and seeing Knitting Needles. 


## Usage HowTo
Main page shows a login which will have database login and possibly access to SSO (single Sign-On).
After logging in there will be a main page that has a drop down menu. Use the three line "burger' style for this menu. The menu Items will be
- New Hobby
- Edit/Delete
- Settings
- Logout

If Edit/Delete is selected then the screen goes in to Edit Mode where values can be edited or deleted. When in Edit mode there will be a Save, and a Cancel button wappear at the bottom of the screen. It would be great if those could be floating so they stay on the screen whilst scrolling. Also, whilst in Edit mode the screen colours should be different. So the main screens should be based on a Bee like style with black and ellow. But in Edit Mode maybe change the yellow to red. 

If the database already has one or more Hobby's entrered then the main screen will show these down the left side of the screen as tabs. If you click on a Hobby tab from the left then the main section of the screen will show the details of the hobby and items you have. 

## Working Example
1. User logs in with username and password
2. Main screen has burger style menu
3. Main screen shows three previously set up Hobbys read from the database as tabs down the left hand side, these are:
    Slingshot
    Clay
    Knitting
4. User clicks on Slingshot and the right panel shows the Categories in the database we have for this hobby. Examples of items could be
    Slingshot Frames
    Latex
    Pouches
    Steel Ammo
5. Within each Category there will be data. There will be a box surrounding all of the Slingshot Frames and then a list of the Frames, with their details, entered inside that box.  So this could be Brand, Fork Width, etc. All of these are custom created for each of the Sub Categories. 
6. User clicks Add New button at the top of a category, in this example let's say Latex.
7. Latex will have been configured to have specific fields to enter. A Form should pop up wioth those fields and have correct style entry. So dates would have data picker, Numbers would have a Text Entry box and Up and Down arrows. etc. 
8. User enters data as per the form which is read from the database. 
9. user needs to add a new Sub Category of 'Clay Ammo' so clicks on New Sub Category button on the right side of the screen at the tip and gets a window pop up wheere they can add field names and tyoe of entry. So in the example they would create Clay Ammo as a Sub Category. Then a form/window pop up allows then to create as many fields as need byu giving a name for the field and type of data. This is what goes in to the Array in the final level of the hierarchy of data. 

## Hierarchy of Data
1. Hobby Name (e.g. Slingshot)
2. Categories (e.g. Slingshot Frame, and Latex, etc.)
3. Sub Categories (e.g. for Latex would be things like thickness, Colour, Brand etc)

### Example Hierarchy in JSON
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

When a Hobby is selected, then the "Burger' menu will have these options so it is contextual:
- New Category
- Edit/Delete
If "New Category" is clicked then a pop up window appears with a 'Text Box' and 'Ok' and 'Cancel' buttons. The user would enter a Category for the hobby. This category then appears in a box. 
At the top of each box of Categories there should be buttons for 'Add New' which allows for adding a new Sub Category item. When this is clicked a form pops up with the Configured Fields for that Sub Category.

## Technologies used
1. FastAPI
2. Database back-end MongoDB or other free JSON based software 
3. Front End will be React