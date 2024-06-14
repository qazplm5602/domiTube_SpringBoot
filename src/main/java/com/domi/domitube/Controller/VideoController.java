package com.domi.domitube.Controller;

import com.domi.domitube.DTO.VideoDataDTO;
import com.domi.domitube.Repository.Entity.Assessment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.AssessmentService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {
    final VideoService videoService;
    final UserService userService;
    final AssessmentService assessmentService;

    final String startPath = System.getenv("DOMI_ASSETS");

    @GetMapping("/{id}")
    Map<String, Object> GetVideoData(@PathVariable("id") String id, HttpServletRequest request, HttpServletResponse response) {
        Video video = videoService.GetVideoById(id);

        if (video == null) {
            response.setStatus(404);
            return Map.of("result", false, "reason", "영상을 찾을 수 없습니다.");
        }

        return Map.of(
                "result", true,
                "data", VideoDataDTO.ConvertVideo(video)
        );
    }

    @GetMapping("/{id}/Assessment")
    ResponseEntity<Boolean> GetVideoAssessment(@PathVariable("id") String id, HttpServletRequest request) {
        String userId = (String)request.getAttribute("user.id");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.GetUserForId(userId);
        if (user == null) { // 왜 유저가 없지???
            return ResponseEntity.internalServerError().build();
        }

        Video video = videoService.GetVideoById(id);
        if (video == null) {
            return ResponseEntity.notFound().build();
        }

        Boolean result = null;
        Assessment.Type type = assessmentService.GetVideoAssessForId(video, user);
        if (type != null)
            result = type == Assessment.Type.Good;

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/Assess")
    void SetVideoAssess(@PathVariable("id") String videoId, @RequestBody byte value, HttpServletRequest request, HttpServletResponse response) {
        String userId = (String)request.getAttribute("user.id");
        if (userId == null) {
            response.setStatus(401);
            return;
        }

        if (value > 2 || value < 0) {
            response.setStatus(400);
            return;
        }

        User user = userService.GetUserForId(userId);
        if (user == null) {
            response.setStatus(500);
            return;
        }

        Video video =  videoService.GetVideoById(videoId);
        if (video == null) {
            response.setStatus(404);
            return;
        }

        Assessment.Type assess = assessmentService.GetVideoAssessForId(video, user);
        if ((assess == null && value == 0) || (assess == Assessment.Type.Good && value == 1) || (assess == Assessment.Type.Bad && value == 2)) {
            response.setStatus(400);
            return;
        }

        if (assess == Assessment.Type.Good) {
            video.setGood(video.getGood() - 1);
        } else if (assess == Assessment.Type.Bad) {
            video.setDislike(video.getDislike() - 1);
        }
        assess = null;

        if (value == 1) {
            video.setGood(video.getGood() + 1);
            assess = Assessment.Type.Good;
        } else if (value == 2) {
            video.setDislike(video.getDislike() + 1);
            assess = Assessment.Type.Bad;
        }

        if (assess == null) {
            assessmentService.DeleteVideoAssess(user, video);
        } else {
            assessmentService.SetVideoAssess(user, video, assess);
        }
        videoService.CreateVideo(video);

    }

    @PostMapping("/{id}/ping")
    void CountViewUp(@PathVariable("id") String id, HttpServletResponse response) {
        Video video = videoService.GetVideoById(id);
        if (video == null) {
            response.setStatus(404);
            return;
        }

        video.setViews(video.getViews() + 1);
        videoService.CreateVideo(video);
    }

    @GetMapping("/user/{id}")
    List<VideoDataDTO> GetVideosByUserId(@PathVariable("id") String id, @RequestParam("sort") int sort, @RequestParam("page") int page, HttpServletResponse response) {
        List<VideoDataDTO> result = new ArrayList<VideoDataDTO>();
        User user = userService.GetUserForId(id);

        if (user == null) {
            response.setStatus(404);
            return result;
        }

        VideoService.SortType sorting = VideoService.SortType.Lastest;
        switch (sort) {
            case 1 -> sorting = VideoService.SortType.Popular;
            case 2 -> sorting = VideoService.SortType.Date;
        }

        for (var video : videoService.GetVideosByUser(user, sorting, page)) {
            result.add(VideoDataDTO.ConvertVideo(video));
        }

        return result;
    }

    @GetMapping("/stream/{id}")
    ResponseEntity<ResourceRegion> StreamVideo(@RequestHeader HttpHeaders headers, @PathVariable String id) throws IOException {
        Resource resource = new FileSystemResource(String.format("%s/video/%s.mp4", startPath, id));
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        long chunkSize = 1024 * 1024;
        long contentLength = resource.contentLength();

        ResourceRegion region;

        Optional<HttpRange> optional = headers.getRange().stream().findFirst();
        if (optional.isEmpty())
             return ResponseEntity.badRequest().build();

        HttpRange httpRange = optional.get();
        long start = httpRange.getRangeStart(contentLength);
        long end = httpRange.getRangeEnd(contentLength);
        long rangeLength = Long.min(chunkSize, end - start + 1);

        region = new ResourceRegion(resource, start, rangeLength);

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .header("Accept-Ranges", "bytes")
                .body(region);
    }

    @PostMapping("/test/create")
    void CreateVideoTest() {
        User user = userService.GetUserForId("domi");
        Video video = new Video();

        for (int i = 0; i < 50; i++) {
            video.setId("DOMI"+i);
            video.setOwner(user);
            video.setSecret(Video.VideoSecretType.Public);
            video.setTitle("아무 영상 Auto Generate - "+i);
            video.setDescription("ㄹㅇㄹㅇㄹㅇ 아무 영상 임니다. x"+i);
            video.setCreated(LocalDateTime.of(2024, 1 + (i / 29), (i % 29) + 1, 3, 20, 1));
    //        video.setSecret(VideoSecretType.Public);

            videoService.CreateVideo(video);
        }

    }

    @GetMapping("/search")
    ResponseEntity<List<VideoDataDTO>> GetSearchVideo(@RequestParam("v") String value, @RequestParam("page") int page) {
        return ResponseEntity.ok(videoService.SearchVideo(value, page).stream().map(VideoDataDTO::ConvertVideo).toList());
    }
}
