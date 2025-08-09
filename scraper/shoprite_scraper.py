import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import json
from datetime import datetime
from typing import List, Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ShopRiteScraper:
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.base_url = "https://www.shoprite.com"
        self.login_url = f"{self.base_url}/signin"
        self.coupons_url = f"{self.base_url}/foru/coupons-deals"
        
    async def initialize(self):
        """Initialize the Playwright browser and context."""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=self.headless)
        self.context = await self.browser.new_context()
        self.page = await self.context.new_page()
        
    async def close(self):
        """Close the browser and release resources."""
        await self.browser.close()
        await self.playwright.stop()
        
    async def login(self, username: str, password: str) -> bool:
        """Log in to ShopRite account."""
        try:
            logger.info("Navigating to login page...")
            await self.page.goto(self.login_url, wait_until="networkidle")
            
            # Fill in login form
            await self.page.fill('input[name="email"]', username)
            await self.page.fill('input[name="password"]', password)
            
            # Click login button
            await self.page.click('button[type="submit"]')
            
            # Wait for navigation to complete
            await self.page.wait_for_load_state("networkidle")
            
            # Check if login was successful
            if "my-account" in self.page.url:
                logger.info("Login successful!")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Login failed: {str(e)}")
            return False
            
    async def get_available_coupons(self) -> List[Dict]:
        """Fetch all available coupons."""
        try:
            logger.info("Fetching available coupons...")
            await self.page.goto(self.coupons_url, wait_until="networkidle")
            
            # Wait for coupons to load
            await self.page.wait_for_selector('.coupon-item', timeout=10000)
            
            # Get page content
            content = await self.page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            coupons = []
            coupon_items = soup.select('.coupon-item')
            
            for item in coupon_items:
                try:
                    coupon = {
                        'coupon_id': item.get('data-coupon-id', ''),
                        'title': self._get_text(item, '.coupon-title'),
                        'description': self._get_text(item, '.coupon-description'),
                        'discount_amount': self._get_text(item, '.coupon-amount'),
                        'expiration_date': self._parse_expiration_date(
                            self._get_text(item, '.coupon-expiry')
                        ),
                        'image_url': self._get_attr(item, 'img.coupon-image', 'src'),
                        'terms': self._get_text(item, '.coupon-terms'),
                        'is_clipped': 'coupon-clipped' in item.get('class', [])
                    }
                    coupons.append(coupon)
                except Exception as e:
                    logger.warning(f"Error parsing coupon: {str(e)}")
                    continue
                    
            return coupons
            
        except Exception as e:
            logger.error(f"Error fetching coupons: {str(e)}")
            return []
            
    async def clip_coupon(self, coupon_id: str) -> bool:
        """Clip a specific coupon by ID."""
        try:
            # Find the coupon button and click it
            selector = f'button[data-coupon-id="{coupon_id}"]:not(.coupon-clipped)'
            await self.page.click(selector)
            
            # Wait for the clip to complete
            await self.page.wait_for_selector(f'button[data-coupon-id="{coupon_id}"].coupon-clipped', 
                                            timeout=5000)
            return True
            
        except Exception as e:
            logger.error(f"Error clipping coupon {coupon_id}: {str(e)}")
            return False
            
    async def clip_all_coupons(self) -> Dict[str, bool]:
        """Clip all available coupons."""
        results = {}
        coupons = await self.get_available_coupons()
        
        for coupon in coupons:
            if not coupon['is_clipped']:
                success = await self.clip_coupon(coupon['coupon_id'])
                results[coupon['coupon_id']] = success
                
        return results
        
    def _get_text(self, element, selector: str, default: str = '') -> str:
        """Helper to safely get text from a selector."""
        selected = element.select_one(selector)
        return selected.get_text(strip=True) if selected else default
        
    def _get_attr(self, element, selector: str, attr: str, default: str = '') -> str:
        """Helper to safely get an attribute from a selector."""
        selected = element.select_one(selector)
        return selected.get(attr, default) if selected else default
        
    def _parse_expiration_date(self, date_str: str) -> Optional[datetime]:
        """Parse expiration date string into a datetime object."""
        try:
            # Example: "Expires 12/31/2023"
            if not date_str:
                return None
                
            # Extract date part
            date_part = date_str.lower().replace('expires', '').strip()
            return datetime.strptime(date_part, '%m/%d/%Y')
            
        except Exception as e:
            logger.warning(f"Error parsing date '{date_str}': {str(e)}")
            return None

async def example_usage():
    """Example usage of the ShopRiteScraper."""
    scraper = ShopRiteScraper(headless=False)  # Set headless=False to see the browser
    try:
        await scraper.initialize()
        
        # Login
        logged_in = await scraper.login("your_email@example.com", "your_password")
        if not logged_in:
            print("Login failed!")
            return
            
        # Get available coupons
        coupons = await scraper.get_available_coupons()
        print(f"Found {len(coupons)} coupons")
        
        # Save to JSON for inspection
        with open('coupons.json', 'w') as f:
            json.dump(coupons, f, indent=2, default=str)
            
        # Clip all coupons
        results = await scraper.clip_all_coupons()
        print(f"Clipped {sum(1 for x in results.values() if x)}/{len(results)} coupons")
        
    finally:
        await scraper.close()

if __name__ == "__main__":
    asyncio.run(example_usage())
