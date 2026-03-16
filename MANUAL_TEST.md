# Manual Testing Guide - HobBees 🐝

A complete step-by-step guide for manually testing HobBees. No coding required - just follow these instructions!

## Prerequisites

Before you start testing:

1. ✅ Docker and Docker Compose are installed and running
2. ✅ Application is running:
   ```bash
   docker-compose up --build
   ```
3. ✅ Open your web browser to: http://localhost:5173
4. ✅ Have a notebook or text file ready to track test results

**Estimated Time:** 30-45 minutes for complete testing

---

## Test 1: User Registration

**Goal:** Verify new users can create an account

### Steps:
1. Open http://localhost:5173 in your browser
2. You should see a login page with username and password fields
3. Click on **"Don't have an account? Register"** link at the bottom
4. Fill in the registration form:
   - **Username**: `testuser1` (or any unique name)
   - **Email**: `testuser1@example.com`
   - **Password**: `TestPassword123!`
5. Click the **"Register"** button

### Expected Results:
- ✅ Page redirects to the dashboard (main page)
- ✅ You see "HobBees" title at the top
- ✅ No error messages appear
- ✅ Dashboard is empty (no hobbies yet)

### If Something Goes Wrong:
- ❌ "Username already registered" - Use a different username
- ❌ "Email already registered" - Use a different email
- ❌ Password error - Make sure password is at least 8 characters

---

## Test 2: Password Validation

**Goal:** Verify password requirements are enforced

### Steps:
1. Log out if you're logged in (look for Logout button/menu)
2. Click **"Don't have an account? Register"**
3. Try to register with:
   - Username: `shortpass`
   - Email: `short@example.com`
   - Password: `abc` (too short!)
4. Click **"Register"**

### Expected Results:
- ✅ Error message appears saying password must be at least 8 characters
- ✅ Registration does NOT succeed
- ✅ Form stays on registration page

### Now test a very long password:
1. Still on registration page
2. Use a password with 75+ characters (copy this):
   ```
   ThisIsAReallyLongPasswordThatExceeds72BytesAndShouldShowAWarningMessage123
   ```
3. Watch for a warning message about password length

### Expected Results:
- ✅ Warning appears if password is too long (only when typing, in register mode)
- ✅ Password byte counter may appear

---

## Test 3: Login with Existing Account

**Goal:** Verify users can log back in

### Steps:
1. If you're on the registration page, click **"Already have an account? Login"**
2. Enter your credentials from Test 1:
   - Username: `testuser1`
   - Password: `TestPassword123!`
3. Click **"Login"**

### Expected Results:
- ✅ Redirects to dashboard
- ✅ You're logged in (see your username or menu)
- ✅ No error messages

### Test Wrong Password:
1. Log out
2. Try to login with:
   - Username: `testuser1`
   - Password: `WrongPassword!` (incorrect)
3. Click **"Login"**

### Expected Results:
- ✅ Error message: "Incorrect username or password"
- ✅ Stays on login page
- ✅ Does NOT let you in

---

## Test 4: Create Your First Hobby

**Goal:** Create a hobby to track

### Steps:
1. Make sure you're logged in and on the dashboard
2. Look for a button like **"Create Hobby"**, **"Add Hobby"**, or **"New Hobby"**
3. Click the button
4. Fill in the form:
   - **Name**: `Fountain Pens`
   - **Description**: `My collection of beautiful fountain pens`
5. Click **"Save"** or **"Create"**

### Expected Results:
- ✅ New hobby appears on the dashboard
- ✅ Shows "Fountain Pens" as the title
- ✅ Shows the description you entered
- ✅ Modal/form closes automatically

### Test Creating Multiple Hobbies:
Repeat the above steps to create 2 more hobbies:
- **Name**: `Reading`, **Description**: `Books I'm reading`
- **Name**: `Gardening`, **Description**: `Plants and garden projects`

### Expected Results:
- ✅ All 3 hobbies appear on the dashboard
- ✅ Each shows its own name and description
- ✅ They are clearly separated/distinguishable

---

## Test 5: View Hobby Details

**Goal:** Open and view a hobby you created

### Steps:
1. On the dashboard, click on **"Fountain Pens"** hobby
2. You should navigate to the hobby detail page

### Expected Results:
- ✅ Page shows "Fountain Pens" as the title
- ✅ Shows the description
- ✅ Shows empty categories area (no categories yet)
- ✅ Has a button to add categories
- ✅ Has a button/link to go back to dashboard

---

## Test 6: Edit a Hobby

**Goal:** Modify hobby name and description

### Steps:
1. On the hobby detail page for "Fountain Pens"
2. Look for an **"Edit"** button or pencil icon
3. Click it
4. Change the name to: `My Fountain Pens`
5. Change description to: `Beautiful writing instruments collection`
6. Click **"Save"**

### Expected Results:
- ✅ Name updates to "My Fountain Pens"
- ✅ Description updates to new text
- ✅ Changes are saved (refresh page to verify)
- ✅ No error messages

---

## Test 7: Add a Category

**Goal:** Add a category with custom fields to your hobby

### Steps:
1. On the "My Fountain Pens" hobby page
2. Click **"Add Category"** or **"New Category"**
3. Fill in the category form:
   - **Category Name**: `Pen Collection`
4. Now add custom fields for this category:
   
   **Field 1:**
   - Field Name: `Brand`
   - Type: `Text`
   - Required: ✅ Check this
   
   **Field 2:**
   - Click **"Add Field"**
   - Field Name: `Model`
   - Type: `Text`
   - Required: ⬜ Leave unchecked
   
   **Field 3:**
   - Click **"Add Field"**
   - Field Name: `Purchase Date`
   - Type: `Date`
   - Required: ⬜ Leave unchecked
   
   **Field 4:**
   - Click **"Add Field"**
   - Field Name: `Price`
   - Type: `Number`
   - Required: ⬜ Leave unchecked

5. Click **"Save"** or **"Create Category"**

### Expected Results:
- ✅ Category "Pen Collection" appears in the hobby
- ✅ Category shows the 4 fields you defined
- ✅ You can click on the category to view it

---

## Test 8: Add Items to Category

**Goal:** Add actual pen entries to your collection

### Steps:
1. Click on the **"Pen Collection"** category you just created
2. Click **"Add Item"** or **"New Item"**
3. Fill in the form with your first pen:
   - **Brand**: `Pilot` (required field)
   - **Model**: `Custom 823`
   - **Purchase Date**: Select any date (like `2024-01-15`)
   - **Price**: `280`
4. Click **"Save"** or **"Add"**

### Expected Results:
- ✅ Item appears in the list
- ✅ Shows "Pilot" and "Custom 823"
- ✅ Shows the date and price you entered
- ✅ Form closes

### Add More Items:
Repeat to add 2 more pens:

**Pen 2:**
- Brand: `Lamy`
- Model: `2000`
- Purchase Date: `2024-02-20`
- Price: `150`

**Pen 3:**
- Brand: `Sailor`
- Model: `Pro Gear`
- Purchase Date: `2024-03-10`
- Price: `220`

### Expected Results:
- ✅ All 3 pens appear in the list
- ✅ Each shows its own details
- ✅ Items are clearly organized

---

## Test 9: Required Field Validation

**Goal:** Verify required fields are enforced

### Steps:
1. Still in the "Pen Collection" category
2. Click **"Add Item"**
3. **Leave the "Brand" field empty** (it's required!)
4. Fill in only:
   - Model: `Test Pen`
   - Price: `100`
5. Try to click **"Save"**

### Expected Results:
- ✅ Error message appears saying "Brand is required" or similar
- ✅ Item is NOT saved
- ✅ Form stays open
- ✅ You cannot proceed without filling the required field

### Now Fix It:
1. Fill in Brand: `Test Brand`
2. Click **"Save"**

### Expected Results:
- ✅ Item saves successfully
- ✅ Appears in the list

---

## Test 10: Edit an Item

**Goal:** Modify an existing item

### Steps:
1. In the item list, find the "Pilot Custom 823"
2. Look for an **"Edit"** button or pencil icon next to it
3. Click it
4. Change:
   - Model: `Custom 823 - Fine Nib`
   - Price: `295`
5. Click **"Save"**

### Expected Results:
- ✅ Item updates with new information
- ✅ Shows "Custom 823 - Fine Nib"
- ✅ Shows price `295`
- ✅ Changes persist (refresh to verify)

---

## Test 11: Delete an Item

**Goal:** Remove an item from the collection

### Steps:
1. Find the "Test Brand Test Pen" item you created
2. Look for a **"Delete"** button or trash icon
3. Click it
4. If there's a confirmation dialog, click **"Confirm"** or **"Yes"**

### Expected Results:
- ✅ Item disappears from the list
- ✅ Other items remain unchanged
- ✅ Item count decreases by 1

---

## Test 12: Add Another Category

**Goal:** Add a second category with different fields

### Steps:
1. Go back to the hobby page (click **"Back"** or hobby name link)
2. Click **"Add Category"**
3. Create a new category:
   - **Category Name**: `Ink Collection`
   - **Field 1**: Name: `Color`, Type: `Text`, Required: ✅
   - **Field 2**: Name: `Brand`, Type: `Text`, Required: ✅
   - **Field 3**: Name: `Volume (ml)`, Type: `Number`, Required: ⬜
   - **Field 4**: Name: `Opened`, Type: `Boolean`, Required: ⬜
4. Click **"Save"**

### Expected Results:
- ✅ Both categories appear in the hobby
- ✅ "Pen Collection" and "Ink Collection" are both visible
- ✅ Each maintains its own field schema

---

## Test 13: Different Field Types

**Goal:** Verify all field types work correctly

### Steps:
1. Click on **"Ink Collection"** category
2. Add an item:
   - **Color**: `Blue-Black`
   - **Brand**: `Pilot`
   - **Volume (ml)**: `60`
   - **Opened**: ✅ Check the box
3. Click **"Save"**

### Expected Results:
- ✅ Text fields show text properly
- ✅ Number field shows 60 as a number
- ✅ Boolean field shows as checked/true
- ✅ All data types are stored correctly

### Add Another Ink:
- Color: `Red`
- Brand: `Diamine`
- Volume (ml): `30`
- Opened: ⬜ Leave unchecked

### Expected Results:
- ✅ Unchecked boolean shows as false/unchecked
- ✅ Both items appear with different boolean values

---

## Test 14: Delete a Category

**Goal:** Remove an entire category

### Steps:
1. Go back to the hobby page
2. Find the **"Ink Collection"** category
3. Look for a **"Delete"** button/icon for the category (not items)
4. Click it
5. Confirm if prompted

### Expected Results:
- ✅ "Ink Collection" category disappears
- ✅ All items in that category are also removed
- ✅ "Pen Collection" category remains untouched
- ✅ Items in "Pen Collection" are still there

---

## Test 15: Delete a Hobby

**Goal:** Remove an entire hobby

### Steps:
1. Go back to the dashboard
2. Find the **"Gardening"** hobby you created earlier
3. Click on it to open it
4. Look for a **"Delete Hobby"** button (may be at the top or bottom)
5. Click it
6. Confirm deletion

### Expected Results:
- ✅ Hobby is deleted
- ✅ Redirects back to dashboard
- ✅ "Gardening" no longer appears
- ✅ Other hobbies remain intact

---

## Test 16: Edit Mode Feature

**Goal:** Test the bee-themed edit mode

### Steps:
1. On the dashboard, look for an **"Edit Mode"** toggle or button
2. Click it to enable edit mode

### Expected Results:
- ✅ UI theme changes from yellow to **red**
- ✅ Edit buttons become more visible/accessible
- ✅ Page indicates you're in edit mode

### Test Unsaved Changes:
1. While in edit mode, click on a hobby
2. Click edit on the hobby name
3. Change the name but **don't save**
4. Try to navigate away (click Back or another hobby)

### Expected Results:
- ✅ Warning appears about unsaved changes
- ✅ Option to cancel navigation
- ✅ Option to discard changes
- ✅ Changes are not lost if you cancel

---

## Test 17: Multiple Users (Data Isolation)

**Goal:** Verify users can't see each other's data

### Steps in Incognito/Private Window:
1. Open a **new incognito/private browsing window**
2. Go to http://localhost:5173
3. Register a NEW user:
   - Username: `testuser2`
   - Email: `testuser2@example.com`
   - Password: `TestPassword123!`
4. Look at the dashboard

### Expected Results:
- ✅ Dashboard is **completely empty**
- ✅ testuser2 does NOT see testuser1's hobbies
- ✅ testuser2 has a fresh, clean slate

### Create a Hobby for testuser2:
1. Create a hobby: "Photography"
2. Go back to your original browser window (testuser1)
3. Refresh the page

### Expected Results:
- ✅ testuser1 does NOT see "Photography" hobby
- ✅ testuser1 only sees their own hobbies
- ✅ Data is completely isolated between users

---

## Test 18: Logout and Login Again

**Goal:** Verify data persists across sessions

### Steps:
1. While logged in as testuser1, note all your hobbies
2. Click **"Logout"**
3. You should be back at the login page
4. Log back in:
   - Username: `testuser1`
   - Password: `TestPassword123!`

### Expected Results:
- ✅ All your hobbies are still there
- ✅ Categories are intact
- ✅ Items are intact
- ✅ All data persisted correctly

---

## Test 19: API Documentation

**Goal:** Verify API docs are accessible

### Steps:
1. Open a new browser tab
2. Go to: http://localhost:8000/docs
3. You should see the FastAPI Swagger UI

### Expected Results:
- ✅ API documentation page loads
- ✅ Shows all endpoints (auth, hobbies, categories, items)
- ✅ Can expand endpoints to see details
- ✅ Has "Try it out" buttons for testing

### Optional - Test an Endpoint:
1. Find **POST /api/auth/login**
2. Click **"Try it out"**
3. Enter your credentials
4. Click **"Execute"**

### Expected Results:
- ✅ Returns 200 status code
- ✅ Returns access token
- ✅ Shows response body with token

---

## Test 20: Responsive Design (Mobile)

**Goal:** Verify mobile layout works

### Steps:
1. In your browser, open **Developer Tools** (F12)
2. Click the **"Toggle device toolbar"** icon (looks like a phone)
3. Select "iPhone 12" or "Pixel 5" from the device dropdown
4. Navigate through the app:
   - Dashboard
   - Hobby detail page
   - Category page
   - Forms (add/edit)

### Expected Results:
- ✅ Layout adapts to mobile screen size
- ✅ No horizontal scrolling required
- ✅ Buttons are tappable (not too small)
- ✅ Forms are usable on mobile
- ✅ Text is readable without zooming

---

## Test 21: Browser Compatibility

**Goal:** Verify app works in different browsers

### Test In:
1. **Google Chrome** - Complete tests 1-10
2. **Firefox** - Complete tests 1-10
3. **Safari** (if on Mac) - Complete tests 1-10
4. **Edge** (if on Windows) - Complete tests 1-10

### Expected Results (All Browsers):
- ✅ All functionality works identically
- ✅ UI looks consistent
- ✅ No console errors
- ✅ Authentication works
- ✅ CRUD operations work

---

## Test 22: Error Handling

**Goal:** Verify graceful error handling

### Test Network Error:
1. While logged in, open Developer Tools (F12)
2. Go to the **"Network"** tab
3. Set throttling to **"Offline"**
4. Try to create a new hobby
5. Click Save

### Expected Results:
- ✅ Shows error message (e.g., "Failed to connect" or "Network error")
- ✅ Doesn't crash the app
- ✅ UI remains usable
- ✅ Can retry when back online

### Test Server Down:
1. Stop the Docker containers: `docker-compose down`
2. Try to use the app

### Expected Results:
- ✅ Shows appropriate error messages
- ✅ Doesn't show raw error details to user
- ✅ When you restart containers, app works again

---

## Test 23: Data Validation Edge Cases

**Goal:** Test boundary conditions

### Test Very Long Names:
1. Try to create a hobby with name:
   ```
   ThisIsAReallyLongHobbyNameThatGoesOnAndOnAndOnAndShouldBeValidatedProperly
   ```
2. Try to create a category with a super long field name

### Expected Results:
- ✅ Either accepts it (if limit is high)
- ✅ OR shows validation error with character limit
- ✅ Doesn't crash or break the UI

### Test Special Characters:
1. Create a hobby with name: `Cooking 🍳 & Baking 🎂`
2. Add emoji and special characters: `日本語 & Español`

### Expected Results:
- ✅ Accepts Unicode characters
- ✅ Displays them correctly
- ✅ Saves and retrieves them properly

---

## Test 24: Performance Check

**Goal:** Verify app remains responsive with lots of data

### Steps:
1. Create a hobby with 3-4 categories
2. In each category, add 10-15 items
3. Total: ~40-60 items across categories
4. Navigate through the app

### Expected Results:
- ✅ Pages load within 1-2 seconds
- ✅ No lag when scrolling
- ✅ Forms still responsive
- ✅ Editing works smoothly
- ✅ No browser freezing

---

## Test Summary Checklist

Print this and check off as you complete tests:

### Authentication
- [ ] Test 1: User Registration
- [ ] Test 2: Password Validation
- [ ] Test 3: Login with Existing Account
- [ ] Test 17: Multiple Users (Data Isolation)
- [ ] Test 18: Logout and Login Again

### Hobby Management
- [ ] Test 4: Create Your First Hobby
- [ ] Test 5: View Hobby Details
- [ ] Test 6: Edit a Hobby
- [ ] Test 15: Delete a Hobby

### Category Management
- [ ] Test 7: Add a Category
- [ ] Test 12: Add Another Category
- [ ] Test 14: Delete a Category

### Item Management
- [ ] Test 8: Add Items to Category
- [ ] Test 9: Required Field Validation
- [ ] Test 10: Edit an Item
- [ ] Test 11: Delete an Item
- [ ] Test 13: Different Field Types

### UI/UX Features
- [ ] Test 16: Edit Mode Feature
- [ ] Test 20: Responsive Design (Mobile)
- [ ] Test 21: Browser Compatibility

### Technical
- [ ] Test 19: API Documentation
- [ ] Test 22: Error Handling
- [ ] Test 23: Data Validation Edge Cases
- [ ] Test 24: Performance Check

---

## Common Issues and Solutions

### Issue: "Can't connect to backend"
**Solution:** 
- Check if Docker containers are running: `docker-compose ps`
- Restart containers: `docker-compose restart`
- Check logs: `docker-compose logs backend`

### Issue: "Registration fails"
**Solution:**
- Make sure username/email are unique
- Check password is at least 8 characters
- Try a different browser
- Clear browser cache/cookies

### Issue: "Data disappeared"
**Solution:**
- Check if you ran `docker-compose down -v` (this deletes data)
- Make sure you're logged in as the correct user
- Verify MongoDB container is running

### Issue: "UI looks broken"
**Solution:**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check browser console (F12) for errors
- Restart frontend container

### Issue: "Forms don't submit"
**Solution:**
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Try disabling browser extensions
- Test in incognito/private mode

---

## Reporting Bugs

If you find a bug, document:

1. **What you did** (exact steps)
2. **What you expected** to happen
3. **What actually happened** (with screenshots)
4. **Browser** and version
5. **Console errors** (press F12, check Console tab)

Example Bug Report:
```
Title: Cannot save hobby with emoji in name

Steps:
1. Click "Create Hobby"
2. Name: "Cooking 🍳"
3. Description: "Test"
4. Click Save

Expected: Hobby saves successfully
Actual: Error "Invalid character in name"
Browser: Chrome 120.0
Console Error: "SyntaxError: Unexpected token..."
```

---

## Testing Complete! 🎉

If you've completed all 24 tests and everything passed:
- ✅ Authentication works
- ✅ CRUD operations work
- ✅ Data validation works
- ✅ UI/UX features work
- ✅ Multi-user isolation works
- ✅ App is production-ready!

**Great job testing HobBees! Your thorough testing helps ensure quality.** 🐝✨
