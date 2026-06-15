from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import Response
from models import PlaceSearchRequest, PlacesSearchResponse, PlaceResult
import requests
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

router = APIRouter(
    prefix="/api/places",
    tags=["Places"]
)

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
SERPER_BASE_URL = "https://google.serper.dev"


@router.options("/search")
async def options_search(request: Request):
    """Handle CORS preflight for /search"""
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )


@router.post("/search", response_model=PlacesSearchResponse)
async def search_places(search_request: PlaceSearchRequest):
    """
    Search for places using Serper.dev Google Places API
    
    Args:
        search_request: PlaceSearchRequest containing query, location, gl, and num
        
    Returns:
        PlacesSearchResponse with list of places and search parameters
    """
    if not SERPER_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Serper API key not configured"
        )
    
    try:
        # Enhance query if it's just a city/place name without context keywords
        query = search_request.query.strip()
        context_keywords = ["in", "near", "at", "around", "restaurants", "hotels", 
                           "tourist", "places", "attractions", "cafes", "museums",
                           "parks", "shopping", "historical", "famous", "best", "top"]
        query_lower = query.lower()
        has_context = any(kw in query_lower for kw in context_keywords)
        
        # If query is very short (1-2 words) and has no context keywords, 
        # it's likely a city or general term, so we add "places in"
        if not has_context and len(query.split()) <= 2:
            query = f"popular places in {query}"
        
        # Prepare payload for Serper.dev API
        payload = {
            "q": query,
            "location": search_request.location,
            "gl": search_request.gl,
            "num": search_request.num
        }
        
        headers = {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
        
        # Make request to Serper.dev Places API
        response = requests.post(
            f"{SERPER_BASE_URL}/places",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        # Check if request was successful
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Serper API error: {response.status_code}"
            )
        
        data = response.json()
        
        # Transform API response to our model format
        places_list = []
        for place in data.get("places", []):
            place_result = PlaceResult(
                position=place.get("position", 0),
                title=place.get("title", ""),
                address=place.get("address", ""),
                latitude=place.get("latitude", 0.0),
                longitude=place.get("longitude", 0.0),
                phone_number=place.get("phoneNumber"),
                website=place.get("website"),
                cid=place.get("cid"),
                thumbnail=place.get("thumbnailUrl") or place.get("thumbnail"), # Serper uses thumbnailUrl often
                rating=place.get("rating"),
                ratingCount=place.get("ratingCount"),
                category=place.get("category")
            )
            places_list.append(place_result)
        
        return PlacesSearchResponse(
            places=places_list,
            search_params=data.get("searchParameters", {}),
            credits=data.get("credits")
        )
        
    except requests.Timeout:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Request to Serper API timed out"
        )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to connect to Serper API: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/search/{query}")
async def search_places_get(
    query: str,
    location: str = "Pakistan",
    gl: str = "pk",
    num: int = 10
):
    """
    GET endpoint for searching places (alternative to POST)
    
    Args:
        query: Search query (e.g., "restaurants in Lahore")
        location: Location context (default: "Pakistan")
        gl: Country code (default: "pk")
        num: Number of results (default: 10, max: 20)
    """
    search_request = PlaceSearchRequest(
        query=query,
        location=location,
        gl=gl,
        num=min(num, 20)  # Enforce max limit
    )
    return await search_places(search_request)
