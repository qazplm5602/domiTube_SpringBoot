package com.domi.domitube.Studio;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.*;
import com.domi.domitube.Utils.RandomStringGenerator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.output.WriterOutputStream;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class StudioVideoDTO {
    public String id;
    public String title;
    public String description;
    public int secret;
    public long views;
    public long good;
    public long bad;
    public long create;
    public long comment;
}

class ResponseVO {
    public boolean result;
    public String data;

    public ResponseVO(boolean _result, String _data) {
        result = _result;
        data = _data;
    }
}

@RestController
@RequestMapping("/api/studio/content")
@RequiredArgsConstructor
public class ContentController {
    final UserService userService;
    final VideoService videoService;
    final CommentService commentService;
    final AssetService assetService;
    final FFmpegService ffmpegService;

    Map<String, Integer> process = new HashMap<String, Integer>();

    @GetMapping("/list")
    ResponseEntity GetVideoForOwner(HttpServletRequest request, @RequestParam("page") int page) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<StudioVideoDTO> response = new ArrayList<>();
        List<Video> result = videoService.GetVideosByUser(user, VideoService.SortType.Lastest, page);
        Map<String, Long> comments = commentService.GetCommentSizesForVideos(result);

        for(var video : result) {
            StudioVideoDTO data = new StudioVideoDTO();
            data.id = video.getId();
            data.title = video.getTitle();
            data.description = video.getDescription();
            data.views = video.getViews();
            data.good = video.getGood();
            data.bad = video.getDislike();
            data.create = video.getCreated().toInstant(ZoneOffset.of("+09:00")).toEpochMilli();

            Long commentAmount = (Long)comments.get(video.getId());
            if (commentAmount == null) commentAmount = 0L;

            data.comment = commentAmount;

            int secret = 0;
            switch(video.getSecret()) {
                case HalfPublic -> {
                    secret = 1;
                    break;
                }
                case Private -> {
                    secret = 2;
                    break;
                }
            }

            data.secret = secret;

            response.add(data);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list/size")
    Long GetVideoMaxSize(HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return -1L;
        }

        Long amount = videoService.GetVideoLengthByUser(user);
        if (amount == null)
            amount = 0L;

        return amount;
    }

    @PutMapping("/create")
    ResponseEntity<ResponseVO> CreateVideo(HttpServletRequest request, @RequestBody long size) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        String videoId = RandomStringGenerator.GenerateRandomString(8);

        Video video = new Video();
        video.setId(videoId);
        video.setOwner(user);
        video.setTitle("domiTube Gen");
        video.setTime(0);
        video.setSize(size);
        video.setCreated(LocalDateTime.now());
        video.setSecret(Video.VideoSecretType.Private); // 일단 임시로 비공개

        videoService.CreateVideo(video);

        process.put(videoId, 0);

        ResponseVO response = new ResponseVO(true, videoId);
        return ResponseEntity.ok(response);
    }

    final int FILE_SLICE = 1024 * 1024 * 5;
    @PostMapping("/create/upload")
    synchronized ResponseEntity<ResponseVO> VideoUpload(HttpServletRequest request, @RequestParam(value = "file") MultipartFile file, @RequestParam(value = "num") int index, @RequestParam(value = "video") String videoId) throws IOException {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body(new ResponseVO(false, "로그인 하심시오."));
        }

        Video video = videoService.GetVideoById(videoId);
        if (video == null) {
            return ResponseEntity.status(404).body(new ResponseVO(false, "영상을 찾을 수 없습니다."));
        }

        if (video.getOwner() != user) {
            return ResponseEntity.status(403).body(new ResponseVO(false, "error"));
        }

        Integer uploads = process.get(videoId);
        if (uploads == null) {
            return ResponseEntity.status(400).body(new ResponseVO(false, "이미 영상이 업로드 되었습니다."));
        }

        int uploadMaxCount = (int)Math.ceil((double) video.getSize() / FILE_SLICE);
        if (uploadMaxCount <= index) { // 분할 파일 갯수 넘음
            return ResponseEntity.status(400).body(new ResponseVO(false, "잘못된 index"));
        }

        if (uploads >= uploadMaxCount) { // 이미 업로드를 다 함
            return ResponseEntity.status(400).body(new ResponseVO(false, "이미 영상이 업로드 되었습니다."));
        }

        if (file.getSize() > FILE_SLICE /* 마지막에는 더 크기가 적기 때문에 검사 넣을꺼임 */) { // 파일 크기 넘음
            return ResponseEntity.status(413).body(new ResponseVO(false, "파일 사이즈가 너무 큽니다."));
        }

        // 파일 넣기
        String tempDir = assetService.GetPath(AssetService.Category.temp);
        String path = String.format("%s/%s-%s.domi", tempDir, videoId, index);

        File tempFile = new File(path);
        file.transferTo(tempFile);

        // 파일 업로드 횟수 올리고~~
        uploads++;
        process.replace(videoId, uploads);

        // 이제 다 업로드 된거임 이정도면
        System.out.println(uploads+" 올림 / max: "+uploadMaxCount);
        if (uploads == uploadMaxCount) {
            CombineVideo(videoId, uploadMaxCount);
        }

        return ResponseEntity.ok(new ResponseVO(true, "ok"));
    }

    void CombineVideo(String videoId, int maxIndex) throws IOException {
        String videoPath = String.format("%s/%s.mp4", assetService.GetPath(AssetService.Category.video), videoId);
        String tempPath = assetService.GetPath(AssetService.Category.temp);

        process.remove(videoId);

        File file = new File(videoPath);
        if (file.exists() || !file.createNewFile()) return; // 이미 있는뎅?? || 없으면 새로 만드렁

//        BufferedWriter writer = new BufferedWriter(new FileWriter(file, true));
        FileOutputStream stream = new FileOutputStream(videoPath);
        for (int i = 0; i < maxIndex; i++) {
            String path = String.format("%s/%s-%s.domi", tempPath, videoId, i);
            File sliceFile = new File(path);

            byte[] buffer = FileUtils.readFileToByteArray(sliceFile);
            stream.write(buffer);

            sliceFile.delete();
        }

        stream.close();
        process.remove(videoId);

        double duration = ffmpegService.GetVideoDuration(videoPath);
        String thumbnailPath = String.format("%s/%s.jpg", assetService.GetPath(AssetService.Category.thumnail), videoId);
        
        // 썸네일 없으면 만드렁
        if (!new File(thumbnailPath).exists()) {
            ffmpegService.CreateThumbnail(videoPath, thumbnailPath);
        }

        Video video = videoService.GetVideoById(videoId);
        video.setTime(duration);

        videoService.CreateVideo(video);
    }

    @PostMapping("/edit/{video}")
    ResponseEntity<ResponseVO> EditVideo(HttpServletRequest request, @PathVariable("video") String videoId,
        @RequestParam(value = "title", required = false) String title, @RequestParam(value = "desc", required = false) String desc,
        @RequestParam(value = "secret", required = false) Byte secret, @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) throws IOException {

        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body(new ResponseVO(false, "로그인 하심시오."));
        }

        Video video = videoService.GetVideoById(videoId);
        if (video == null) {
            return ResponseEntity.status(404).body(new ResponseVO(false, "영상을 찾을 수 없습니다."));
        }
        if (video.getOwner() != user) {
            return ResponseEntity.status(403).body(new ResponseVO(false, "ming.."));
        }

        boolean isChanged = false;

        if (title != null && !title.isEmpty()) {
            video.setTitle(title);
            isChanged = true;
        }

        if (desc != null && !desc.isEmpty()) {
            video.setDescription(desc);
            isChanged = true;
        }

        if (secret != null) {
            Video.VideoSecretType type;
            switch (secret) {
                case 0:
                    type = Video.VideoSecretType.Public;
                    break;
                case 1:
                    type = Video.VideoSecretType.HalfPublic;
                    break;
                case 2:
                    type = Video.VideoSecretType.Private;
                    break;
                default:
                    type = null;
                    break;
            }

            if (type != null) {
                video.setSecret(type);
                isChanged = true;
            }
        }

        if (isChanged)
            videoService.CreateVideo(video);

        if (thumbnail != null && !thumbnail.isEmpty())
            assetService.AddFile(AssetService.Category.thumnail, videoId, thumbnail);

        return ResponseEntity.ok(new ResponseVO(true, "ok"));
    }

}
