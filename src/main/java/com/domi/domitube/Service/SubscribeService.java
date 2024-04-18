package com.domi.domitube.Service;

import com.domi.domitube.DTO.SubscribeQueryDTO;
import com.domi.domitube.Repository.Entity.Subscribe;
import com.domi.domitube.Repository.SubscribeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscribeService {
    final SubscribeRepository subscribeRepository;

    public List<SubscribeQueryDTO> GetSubscribeUsers(String id) {
        return subscribeRepository.FindTargetIdsForId(id);
    }
}
