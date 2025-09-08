import asyncio

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from tortoise import Tortoise

from db.models import Article

TOKEN = "7938757973:AAH5CozQVpho92cMOVn1M4sI4fhkVg8wUgw"

dp = Dispatcher()


@dp.message(CommandStart())
async def start_handler(message: Message, command: CommandStart):
    if command.args:
        article = await Article.get_or_none(id=command.args)
        if article:
            await message.answer(article.content)
        else:
            await message.answer("Article not found")

# Run the bot
async def main() -> None:
    await Tortoise.init(
        db_url="postgres://postgres:password@localhost:5432/postgres",
        modules={"models": ["db.models"]}
    )
    bot = Bot(token=TOKEN)
    print("Bot is running")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
