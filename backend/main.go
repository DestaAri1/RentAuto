package main

import (
	"log"

	"github.com/DestaAri1/RentAuto/database"
	"github.com/DestaAri1/RentAuto/handlers"
	"github.com/DestaAri1/RentAuto/middlewares"
	"github.com/DestaAri1/RentAuto/models"
	repository "github.com/DestaAri1/RentAuto/repositories"
	"github.com/DestaAri1/RentAuto/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/gorm"
)

// App configuration
func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "TicketBooking",
		ServerHeader: "Fiber",
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	}))

	app.Static("/assets", "./assets")

	return app
}

// Repository initialization
type AppRepositories struct {
	auth models.AuthRepository
	cars models.CarRepository
	roles models.RoleRepository
}

func setupRepositories(database *gorm.DB) AppRepositories {
	return AppRepositories{
		auth: repository.NewAuthRepository(database),
		cars: repository.NewCarRepository(database),
		roles: repository.NewRoleRepository(database),
	}
}

// Service initialization
type AppServices struct {
	auth models.AuthServices
}

func setupServices(repos AppRepositories) AppServices {
	return AppServices{
		auth: services.NewAuthService(repos.auth),
	}
}

// Route setup
func setupRoutes(app *fiber.App, database *gorm.DB, repos AppRepositories, services AppServices) {
	// API group
	api := app.Group("/api")
	
	// Public routes
	auth := api.Group("/auth")
	handlers.NewAuthHandler(auth, services.auth)
	// handlers.NewUserProductHandler(api.Group("/product"), repos.userProduct)

	// Protected routes
	protected := api.Use(middlewares.AuthProtected(database))

	//Public Protected Routes

	//  User routes

	//  Admin routes
	handlers.NewCarHandler(protected.Group("/cars"), repos.cars, repos.roles)

	//  Common routes
}

func main() {
	// Initialize components
	database := database.Init(database.DBMigrator)
	app := setupApp()
	repositories := setupRepositories(database)
	services := setupServices(repositories)

	// Setup routes
	setupRoutes(app, database, repositories, services)

	// Start server with more informative logging
	log.Println("Server starting on http://localhost:3000")
	if err := app.Listen("0.0.0.0:3000"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}