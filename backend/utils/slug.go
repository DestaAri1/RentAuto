package utils

import (
	"fmt"

	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

// GenerateUniqueSlug generates a unique slug for a given name in a specified table and column.
// Example use: GenerateUniqueSlug(db, "car_parents", "slug", "Toyota Avanza")
func GenerateUniqueSlug(db *gorm.DB, tableName, columnName, name string) (string, error) {
	baseSlug := slug.Make(name)
	finalSlug := baseSlug
	counter := 2

	for {
		var count int64
		query := fmt.Sprintf("%s = ?", columnName)
		if err := db.Table(tableName).Where(query, finalSlug).Count(&count).Error; err != nil {
			return "", err
		}
		if count == 0 {
			break
		}
		finalSlug = fmt.Sprintf("%s-%d", baseSlug, counter)
		counter++
	}

	return finalSlug, nil
}
