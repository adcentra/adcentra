package i18n

import (
	"embed"
	"encoding/json"
	"fmt"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

//go:embed locales/*.json
var localeFS embed.FS

var Bundle *i18n.Bundle

var SupportedLanguages = []language.Tag{
	language.English,
	language.Spanish,
}

func Init() error {
	Bundle = i18n.NewBundle(language.English)
	Bundle.RegisterUnmarshalFunc("json", json.Unmarshal)

	// Load translation files
	for _, lang := range SupportedLanguages {
		filename := fmt.Sprintf("locales/%s.json", lang.String())
		_, err := Bundle.LoadMessageFileFS(localeFS, filename)
		if err != nil {
			return fmt.Errorf("failed to load translation file %s: %w", filename, err)
		}
	}

	return nil
}

func NewLocalizer(languages ...string) *i18n.Localizer {
	return i18n.NewLocalizer(Bundle, languages...)
}

// Parse Accept-Language header and return the best match
func GetLanguageFromAcceptLanguage(acceptLanguage string) string {
	if acceptLanguage == "" {
		return language.English.String()
	}

	tags, _, err := language.ParseAcceptLanguage(acceptLanguage)
	if err != nil {
		return language.English.String()
	}

	matcher := language.NewMatcher(SupportedLanguages)
	tag, _ := language.MatchStrings(matcher, tags[0].String())
	return tag.String()
}

func LocalizeMessage(localizer *i18n.Localizer, messageID string, templateData map[string]interface{}) string {
	config := &i18n.LocalizeConfig{
		MessageID:    messageID,
		TemplateData: templateData,
	}

	message, err := localizer.Localize(config)
	if err != nil {
		// Fallback to message ID if localization fails
		return messageID
	}

	return message
}

// MustLocalizeMessage localizes a message and panics on error (for development)
func MustLocalizeMessage(localizer *i18n.Localizer, messageID string, templateData map[string]interface{}) string {
	config := &i18n.LocalizeConfig{
		MessageID:    messageID,
		TemplateData: templateData,
	}

	return localizer.MustLocalize(config)
}
