# Z-Prefix-App-Backend
Z-Prefix-App-Backend

This is the backed of the Inventory Management CRUD APP 

Instructions for use: 
1. CD into the /backend directory. 
2. Once that is complete run npm intall. 
3. Then replace the development details in the knexfile.js with your knex DB details. 
4. Then run systemctl start postgresql to start "pg" db.
5. Then run node server.js from /backend directory to start the server for the Inventory Management App. 
6. Lastly if you haven't already visit https://github.com/sixftallstar314/Z-Prefix-App and clone down the Front-end portion of the APP and follow the README.md for starting that service. 


*Notes*
Currently this App is a proof of concept doesn't contain password encryption or hashing. Passwords are in plane text so please be advised.
Future features of this app will contain encryption and hashing. 
