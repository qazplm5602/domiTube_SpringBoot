package com.domi.domitube.Controller;


import com.domi.domitube.DTO.SubscribeQueryDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.SubscribeService;
import com.domi.domitube.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

class SubscribeDTO {
    @NotEmpty
    public String targetId;
    @NotNull
    public boolean active;
}

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
    Map<String, Object> GetMySubscribes(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return Map.of("result", false);
        }

        List<String> result = new ArrayList<>();
        for(var row : subscribeService.GetSubscribeUsers(user.getId())) {
            result.add(row.gettargetId());
        }
        
        return Map.of(
            "result", true,
            "data", result
        );
    }

    @PostMapping("/user/subscribe")
    void SetSubscribe(@RequestBody @Valid SubscribeDTO data, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return;
        }

        User target = userService.GetUserForId(data.targetId);
        if (target == null) { // 구독할 채널이 없는디
            response.setStatus(400);
            return;
        }

        Boolean isFollow = subscribeService.HasSubscribeUser(user.getId(), data.targetId);
        if (isFollow == data.active) { // 왜 똑같음
            response.setStatus(400);
            return;
        }

        subscribeService.SetSubscribe(user.getId(), data.targetId, data.active);
    }
}
