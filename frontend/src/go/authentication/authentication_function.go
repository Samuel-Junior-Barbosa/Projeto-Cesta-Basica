package authentication_function


import (
	"fmt"
)

func get_users() dict {
	users := {
		"Admin" : "admin",
		"Operador" : "operador",
		"Visitante" : "visitante"
	}
	return users
}


func authentication (username str, password str) {
	users_returned = get_users()
	users = users_returned[username]
	if users:
		return true
	
	else:
		return false
}