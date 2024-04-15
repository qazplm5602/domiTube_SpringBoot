package com.domi.domitube.Controller;


import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {
    final UserService userService;

    @GetMapping("/user/my")
    Map<String, Object> GetMyInfo(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return Map.of("result", false);
        }

        return Map.of(
            "result", true,
            "id", user.getId(),
            "name", user.getName()
        );
    }
}
