package com.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Model.User;
import com.Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController { 
	
	@Autowired
	private UserService userService;
	
	 @PostMapping("/register")
	    public ResponseEntity<?> registerUser(@RequestBody User user) {
	        System.out.println("Incoming user: " + user); // debugging
	        System.out.println("Email: " + user.getEmail());
	        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
	    }


}
