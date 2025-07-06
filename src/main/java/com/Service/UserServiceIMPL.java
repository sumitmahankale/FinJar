package com.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Model.User;
import com.Repository.UserRepository;

@Service
public class UserServiceIMPL implements UserService {
	
		@Autowired
		private UserRepository userRepository;
		
		@Override
		public User registerUser(User user) {
		    return userRepository.save(user);
		}

}
