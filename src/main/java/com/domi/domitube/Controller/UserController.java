package com.domi.domitube.Controller;


import com.domi.domitube.DTO.SubscribeQueryDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.SubscribeService;
import com.domi.domitube.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {
    final UserService userService;
    final SubscribeService subscribeService;

    @GetMapping("/user/my")
    Map<String, Object> GetMyInfo(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return Map.of("result", false);
        }

        return Map.of(
            "result", true,
            "id", user.getId(),
            "name", user.getName(),
            "image", user.getImage()
        );
    }

    @GetMapping("/user/my_subscribes")
    ResponseEntity<Collection<SubscribeQueryDTO>> GetMySubscribes(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
//            return Map.of("result", false);
            return null;
        }

        List<String> result = new ArrayList<>();
        var domi = subscribeService.GetSubscribeUsers(user.getId());
        System.out.println(domi.size());
//        System.out.println(domi.get(0).getId());
        System.out.println(domi.get(0).getTargetId());

//        for (var item : )
//            result.add(item.GetTargetId());

        return null;
//        return Map.of(
//            "result", true,
//            "data", result
//        );
    }
}
