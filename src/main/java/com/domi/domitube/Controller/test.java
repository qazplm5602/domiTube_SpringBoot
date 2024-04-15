package com.domi.domitube.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class test
{
    @GetMapping("/ping")
    Map<String, Object> Ping(HttpServletRequest request) {
            String myID = "";

            Object boxing = request.getAttribute("user.id");
            if (boxing != null)
                myID = boxing.toString();

        return Map.of(
            "result", true,
            "content", "Pong!",
            "user", myID
        );
    }
}
