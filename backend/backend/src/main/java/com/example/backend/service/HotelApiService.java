package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.backend.dto.HotelResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HotelApiService {
    
    @Value("${hotelapi.username:}")
    private String username;
    
    @Value("${hotelapi.password:}")
    private String password;
    
    private String jwtToken;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String AUTH_URL = "https://api.makcorps.com/auth";
    private static final String HOTELS_BASE_URL = "https://api.makcorps.com/free";
    
    /**
     * Authenticate and get JWT token
     */
    private String getJwtToken() {
        if (jwtToken != null) {
            return jwtToken;
        }
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> authRequest = new HashMap<>();
            authRequest.put("username", username);
            authRequest.put("password", password);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(authRequest, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(AUTH_URL, request, String.class);
            
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            jwtToken = jsonNode.get("access_token").asText();
            
            return jwtToken;
        } catch (Exception e) {
            throw new RuntimeException("Failed to authenticate with Hotel API: " + e.getMessage());
        }
    }
    
    /**
     * Search hotels by city name
     */
    public List<HotelResponse> searchHotelsByCity(String city) {
        try {
            String token = getJwtToken();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "JWT " + token);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            String url = HOTELS_BASE_URL + "/" + city.toLowerCase();
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
            );
            
            return parseHotelResponse(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch hotels: " + e.getMessage());
        }
    }
    
    /**
     * Parse the API response into HotelResponse objects
     */
    private List<HotelResponse> parseHotelResponse(String jsonResponse) {
        List<HotelResponse> hotels = new ArrayList<>();
        
        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            
            if (rootNode.isArray()) {
                for (JsonNode hotelNode : rootNode) {
                    if (hotelNode.isArray() && hotelNode.size() >= 2) {
                        JsonNode hotelInfo = hotelNode.get(0);
                        JsonNode pricesNode = hotelNode.get(1);
                        
                        String hotelName = hotelInfo.get("hotelName").asText();
                        String hotelId = hotelInfo.get("hotelId").asText();
                        
                        List<HotelResponse.PriceInfo> prices = new ArrayList<>();
                        
                        if (pricesNode.isArray()) {
                            for (JsonNode priceNode : pricesNode) {
                                // Extract price1, price2, etc.
                                for (int i = 1; i <= 4; i++) {
                                    String priceKey = "price" + i;
                                    String taxKey = "tax" + i;
                                    String vendorKey = "vendor" + i;
                                    
                                    if (priceNode.has(priceKey)) {
                                        JsonNode priceValue = priceNode.get(priceKey);
                                        if (!priceValue.isNull()) {
                                            String price = priceValue.asText();
                                            String tax = priceNode.has(taxKey) ? priceNode.get(taxKey).asText() : "0";
                                            String vendor = priceNode.has(vendorKey) ? priceNode.get(vendorKey).asText() : "";
                                            
                                            prices.add(new HotelResponse.PriceInfo(price, tax, vendor));
                                        }
                                    }
                                }
                            }
                        }
                        
                        hotels.add(new HotelResponse(hotelName, hotelId, prices));
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse hotel response: " + e.getMessage());
        }
        
        return hotels;
    }
}
