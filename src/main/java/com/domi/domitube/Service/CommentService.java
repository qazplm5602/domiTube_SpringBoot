package com.domi.domitube.Service;

import com.domi.domitube.Repository.CommentRepository;
import com.domi.domitube.Repository.Entity.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {
    final CommentRepository commentRepository;

    public void Save(Comment comment) {
        commentRepository.save(comment);
    }

    public void Delete(Comment comment) {
        commentRepository.DeleteChildrenComment(comment.getId()); // 답장한거 다 지움
        commentRepository.delete(comment);
    }

    public Comment GetCommentForId(long id) {
        return commentRepository.findById(id).orElse(null);
    }
}
