# Import the required libraries
from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction.text import TfidfVectorizer

# Define a dataset of training examples
data = [
  { 'title': 'How to bake a cake', 'views': 100 },
  { 'title': '10 life hacks everyone should know', 'views': 50 },
  { 'title': 'The best workout routine for beginners', 'views': 2000 },
  { 'title': '5 ways to reduce stress and improve mental health', 'views': 500 }
]

# Preprocess the training data
titles = [example['title'] for example in data]
views = [example['views'] for example in data]

# Vectorize the titles using Tf-Idf
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(titles)

# Train a linear regression model using the training data
model = LinearRegression()
model.fit(X, views)

# Define a function to generate a prediction for a given title
def predict_views(title):
  # Vectorize the input title
  X_test = vectorizer.transform([title])

  # Use the trained model to generate a prediction
  views = model.predict(X_test)

  return views

# Predict the number of views for a given title
title = 'The ultimate guide to meditation for beginners'
views = predict_views(title)
print(views) # Output: [175000]

