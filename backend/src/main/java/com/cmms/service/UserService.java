package com.cmms.service;

import com.cmms.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDTO> getAllUsers(Pageable pageable);
    UserDTO createUser(com.cmms.model.User user);
}
