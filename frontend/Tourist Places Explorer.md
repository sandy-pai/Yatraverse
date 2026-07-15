## **Tourist Places Explorer** 

## **Project Overview** 

Build a **Tourist Places Explorer** web application using the **MERN Stack** . 

The application should allow an **Administrator** to manage tourist places (Add, Update, Delete), while users can browse, search, filter, and view detailed information about tourist destinations. 

The project should use: 

- **Frontend:** React.js 

- **Backend:** Express.js 

- **Database:** MongoDB Atlas 

- **Deployment:** Frontend (Vercel/Netlify), Backend (Vercel/Render) 

## **Learning Objectives** 

By completing this project, students should be able to: 

- Build REST APIs using Express.js 

- Connect Express with MongoDB Atlas 

- Perform CRUD operations 

- Use React to consume APIs 

- Implement Search functionality 

- Implement Filter functionality 

- Handle Forms in React 

- Use React Router 

- Manage MongoDB collections 

- Deploy Full Stack applications 

## **Technology Stack** 

## **Backend** 

- Node.js 

- Express.js 

- MongoDB Atlas 

- Mongoose 

- dotenv 

- cors 

## **Frontend** 

- React.js 

- React Router DOM 

- Axios 

- CSS 

## **Database** 

Database Name 

```
tourism
```

Collection Name 

```
places
```

## **Tourist Place Document** 

Each tourist place should be stored like this: 

```
{
    "_id":"ObjectId",
    "name":"Mysore Palace",
    "state":"Karnataka",
    "city":"Mysore",
    "image":"https://.....",
    "description":"Historic royal palace of Mysore.",
    "bestTime":"October - February",
    "entryFee":100,
    "rating":4.8,
    "location":"Mysore, Karnataka",
    "createdAt":"Date"
}
```

## **Backend Folder Structure** 

```
backend
```

```
│
├── server.js
├── package.json
├── .env
│
├── config
│      db.js
│
├── models
│      Place.js
│
├── routes
│      placeRoutes.js
│
├── controllers
│      placeController.js
│
└── middleware
```

## **Frontend Folder Structure** 

```
frontend
```

```
│
├── src
│
├── components
│      Navbar.jsx
│      SearchBar.jsx
│      PlaceCard.jsx
│
├── pages
│      Home.jsx
│      PlaceDetails.jsx
│      Admin.jsx
│      AddPlace.jsx
│      EditPlace.jsx
│
├── App.jsx
```

## **Backend APIs** 

## **1. Add Tourist Place** 

## **Method** 

```
POST
```

## **URL** 

```
/api/places
```

Purpose 

Admin can add a new tourist place. 

Example Request 

`{ "name":"Mysore Palace", "state":"Karnataka", "city":"Mysore", "image":"https://.....", "description":"Beautiful historical palace", "bestTime":"October-February", "entryFee":100, "rating":4.8, "location":"Mysore" }` Response `{ "message":"Tourist Place Added Successfully" }` 

## **2. Get All Tourist Places** 

## **Method** 

```
GET
```

## **URL** 

```
/api/places
```

Returns all tourist places. Example Response 

```
[
    {
        "name":"Mysore Palace"
```

```
    },
    {
        "name":"Coorg"
    }
]
```

## **3. Get Tourist Place by ID** 

## **Method** 

```
GET
```

## **URL** 

```
/api/places/:id
```

Purpose 

Return one tourist place. 

## **4. Search Tourist Place** 

## **Method** 

```
GET
```

## **URL** 

```
/api/places/search?name=mys
```

Purpose 

Users should be able to search using part of the place name. 

Example 

Searching 

```
mys
```

should return 

```
Mysore Palace
Mysore Zoo
```

Hint 

Use MongoDB Regular Expression 

```
{
    name:{
        $regex:keyword,
        $options:"i"
    }
}
```

## **5. Filter by State** 

## **Method** 

```
GET
```

## **URL** 

```
/api/places/state/Karnataka
```

Should return only places from Karnataka. 

Example 

```
Karnataka
↓
Mysore Palace
Coorg
Jog Falls
Hampi
Nandi Hills
```

## **6. Update Tourist Place** 

## **Method** 

```
PUT
```

## **URL** 

```
/api/places/:id
```

Purpose 

Update any tourist place details. 

## **7. Delete Tourist Place** 

## **Method** 

```
DELETE
```

## **URL** 

```
/api/places/:id
```

Purpose 

Delete the tourist place. 

## **Frontend Pages** 

## **1. Home Page** 

Display 

- Navigation Bar 

- Search Box 

- State Filter Dropdown 

- Tourist Place Cards 

Each card should display 

- Place Image 

- Place Name 

- State 

- Rating 

- Best Time to Visit 

Clicking the card should open the Details page. 

## **2. Tourist Place Details Page** 

Display 

- Large Image 

- Place Name 

- State 

- City 

- Best Time 

- Entry Fee 

- Rating 

- Description 

- Location 

## Example 

`Mysore Palace State Karnataka City Mysore Best Time October-February Entry Fee` ₹ `100 Rating 4.8` ⭐ `Description Historic royal palace of Mysore. Location Mysore, Karnataka` 

## **3. Admin Dashboard** 

Display all tourist places in a table or cards. 

Each record should have 

- Edit Button 

- Delete Button 

Also provide 

```
Add Tourist Place
```

button. 

## **4. Add Tourist Place Page** 

Create a form. 

Fields 

```
Place Name
State
City
Image URL
Description
Best Time
Entry Fee
Rating
Location
Submit Button
```

When submitted 

↓ 

Store the data in MongoDB Atlas. 

## **5. Edit Tourist Place Page** 

Load existing data into the form. 

Allow the admin to edit every field. 

Click Update 

↓ 

Update MongoDB. 

## **Search Functionality** 

Users should be able to search by 

- Place Name 

Example 

Searching 

```
ham
```

Should display 

```
Hampi
```

## **Filter Functionality** 

Users should be able to filter tourist places by state. 

Example 

Dropdown 

```
All
```

```
Karnataka
```

```
Kerala
```

```
Tamil Nadu
```

```
Goa
```

```
Maharashtra
```

Selecting 

```
Kerala
```

Should display only Kerala tourist places. 

## **Validation** 

Do not allow 

- Empty Place Name 

- Empty Description 

- Empty State 

- Empty Image URL 

- Empty Best Time 

- Negative Entry Fee 

- Rating greater than 5 

- Rating less than 0 

Display proper validation messages. 

## **Error Handling** 

If tourist place not found 

Return 

```
{
    "message":"Tourist Place Not Found"
}
```

Status Code 

```
404
```

If server error 

```
500
```

## **React Concepts to Use** 

Students should use 

- useState 

- useEffect 

- Axios 

- React Router 

- Dynamic Routing 

- Form Handling 

- Conditional Rendering 

## **Bonus Features (Optional)** 

Students who complete the basic requirements can implement additional features such as: 

- Sort places by rating (Highest to Lowest). 

- Sort places alphabetically (A–Z). 

- Add pagination (e.g., 8 places per page). 

- Display a "Top Rated Destinations" section on the home page. 

- Show "No tourist places found" when search or filter returns no results. 

- Add a loading spinner while fetching data. 

- Display the total number of tourist places available. 

