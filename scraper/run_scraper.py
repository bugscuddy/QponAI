#!/usr/bin/env python3
"""
QponAI ShopRite Scraper Runner

This script demonstrates how to use the ShopRiteScraper class.
"""
import asyncio
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from shoprite_scraper import ShopRiteScraper

# Configure logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Main function to run the scraper."""
    # Load environment variables
    env_path = Path(__file__).parent.parent / 'backend' / '.env'
    load_dotenv(dotenv_path=env_path)
    
    # Get credentials from environment variables
    username = os.getenv("SHOPRITE_USERNAME")
    password = os.getenv("SHOPRITE_PASSWORD")
    
    if not username or not password:
        logger.error("ShopRite credentials not found in environment variables.")
        logger.info("Please set SHOPRITE_USERNAME and SHOPRITE_PASSWORD in your .env file.")
        return
    
    # Initialize the scraper
    logger.info("Initializing ShopRite scraper...")
    scraper = ShopRiteScraper(headless=False)  # Set to True for production
    
    try:
        await scraper.initialize()
        
        # Log in to ShopRite
        logger.info(f"Logging in as {username}...")
        logged_in = await scraper.login(username, password)
        
        if not logged_in:
            logger.error("Failed to log in to ShopRite. Please check your credentials.")
            return
        
        # Get available coupons
        logger.info("Fetching available coupons...")
        coupons = await scraper.get_available_coupons()
        
        # Save coupons to a file
        output_file = "coupons.json"
        with open(output_file, 'w') as f:
            json.dump(coupons, f, indent=2, default=str)
        
        logger.info(f"Found {len(coupons)} coupons. Saved to {output_file}")
        
        # Clip all available coupons
        logger.info("Clipping all available coupons...")
        results = await scraper.clip_all_coupons()
        
        # Count successful clips
        successful = sum(1 for success in results.values() if success)
        logger.info(f"Successfully clipped {successful}/{len(results)} coupons.")
        
    except Exception as e:
        logger.error(f"An error occurred: {e}")
    finally:
        # Make sure to close the browser
        await scraper.close()
        logger.info("Scraper session ended.")

if __name__ == "__main__":
    asyncio.run(main())
