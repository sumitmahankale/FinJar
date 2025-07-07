package com.Service;

import java.util.Optional;

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
