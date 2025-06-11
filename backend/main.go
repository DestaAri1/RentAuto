package main

import (
	"log"

	"github.com/DestaAri1/RentAuto/database"
	"github.com/DestaAri1/RentAuto/handlers"
	"github.com/DestaAri1/RentAuto/middlewares"
	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/policy"
	"github.com/DestaAri1/RentAuto/repositories"
	"github.com/DestaAri1/RentAuto/services"
	"github.com/DestaAri1/RentAuto/validatiors"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/gorm"
)

// App configuration
func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "Rent Car",
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
	auth     models.AuthRepository
	cars     models.CarRepository
	carChild models.CarChildRepository
	roles    models.RoleRepository
	carTypes models.CarTypesRepository
	users    models.UserRepository
}

func setupRepositories(database *gorm.DB) AppRepositories {
	return AppRepositories{
		auth:     repository.NewAuthRepository(database),
		cars:     repository.NewCarRepository(database),
		carChild: repository.NewCarChildRepository(database),
		roles:    repository.NewRoleRepository(database),
		carTypes: repository.NewCarTypeRepositories(database),
		users:    repository.NewUserRepository(database),
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

// Policy initialization
type AppPolicies struct {
	admin *policy.AdminPolicy
}

func setupPolicies(repos AppRepositories) AppPolicies {
	// Setup base policy
	basePolicy := policy.NewPolicy(repos.roles) // Sesuaikan dengan constructor Policy Anda
	
	// Setup admin policy
	adminPolicy := policy.NewAdminPolicy(basePolicy)

	return AppPolicies{
		admin: adminPolicy,
	}
}

// Validator initialization
func setupValidator(database *gorm.DB) *validators.ValidatorManager {
	return validators.NewValidatorManager(database)
}

// Route setup
func setupRoutes(app *fiber.App, database *gorm.DB, repos AppRepositories, services AppServices, policies AppPolicies, validatorManager *validators.ValidatorManager) {
	// API group
	api := app.Group("/api")

	// Public routes
	auth := api.Group("/auth")
	handlers.NewAuthHandler(auth, services.auth)
	// handlers.NewUserProductHandler(api.Group("/product"), repos.userProduct)

	// Protected routes
	protected := api.Use(middlewares.AuthProtected(database))

	// Public Protected Routes
	//

	//  User routes
	//
	//  Admin & Other except User routes
	handlers.NewRoleHandler(protected.Group("/admin/role"), repos.roles, policies.admin)
	handlers.NewUserHandler(protected.Group("/admin/user-management"), repos.users, policies.admin)
	handlers.NewCarHandler(protected.Group("/admin/cars"), repos.cars, repos.roles)
	handlers.NewCarTypesHandler(protected.Group("/admin/car-types"), repos.carTypes, repos.roles, validatorManager)
	handlers.NewCarChildHandler(protected.Group("/admin/cars/children"), repos.carChild, repos.roles)

	//  Common routes
}

func main() {
	// Initialize components
	database := database.Init(database.DBMigrator)
	app := setupApp()
	repositories := setupRepositories(database)
	services := setupServices(repositories)
	policies := setupPolicies(repositories) // Setup policies
	validatorManager := setupValidator(database)

	// Setup routes
	setupRoutes(app, database, repositories, services, policies, validatorManager)

	// Start server with more informative logging
	log.Println("Server starting on http://localhost:3000")
	if err := app.Listen("0.0.0.0:3000"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}