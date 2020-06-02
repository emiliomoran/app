## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Test

# Steps

1. Clone repository
2. cd into your project
3. Install composer dependencies with the command line "composer install"
4. Copy the .env.example file and create .env file in the same directory
5. Generate an app encryption key with the command line "php artisan key:generate"
6. Create a sqlite file in database/database.sqlite
7. In .env file replace  
   DB_CONNECTION=mysql  
   DB_HOST=127.0.0.1  
   DB_PORT=3306  
   DB_DATABASE=laravel  
   DB_USERNAME=root  
   DB_PASSWORD=

    to only

    DB_CONNECTION=sqlite

8. Migrate the database with the command line "php artisan migrate"
9. Seed the database for clients with the command line "php artisan db:seed --class=CashiersTableSeeder"
10. Run the command line "npm intall"
11. Run the command line "npm run dev" to compile react app
12. Run server with the command line "php artisan serve"
