package com.domi.domitube.Filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;

import java.io.IOException;

@WebFilter(urlPatterns = "/api/*")
public class AccountFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
//        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("filter!");
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
//        Filter.super.destroy();
    }
}
