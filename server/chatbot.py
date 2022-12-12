# Import the chatterbot library
from chatterbot import ChatBot

# Create a new chatbot
bot = ChatBot(
  'Chatbot',
  trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)

# Train the chatbot using the English corpus
bot.train("chatterbot.corpus.english")

# Define a function to generate a response to user input
def generate_response(input):
  # Use the chatbot to generate a response
  response = bot.get_response(input)
  return response

# Listen for user input and generate a response
input = input('Question? ')
response = generate_response(input)
print(response) # Output: 'My name is Chatbot.'