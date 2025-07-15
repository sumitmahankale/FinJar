package com.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.model.User;
import com.repository.UserRepository;

@Service
public class UserServiceIMPL implements UserService {
	
		@Autowired
		private UserRepository userRepository;
		
		@Autowired
		private PasswordEncoder passwordEncoder;

		@Override
		public User registerUser(User user) {
		    user.setPassword(passwordEncoder.encode(user.getPassword())); // 🔐 Encrypt password
		    return userRepository.save(user);
		}
		
		@Override
		public User getUserById(Long id) {
		    return userRepository.findById(id)
		        .orElseThrow(() -> new RuntimeException("User not found with id " + id));
		}


	    @Override
	    public User updateUser(Long id, User updatedUser) {
	        return userRepository.findById(id)
	            .map(user -> {
	                user.setName(updatedUser.getName());
	                user.setEmail(updatedUser.getEmail());
	                user.setPassword(updatedUser.getPassword());
	                return userRepository.save(user);
	            })
	            .orElseThrow(() -> new RuntimeException("User not found with id " + id));
	    }

	    @Override
	    public void deleteUser(Long id) {
	        userRepository.deleteById(id);
	    }

}
