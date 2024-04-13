package com.domi.domitube.Service;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    final UserRepository userRepository;

    public User GetUserForId(String id) {
        Optional<User> option = userRepository.findById(id);
        return option.orElse(null);
    }
}
