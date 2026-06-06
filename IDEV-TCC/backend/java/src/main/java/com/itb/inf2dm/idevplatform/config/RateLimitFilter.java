package com.itb.inf2dm.idevplatform.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    private final Map<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, Long> resetTimes = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_MS = 60000; // 1 minuto

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        if (httpRequest.getRequestURI().contains("/login")) {
            String clientIp = getClientIP(httpRequest);
            long currentTime = System.currentTimeMillis();
            
            resetTimes.putIfAbsent(clientIp, currentTime + WINDOW_MS);
            
            if (currentTime > resetTimes.get(clientIp)) {
                requestCounts.put(clientIp, new AtomicInteger(0));
                resetTimes.put(clientIp, currentTime + WINDOW_MS);
            }
            
            AtomicInteger count = requestCounts.computeIfAbsent(clientIp, k -> new AtomicInteger(0));
            
            if (count.incrementAndGet() > MAX_REQUESTS) {
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Muitas tentativas de login. Tente novamente em 1 minuto.\"}");
                return;
            }
        }
        
        chain.doFilter(request, response);
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
