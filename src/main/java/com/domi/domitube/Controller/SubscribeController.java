package com.domi.domitube.Controller;

import com.domi.domitube.DTO.SubscribeQueryDTO;
import com.domi.domitube.DTO.VideoDataDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.SubscribeService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SubscribeController {
    final UserService userService;
    final SubscribeService subscribeService;
    final VideoService videoService;

    @GetMapping("/subscribes")
    ResponseEntity<List<VideoDataDTO>> GetSubscribeVideos(HttpServletRequest request, @RequestParam("page") int page) {
        User user = userService.GetUserForRequest(request);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<String> channels = subscribeService.GetSubscribeUsers(user.getId()).stream().map(SubscribeQueryDTO::gettargetId).toList();
        List<VideoDataDTO> result = videoService.GetVideoByUsers(channels, page).stream().map(VideoDataDTO::ConvertVideo).toList();
        return ResponseEntity.ok(result);
    }
}
