package com.domi.domitube.Controller;

import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.CommentService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

class CommentDataDTO {
    public long id;
    public String owner;
    public String content;
    public long created;
}

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/video/comment")
public class CommentController {
    final CommentService commentService;
    final VideoService videoService;
    final UserService userService;

    @PutMapping("/write")
    void WriteComment(@RequestBody String content, @RequestParam("video") String videoId, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return;
        }

        Video video = videoService.GetVideoById(videoId);
        if (video == null) {
            response.setStatus(404);
            return;
        }

        Comment comment = new Comment();

        comment.setVideo(video);
        comment.setWriter(user);
        comment.setContent(content);
        comment.setCreated(LocalDateTime.now());
        commentService.Save(comment);
    }

    @PutMapping("/reply")
    void WriteReplyComment(@RequestBody String content, @RequestParam("id") long commentId, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return;
        }

        Comment targetComment = commentService.GetCommentForId(commentId);
        if (targetComment == null) {
            response.setStatus(404);
            return;
        }

        if (targetComment.getReply() != null) { // 이 댓글은 답장임
            response.setStatus(403);
        }

        Comment comment = new Comment();
        comment.setReply(targetComment);
        comment.setVideo(targetComment.getVideo());
        comment.setWriter(user);
        comment.setContent(content);
        comment.setCreated(LocalDateTime.now());

        commentService.Save(comment);
    }

    @PostMapping("/edit")
    void EditComment(@RequestBody String content, @RequestParam("id") long id, HttpServletRequest request, HttpServletResponse response) {
        Comment comment = GetMyCommentTryPermission(id, request, response);
        if (comment == null) return;

        comment.setContent(content);
        commentService.Save(comment);
    }

    @DeleteMapping("/delete")
    void DeleteComment(@RequestParam("id") long id, HttpServletRequest request, HttpServletResponse response) {
        Comment comment = GetMyCommentTryPermission(id, request, response);
        if (comment == null) return;

        commentService.Delete(comment);
    }

    Comment GetMyCommentTryPermission(long id, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return null;
        }

        Comment comment = commentService.GetCommentForId(id);
        if (comment == null) {
            response.setStatus(404);
            return null;
        }

        if (comment.getWriter() != user) {
            response.setStatus(403);
            return null;
        }

        return comment;
    }

    @GetMapping("/list")
    ResponseEntity<List<CommentDataDTO>> GetVideoComments(@RequestParam("video") String videoId, @RequestParam("page") int page) {
        Video video = videoService.GetVideoById(videoId);
        if (video == null) {
            return ResponseEntity.notFound().build();
        }

        List<CommentDataDTO> result = new ArrayList<CommentDataDTO>();
        List<Comment> comments = commentService.GetVideoComments(video, page);

        for (Comment comment : comments) {
            CommentDataDTO data = new CommentDataDTO();
            data.id = comment.getId();
            data.content = comment.getContent();
            data.owner = comment.getWriter().getId();
            data.created = comment.getCreated().toInstant(ZoneOffset.of("+09:00")).toEpochMilli();

            result.add(data);
        }

        return ResponseEntity.ok(result);
    }
}
