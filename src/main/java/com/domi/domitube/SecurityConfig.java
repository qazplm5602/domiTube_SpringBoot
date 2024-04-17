package com.domi.domitube;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(AbstractHttpConfigurer::disable); //cors 방지
        http.csrf(AbstractHttpConfigurer::disable); //csrf 방지
        http.formLogin(AbstractHttpConfigurer::disable); //기본 로그인페이지 없애기
        http.headers(AbstractHttpConfigurer -> AbstractHttpConfigurer.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        return http.build();
    }
}
