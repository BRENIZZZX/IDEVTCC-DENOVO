package com.itb.inf2dm.idevplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/usuario/cadastro").permitAll()
                .requestMatchers("/api/v1/usuario/login").permitAll()
                .requestMatchers("/api/v1/projeto/abertos").permitAll()
                .requestMatchers("/api/v1/usuario/profissionais").permitAll()
                .requestMatchers("/api/v1/usuario/empresas").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}
