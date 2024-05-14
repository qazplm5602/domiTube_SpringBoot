package com.domi.domitube.Studio;

import com.domi.domitube.DTO.VideoDataDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.SubscribeService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Getter
@Setter
class DashboardDTO {
    int myFollow;
    long myViews;

    StudioVideoAnalyze videoAnalyze;
}

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/studio")
public class DashboardController {
    final SubscribeService subscribeService;
    final VideoService videoService;
    final UserService userService;

    @GetMapping("/dashboard")
    ResponseEntity GetDashboard(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body("밍");
        }

        int myFollow = subscribeService.GetSubscribers(user.getId()).size();
        long myViews = videoService.GetAllViewCountByUser(user);
        StudioVideoAnalyze videoAnalyze = videoService.GetStudioAnalyze(user);

        DashboardDTO result = new DashboardDTO();
        result.setMyFollow(myFollow);
        result.setMyViews(myViews);
        result.setVideoAnalyze(videoAnalyze);

        return ResponseEntity.ok(result);
    }
}
