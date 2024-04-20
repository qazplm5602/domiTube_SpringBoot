package com.domi.domitube.Controller;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.SubscribeService;
import com.domi.domitube.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/channel")
public class ChannelController {
    final UserService userService;
    final SubscribeService subscribeService;

    @GetMapping("/{id}/info")
    Map<String, Object> GetChannelInfo(@PathVariable("id") String id, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForId(id);

        if (user == null) {
            response.setStatus(404);
            return Map.of("result", false);
        }

        boolean myFollow = false;
        String myId = (String) request.getAttribute("user.id");
        if (myId != null) {
            myFollow = subscribeService.HasSubscribeUser(myId, id);
        }

        return Map.of(
                "name", user.getName(),
                "icon", user.getImage(),
                "banner", user.getBanner(),
                "follower", subscribeService.GetSubscribers(id).size(),
                "subscribe", myFollow
        );
    }
}
