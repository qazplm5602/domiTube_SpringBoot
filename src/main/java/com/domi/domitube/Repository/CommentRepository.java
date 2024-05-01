package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Object> {

}
