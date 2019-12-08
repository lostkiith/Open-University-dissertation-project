package TM470Project.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final MongoUserDetailsService userDetailsService;

    public WebSecurityConfig(MongoUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers("/Staff/**").hasRole("MANAGER")
                    .antMatchers("/SupportedHouse/**").hasRole("MANAGER")
                    .antMatchers("/Client/registerClient").hasRole("MANAGER")
                    .antMatchers("/Client/updateClient").hasRole("MANAGER")
                    .antMatchers("/Client/getClients").hasRole("MANAGER")
                    .antMatchers("/Client/removeClient").hasRole("MANAGER")
                    .antMatchers("/Client/createNote").hasRole("STAFF")
                    .antMatchers("/Client/noteHasBeenReadBy").hasRole("STAFF")
                    .antMatchers("/Charity/registerClientInSupportedHouse").hasRole("MANAGER")
                    .antMatchers("/Charity/removeClientFromSupportedHouse").hasRole("MANAGER")
                    .antMatchers("/Charity/getSupportedHouse").hasRole("MANAGER")
                    .antMatchers("/Charity/getAllUnassignedSupportedHouses").hasRole("MANAGER")
                    .antMatchers("/Charity/getSpecificSupportedHouse").hasRole("MANAGER")
                    .antMatchers("/Charity/getAppointmentsFor").hasRole("MANAGER")
                    .antMatchers("/Charity/getAppropriateStaff").hasRole("MANAGER")
                    .antMatchers("/Charity/getLoggedInRole").hasRole("STAFF")
                    .antMatchers("/Charity/getLoggedInID").hasRole("STAFF")
                    .antMatchers("/Charity/behavioralSignsMissedAppOneSup").hasRole("STAFF")
                    .antMatchers("/Charity/behavioralSignsMissedAppAll").hasRole("STAFF")
                    .antMatchers("/Charity/createAppMeeting").hasRole("STAFF")
                    .antMatchers("/Charity/getAppointments").hasRole("STAFF")
                    .antMatchers("/Charity/getSupportWorkersClients").hasRole("STAFF")
                    .antMatchers("/Charity/createAnAppointment").hasRole("STAFF")
                    .anyRequest().authenticated()
                    .and()
                .formLogin()
                .defaultSuccessUrl("/home.html", true)
                .and()
                .httpBasic();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.userDetailsService(userDetailsService);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
