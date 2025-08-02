package com.service;

import java.util.Optional;

import com.model.User;

public interface UserService {

	User registerUser(User user);
	User getUserById(Long id);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
	User getUserByEmail(String email);
}
