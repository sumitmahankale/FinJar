package com.Service;

import java.util.Optional;

import com.Model.User;

public interface UserService {

	User registerUser(User user);
	User getUserById(Long id);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
}
