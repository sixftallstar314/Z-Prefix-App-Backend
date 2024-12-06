# Z-Prefix-App-Backend
Z-Prefix-App-Backend

This is the backed of the Inventory Management CRUD APP 

Instructions for use: 
1. CD into the /backend directory. 
2. Then replace the development details in the knexfile.js with your knex DB details. 
3. Then run systemctl start postgresql to start "pg" db.
4. Once that is complete run npm intall. 
5. Then run node server.js from /backend directory to start the server for the Inventory Management App. 
6. Lastly if you haven't already visit https://github.com/sixftallstar314/Z-Prefix-App and clone down the Front-end portion 
of the APP and follow the README.md for starting that service. 
7. When you want to stop your database run systemctl stop postgresql.


*Notes*
Currently this App is a proof of concept doesn't contain .env file or gitignore. The users db automatically populates with a user " James Kelley" for proof of concept of seeding. 
