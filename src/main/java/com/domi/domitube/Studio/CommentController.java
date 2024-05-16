package com.domi.domitube.Studio;

import com.domi.domitube.DTO.CommentDataDTO;
import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.CommentService;
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
import java.util.stream.Collectors;

@RestController("StudioCommentController")
@RequestMapping("/api/studio/comment")
@RequiredArgsConstructor
public class CommentController {
    final CommentService commentService;
    final UserService userService;

    @GetMapping("/list")
    ResponseEntity GetCommentList(HttpServletRequest request, @RequestParam("sort") int sort, @RequestParam("page") int page) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        VideoService.SortType type = VideoService.SortType.Lastest;
        switch (sort) {
            case 1 -> type = VideoService.SortType.Popular;
            case 2 -> type = VideoService.SortType.Date ;
        }

        List<CommentDataDTO> result = commentService.GetAllCommentByUserSorting(user, type, page).stream().map(value -> {
            CommentDataDTO data = new CommentDataDTO();
            data.id = value.getId();
            data.content = value.getContent();

            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
