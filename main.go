package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func authenticationHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Iniciando a autenticacao")
	// Headers de CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Erro ao ler JSON", http.StatusBadRequest)
		return
	}
	fmt.Println("credenciais: ", creds.Username, creds.Password)
	// Exemplo de validação simples (fake)
	if creds.Username == "Admin" && creds.Password == "123" {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	} else {
		json.NewEncoder(w).Encode(map[string]string{"status": "fail"})
	}
}

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "myproject",
		Width:     1024,
		Height:    768,
		MinWidth:  854,
		MinHeight: 576,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
	println("Servidor rodando em http://localhost:8080")
	http.HandleFunc("/authentication", authenticationHandler)
	http.ListenAndServe(":8080", nil)
}
