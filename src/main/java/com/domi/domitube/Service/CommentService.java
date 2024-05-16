package com.domi.domitube.Service;

import com.domi.domitube.Repository.CommentRepository;
import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CommentService {
    final CommentRepository commentRepository;

    public long Save(Comment comment) {
        return commentRepository.save(comment).getId();
    }

    public void Delete(Comment comment) {
        commentRepository.DeleteChildrenComment(comment.getId()); // 답장한거 다 지움
        commentRepository.delete(comment);
    }

    public Comment GetCommentForId(long id) {
        return commentRepository.findById(id).orElse(null);
    }

    public List<Comment> GetVideoComments(Video video, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return commentRepository.GetVideoCommentsNoReply(video, pageable);
    }

    public List<Comment> GetReplysForCommet(Comment comment) {
        return commentRepository.GetReplysComment(comment);
    }

    public Map<Long, Long> GetReplyAmounts(List<Comment> comments) {
        List<Long> ids = new ArrayList<>();
        for (Comment comment : comments) {
            ids.add(comment.getId());
        }

        Map<Long, Long> result = new HashMap<>();
        List<Map<String, Object>> rows = commentRepository.GetCommentReplyAmounts(ids);

        for (Map<String, Object> row : rows) {
            result.put((Long)row.get((Object)"id"), (Long)row.get((Object)"amount"));
        }

        return result;
    }

    // STUDIO
    public Map<String, Long> GetCommentSizesForVideos(List<Video> include) {
        Map<String, Long> result = new HashMap<>();
        for (var data : commentRepository.GetCommentSizesForVideos(include)) {
            result.put((String)data.get("id"), (Long)data.get("amount"));
        }

        return result;
    }

    public List<Map<String, Object>> GetCommentPopular(User user) {
        Pageable page = PageRequest.of(0, 10);

        List<Map<String, Object>> result = new ArrayList<>();
        for (var data : commentRepository.GetCommentsTopReply(user, page)) {
            Long amount = (Long)data.get("amount");
            Comment comment = (Comment)data.get("target");

            result.add(Map.of(
                "id", comment.getId(),
                "user", Map.of(
                    "id", comment.getWriter().getId(),
                    "name", comment.getWriter().getName(),
                    "image", comment.getWriter().getImage()
                ),
                "content", comment.getContent(),
                "reply", amount,
                "video", Map.of(
                    "id", comment.getVideo().getId(),
                    "title", comment.getVideo().getTitle()
                )
            ));
        }

        return result;
    }

    public List<Comment> GetAllCommentByUserSorting(User user, VideoService.SortType sort, int page) {
        Pageable pages = PageRequest.of(page, 20);

        switch (sort) {
            case Lastest -> { return commentRepository.GetAllCommentsByUserLatest(user, pages); }
            case Date -> { return commentRepository.GetAllCommentsByUserOld(user, pages); }
        }

        return new ArrayList<>();
    }
}
