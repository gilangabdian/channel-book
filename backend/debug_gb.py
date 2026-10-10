import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        resp = await client.get('https://www.googleapis.com/books/v1/volumes?q=subject:fiction')
        data = resp.json()
        print(data.get('error'))

asyncio.run(test())
