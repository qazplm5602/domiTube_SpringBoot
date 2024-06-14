package com.domi.domitube.Service;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    final UserRepository userRepository;

    public User GetUserForId(String id) {
        Optional<User> option = userRepository.findById(id);
        return option.orElse(null);
    }

    public User GetUserForRequest(HttpServletRequest request) {
        Object boxing = request.getAttribute("user.id");
        if (boxing == null) return null;

        return GetUserForId(boxing.toString());
    }

    public void Save(User user) {
        userRepository.save(user);
    }

    public List<User> SearchUser(String value, int page){
        Pageable pageable = PageRequest.of(page, 5);
        return userRepository.findByNameContains(value, pageable);
    }
}
