package com.domi.domitube.Filter;

import com.domi.domitube.DTO.JWTparseDTO;
import com.domi.domitube.DTO.JWTtokenDTO;
import com.domi.domitube.Service.JWTservice;
import com.domi.domitube.Service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebFilter(urlPatterns = "/api/*")
public class AccountFilter implements Filter {
    JWTservice jwtService;
    UserService userService;

    public AccountFilter(JWTservice _jwtService, UserService _userService) {
        jwtService = _jwtService;
        userService = _userService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
//        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        String headAuth = request.getHeader("Authorization");

        // JWT 처리
        if (headAuth != null && headAuth.startsWith("Bearer ")) {
            String token = headAuth.substring(7);
            String errorReason = "";
            String errorCode = "";
            try {
                JWTparseDTO jwt = jwtService.ParseToken(token);

                if (jwt.getType() == JWTparseDTO.Type.Refresh) {
                    errorCode = "JWT006";
                    errorReason = "엑세스 토큰으로 발급 후 호출하세요.";
                } else {
                    servletRequest.setAttribute("user.id", jwt.getId());
                }
            } catch (MalformedJwtException e) {
                errorCode = "JWT001";
                errorReason = "JWT 형식이 올바르지 않습니다.";
            } catch (SignatureException e) {
                errorCode = "JWT002";
                errorReason = "잘못된 서명입니다.";
            } catch (ExpiredJwtException e) {
                errorCode = "JWT003";
                errorReason = "토큰이 만료되었습니다.";
            } catch (UnsupportedJwtException e) {
                errorCode = "JWT004";
                errorReason = "지원하지 않는 토큰입니다.";
            } catch (SecurityException e) {
                errorCode = "JWT005";
                errorReason = "보안 오류";
            }

            // 오류 처리
            if (!errorReason.isEmpty()) {
                ExceptionHandler(servletResponse, 401, errorCode, errorReason);
                return;
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
//        Filter.super.destroy();
    }

    void ExceptionHandler(ServletResponse servletResponse, int statusCode, String errorCode, String reason) {
        HttpServletResponse response = (HttpServletResponse)servletResponse;

        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String json = new ObjectMapper().writeValueAsString(Map.of( "code", errorCode, "reason", reason ));
            response.getWriter().write(json);
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
