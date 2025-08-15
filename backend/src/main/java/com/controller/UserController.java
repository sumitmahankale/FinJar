package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.User;
import com.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000",
    "https://finjar-chi.vercel.app",
    "https://finjar-frontend.vercel.app"
}, allowCredentials = "true")
public class UserController { 
	
	@Autowired
	private UserService userService;
	
	 @PostMapping("/register")
	    public ResponseEntity<?> registerUser(@RequestBody User user) {
	        System.out.println("Incoming user: " + user); // debugging
	        System.out.println("Email: " + user.getEmail());
	        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
	    }
	 
	 @GetMapping("/{id}")
	 public User getUser(@PathVariable Long id) {
	     return userService.getUserById(id);
	 }

     @PutMapping("/{id}")
	    public User updateUser(@PathVariable Long id, @RequestBody User user) {
	        return userService.updateUser(id, user);
	    }

	  @DeleteMapping("/{id}")
	    public String deleteUser(@PathVariable Long id) {
	        userService.deleteUser(id);
	        return "User deleted successfully";
	    }


}
