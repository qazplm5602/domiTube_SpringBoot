package com.domi.domitube.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class test
{
    @GetMapping("/ping")
    Map<String, Object> Ping() {
        return Map.of(
            "result", true,
            "content", "Pong!"
        );
    }
}
