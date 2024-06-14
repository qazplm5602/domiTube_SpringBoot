package com.domi.domitube.Controller;

import com.domi.domitube.DTO.ChannelDataDTO;
import com.domi.domitube.DTO.UserDataDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.SubscribeService;
import com.domi.domitube.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/channel")
public class ChannelController {
    final UserService userService;
    final SubscribeService subscribeService;

    @GetMapping("/{id}/info")
    UserDataDTO GetChannelInfo(@PathVariable("id") String id, @RequestParam(value = "mini", required = false) boolean lite, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForId(id);
        UserDataDTO result = new UserDataDTO();

        if (user == null) {
            response.setStatus(404);
            return result;
        }

        result.id = id;
        result.name = user.getName();
        result.icon = user.getImage();

        if (lite) { // 최소한
            return result;
        }

        User myUser = userService.GetUserForRequest(request);
        result = CreateChannelDTO(user, myUser);

        return result;
    }

    @GetMapping("/search")
    List<ChannelDataDTO> GetSearch(HttpServletRequest request, @RequestParam("v") String value, @RequestParam("page") int page) {
        User myUser = userService.GetUserForRequest(request);
        return userService.SearchUser(value, page).stream().map(v -> CreateChannelDTO(v, myUser)).toList();
    }

    ChannelDataDTO CreateChannelDTO(User user, User my) {
        ChannelDataDTO result = new ChannelDataDTO();

        result.id = user.getId();
        result.name = user.getName();
        result.icon = user.getImage();

        boolean myFollow = false;
        if (my != null) {
            myFollow = subscribeService.HasSubscribeUser(my.getId(), user.getId());
        }

        result.banner = user.getBanner();
        result.follower = subscribeService.GetSubscribers(user.getId()).size();
        result.subscribe = myFollow;
        return result;
    }
}
