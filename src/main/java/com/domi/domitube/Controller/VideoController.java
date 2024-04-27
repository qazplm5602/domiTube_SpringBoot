package com.domi.domitube.Controller;

import com.domi.domitube.DTO.VideoDataDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
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
}
