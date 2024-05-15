package com.domi.domitube.Studio;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/studio/content")
@RequiredArgsConstructor
public class ContentController {
    final UserService userService;
    final VideoService videoService;

    @GetMapping("/list")
    ResponseEntity GetVideoForOwner(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        videoService.GetVideosByUser(user, VideoService.SortType.Lastest, 0);

        return null;
    }

}
