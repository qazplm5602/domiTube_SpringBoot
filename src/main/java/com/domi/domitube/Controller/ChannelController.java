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

        boolean myFollow = false;
        String myId = (String) request.getAttribute("user.id");
        if (myId != null) {
            myFollow = subscribeService.HasSubscribeUser(myId, id);
        }

        ChannelDataDTO channelDTO = ChannelDataDTO.ConvertUserData(result);
        channelDTO.banner = user.getBanner();
        channelDTO.follower = subscribeService.GetSubscribers(id).size();
        channelDTO.subscribe = myFollow;
        result = channelDTO;

        return result;
    }
}
