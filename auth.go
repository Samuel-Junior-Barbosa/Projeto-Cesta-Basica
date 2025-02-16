package main

type User struct {
	ID    int    `json:"id"`
	Nome  string `json:"nome"`
	Role  string `json:"role"`
	Email string `json:"email"`
}

var dummyUser = User{ID: 1, Nome: "Sam", Role: "admin", Email: "sam@example.com"}

type Auth struct {
	currentUser *User
}

func (a *Auth) Login(email, password string) *User {
	if email == dummyUser.Email && password == "senha123" {
		a.currentUser = &dummyUser
		return a.currentUser
	}
	return nil

}

func (a *Auth) Logout() error {
	a.currentUser = nil
	return nil
}

func (a *Auth) GetCurrentUser() *User {
	if a.currentUser != nil {
		return a.currentUser
	}
	return nil
}
