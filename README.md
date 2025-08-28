##The project structure : 
	Meal : 
		backend
		frontend

##Backend : 
	Move to backend folder :
		Meal $ cd backend
	to download the node_modules of backend :
		backend $ npm install
	To run the backend project : 
		backend $ npm run backend

I used the jwttoken with cookie-parser for the userAuthentication.
when we required the data of user or any data based on userId i will
first check the authorisation in userAuth code and set the userId to 
req.userId = tokenDecoded.id.
It automatically take the logged in userId from userAuth code.

To find the BMR : I kept a button fill_form in profile , after filling 
the form throught frontend the BMR is calculated.

##Api end points :
	
	##UserEnd points : 
	
	To add the user data : 
		userRoute.post("/signup", signUp);
		http://localhost:3000/api/v1/user/signup
	To login :
		userRoute.post("/signin", singin);
		http://localhost:3000/api/v1/user/signin
	To logout : 
		userRoute.post("/logout", userAuth, signOut);
		http://localhost:3000/api/v1/user/logout
	To get user data :
		userRoute.get("/getuserdata", userAuth, userData);
		http://localhost:3000/api/v1/user/getuserdata
	To calculate BMR :
		userRoute.put("/calculatebmr", userAuth, updateBMR);
		http://localhost:3000/api/v1/user/calculateBmr

	##MealEnd points :
	
	To add meal log :
		mealRoutes.post("/addmeal", userAuth, createMeal);
		http://localhost:3000/api/v1/meal/addmeal
	To get meal log by userId : To get all meal logs of user to display
		mealRoutes.get("/getmealbyid", userAuth, getMealsById);
		http://localhost:3000/api/v1/meal/getmealbyid
	To get meal log by date : To get meal logs of user on particular day
		mealRoutes.get("/getmeal", userAuth, getMealsByDate);
		http://localhost:3000/api/v1/meal/getmeal?date=2025-08-26


##frontend : 
	Move to frontend folder :
		Meal $ cd frontend
	To download the node_modules of frontend :
		frontend $ npm install
	To run the frontend project :
		frontend $ npm run dev


	


