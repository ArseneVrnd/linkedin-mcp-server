"""
LinkedIn job scraping tools with search and detail extraction.

Provides MCP tools for job posting details and job searches
with comprehensive filtering and structured data extraction.
"""

import logging
import re
from typing import Any, Dict, Optional, List

from fastmcp import Context, FastMCP
from linkedin_scraper import JobScraper, JobSearchScraper
from mcp.types import ToolAnnotations
from playwright.async_api import Page

from linkedin_mcp_server.callbacks import MCPContextProgressCallback
from linkedin_mcp_server.drivers.browser import (
    ensure_authenticated,
    get_or_create_browser,
)
from linkedin_mcp_server.error_handler import handle_tool_error

logger = logging.getLogger(__name__)


async def extract_enhanced_job_data(page: Page, job_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract additional job fields beyond the base scraper.

    Args:
        page: Playwright page object
        job_dict: Base job data from JobScraper

    Returns:
        Enhanced job data with additional fields
    """
    try:
        # Extract skills and requirements
        skills = await extract_skills(page, job_dict.get('job_description', ''))
        if skills:
            job_dict['skills'] = skills

        # Extract salary range
        salary = await extract_salary(page)
        if salary:
            job_dict['salary_range'] = salary

        # Extract seniority level
        seniority = await extract_seniority(page)
        if seniority:
            job_dict['seniority_level'] = seniority

        # Extract employment type
        employment_type = await extract_employment_type(page)
        if employment_type:
            job_dict['employment_type'] = employment_type

        # Extract remote/hybrid/onsite status
        remote_status = await extract_remote_status(page, job_dict.get('location', ''))
        if remote_status:
            job_dict['remote_status'] = remote_status

        # Extract benefits (often in description, try to parse)
        benefits = await extract_benefits(page)
        if benefits:
            job_dict['benefits'] = benefits

        # Extract number of applicants as integer
        applicant_count_text = job_dict.get('applicant_count', '')
        if applicant_count_text:
            job_dict['applicants_count_numeric'] = parse_applicant_count(applicant_count_text)

    except Exception as e:
        logger.warning(f"Error extracting enhanced job data: {e}")

    return job_dict


async def extract_skills(page: Page, description: str = '') -> Optional[List[str]]:
    """Extract required/preferred skills from job criteria section."""
    try:
        skills = []

        # Look for skills in job criteria section
        criteria_items = await page.locator('li[class*="job-criteria"]').all()
        for item in criteria_items:
            text = await item.inner_text()
            if 'skill' in text.lower():
                skills_text = text.split('\n')[-1] if '\n' in text else text
                skills.append(skills_text.strip())

        # Also look in description for common skill patterns
        if description:
            # Match patterns like "Required skills:", "Must have:", etc.
            skill_patterns = [
                r'(?:Required|Preferred|Must have|Nice to have)[\s:]+(.+?)(?:\n|$)',
                r'Skills?[\s:]+(.+?)(?:\n|$)',
            ]
            for pattern in skill_patterns:
                matches = re.findall(pattern, description, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    # Split by common delimiters
                    found_skills = re.split(r'[,;•\n]', match)
                    skills.extend([s.strip() for s in found_skills if s.strip()])

        # Deduplicate and return
        unique_skills = list(dict.fromkeys([s for s in skills if len(s) > 2]))
        return unique_skills[:20] if unique_skills else None  # Limit to 20 skills

    except Exception as e:
        logger.debug(f"Error extracting skills: {e}")
        return None


async def extract_salary(page: Page) -> Optional[str]:
    """Extract salary range from job insights or description."""
    try:
        # Check job insights section
        insights_items = await page.locator('li[class*="job-insight"]').all()
        for item in insights_items:
            text = await item.inner_text()
            if '$' in text or 'salary' in text.lower() or 'compensation' in text.lower():
                return text.strip()

        # Check main content for salary mentions
        text_elements = await page.locator('span, div').all()
        for elem in text_elements:
            text = await elem.inner_text()
            # Look for patterns like "$100k - $150k" or "$100,000 - $150,000"
            if re.search(r'\$\s*\d+[,\d]*\s*[-–]\s*\$?\s*\d+[,\d]*', text):
                return text.strip()

        return None
    except Exception as e:
        logger.debug(f"Error extracting salary: {e}")
        return None


async def extract_seniority(page: Page) -> Optional[str]:
    """Extract seniority level from job criteria."""
    try:
        criteria_items = await page.locator('li[class*="job-criteria"]').all()
        for item in criteria_items:
            text = await item.inner_text()
            if 'seniority' in text.lower() or 'level' in text.lower():
                # Extract the value (usually after newline or colon)
                lines = text.split('\n')
                if len(lines) > 1:
                    return lines[-1].strip()
        return None
    except Exception as e:
        logger.debug(f"Error extracting seniority: {e}")
        return None


async def extract_employment_type(page: Page) -> Optional[str]:
    """Extract employment type (Full-time, Contract, etc.)."""
    try:
        criteria_items = await page.locator('li[class*="job-criteria"]').all()
        for item in criteria_items:
            text = await item.inner_text()
            if 'employment type' in text.lower() or 'job type' in text.lower():
                lines = text.split('\n')
                if len(lines) > 1:
                    return lines[-1].strip()
        return None
    except Exception as e:
        logger.debug(f"Error extracting employment type: {e}")
        return None


async def extract_remote_status(page: Page, location: str) -> Optional[str]:
    """Determine if job is Remote, Hybrid, or On-site."""
    try:
        location_lower = location.lower() if location else ''

        if 'remote' in location_lower:
            return 'Remote'
        elif 'hybrid' in location_lower:
            return 'Hybrid'
        else:
            # Check job description or criteria
            text_elements = await page.locator('span, div, li').all()
            for elem in text_elements[:50]:  # Check first 50 elements
                text = await elem.inner_text()
                text_lower = text.lower()
                if 'remote' in text_lower and len(text) < 100:
                    if 'hybrid' in text_lower:
                        return 'Hybrid'
                    return 'Remote'

            return 'On-site'
    except Exception as e:
        logger.debug(f"Error extracting remote status: {e}")
        return None


async def extract_benefits(page: Page) -> Optional[str]:
    """Extract benefits information from the job posting."""
    try:
        # Look for benefits section in the description
        headings = await page.locator('h2, h3, strong').all()
        for heading in headings:
            text = await heading.inner_text()
            if 'benefit' in text.lower() or 'perk' in text.lower():
                # Get the parent container
                parent = heading.locator('xpath=ancestor::div[1]')
                if await parent.count() > 0:
                    benefits_text = await parent.inner_text()
                    return benefits_text.strip()

        return None
    except Exception as e:
        logger.debug(f"Error extracting benefits: {e}")
        return None


def parse_applicant_count(applicant_text: str) -> Optional[int]:
    """Parse applicant count text to extract numeric value."""
    try:
        # Extract numbers from text like "50 applicants" or "100+ people clicked Apply"
        numbers = re.findall(r'\d+', applicant_text)
        if numbers:
            return int(numbers[0])
        return None
    except:
        return None


def register_job_tools(mcp: FastMCP) -> None:
    """
    Register all job-related tools with the MCP server.

    Args:
        mcp: The MCP server instance
    """

    @mcp.tool(
        annotations=ToolAnnotations(
            title="Get Job Details",
            readOnlyHint=True,
            destructiveHint=False,
            openWorldHint=True,
        )
    )
    async def get_job_details(job_id: str, ctx: Context) -> Dict[str, Any]:
        """
        Get job details for a specific job posting on LinkedIn.

        Args:
            job_id: LinkedIn job ID (e.g., "4252026496", "3856789012")
            ctx: FastMCP context for progress reporting

        Returns:
            Structured job data including title, company, location,
            posting date, job description, skills, salary, remote status,
            seniority level, employment type, and benefits.
        """
        try:
            # Validate session before scraping
            await ensure_authenticated()

            # Construct LinkedIn URL from job ID
            job_url = f"https://www.linkedin.com/jobs/view/{job_id}/"

            logger.info(f"Scraping job: {job_url}")

            browser = await get_or_create_browser()
            scraper = JobScraper(browser.page, callback=MCPContextProgressCallback(ctx))
            job = await scraper.scrape(job_url)

            # Get base job data
            job_data = job.to_dict()

            # Extract enhanced fields
            logger.info("Extracting enhanced job data...")
            enhanced_data = await extract_enhanced_job_data(browser.page, job_data)

            logger.info(f"Successfully scraped enhanced job data with {len(enhanced_data.get('skills', []) or [])} skills")

            return enhanced_data

        except Exception as e:
            return handle_tool_error(e, "get_job_details")

    @mcp.tool(
        annotations=ToolAnnotations(
            title="Search Jobs",
            readOnlyHint=True,
            destructiveHint=False,
            openWorldHint=True,
        )
    )
    async def search_jobs(
        keywords: str,
        ctx: Context,
        location: str | None = None,
        limit: int = 25,
    ) -> Dict[str, Any]:
        """
        Search for jobs on LinkedIn.

        Args:
            keywords: Search keywords (e.g., "software engineer", "data scientist")
            ctx: FastMCP context for progress reporting
            location: Optional location filter (e.g., "San Francisco", "Remote")
            limit: Maximum number of job URLs to return (default: 25)

        Returns:
            Dict with job_urls list and count. Use get_job_details to get
            full details for specific jobs.
        """
        try:
            # Validate session before scraping
            await ensure_authenticated()

            logger.info(f"Searching jobs: keywords='{keywords}', location='{location}'")

            browser = await get_or_create_browser()
            scraper = JobSearchScraper(
                browser.page, callback=MCPContextProgressCallback(ctx)
            )
            job_urls = await scraper.search(
                keywords=keywords,
                location=location,
                limit=limit,
            )

            return {"job_urls": job_urls, "count": len(job_urls)}

        except Exception as e:
            return handle_tool_error(e, "search_jobs")
