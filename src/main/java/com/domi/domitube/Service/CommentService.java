package com.domi.domitube.Service;

import com.domi.domitube.Repository.CommentRepository;
import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
}
