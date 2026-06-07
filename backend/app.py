import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app) # Allows React to communicate with Flask

# Connect to Local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["gamevault_db"]
users_collection = db["users"]
collections_db = db["user_collections"]

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # Capture the new fields
    name = data.get('name', '')
    username = data.get('username', '')
    phone = data.get('phone', '')
    genres = data.get('genres', [])

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    new_user = {
        "email": email,
        "password": password, 
        "name": name,
        "username": username,
        "phone": phone,
        "favorite_genres": genres
    }
    
    users_collection.insert_one(new_user)
    
    # Return the user data so React can log them in immediately
    user_data = {"email": email, "name": name, "username": username, "phone": phone, "genres": genres}
    return jsonify({"message": "Account created successfully!", "user": user_data}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users_collection.find_one({"email": email})
    
    if user and user['password'] == password:
        # Strip out the password and send the profile data back to React
        user_data = {
            "email": user["email"],
            "name": user.get("name", ""),
            "username": user.get("username", ""),
            "phone": user.get("phone", ""),
            "genres": user.get("favorite_genres", [])
        }
        return jsonify({"message": "Welcome back!", "user": user_data}), 200
        
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/steam/game/<int:appid>', methods=['GET'])
def get_steam_game(appid):
    url = f"https://store.steampowered.com/api/appdetails?appids={appid}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        str_appid = str(appid)
        
        if data and str_appid in data and data[str_appid]['success']:
            game_data = data[str_appid]['data']
            
            cleaned_data = {
                "id": appid,
                "title": game_data.get('name'),
                "image": game_data.get('header_image'),
                "description": game_data.get('short_description'),
                "developer": game_data.get('developers', ['Unknown'])[0],
                "genres": [g['description'] for g in game_data.get('genres', [])][:3],
                "platform": "PC",
                "sysReq": game_data.get('pc_requirements', {}).get('minimum', 'Requirements not listed.'),
                "screenshots": [s['path_full'] for s in game_data.get('screenshots', [])][:6]
            }
            return jsonify(cleaned_data), 200
            
        return jsonify({"error": "Game not found on Steam"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/collections/<email>', methods=['GET'])
def get_collections(email):
    # Fetch all collections for a specific user
    user_cols = list(collections_db.find({"user_email": email}, {'_id': 0}))
    return jsonify(user_cols), 200

@app.route('/api/collections/create', methods=['POST'])
def create_collection():
    data = request.json
    email = data.get('email')
    name = data.get('name')

    # Check if collection already exists for this user
    if collections_db.find_one({"user_email": email, "name": name}):
        return jsonify({"error": "Collection already exists"}), 400

    new_collection = {
        "user_email": email,
        "name": name,
        "games": [] # Array of game objects: {id, title, image}
    }
    
    collections_db.insert_one(new_collection)
    return jsonify({"message": "Collection created!"}), 201

@app.route('/api/collections/toggle', methods=['POST'])
def toggle_game_in_collection():
    data = request.json
    email = data.get('email')
    col_name = data.get('collection_name')
    game = data.get('game') # expects {id, title, image}

    collection = collections_db.find_one({"user_email": email, "name": col_name})
    if not collection:
        return jsonify({"error": "Collection not found"}), 404

    # Check if game is already in the array
    game_exists = any(g['id'] == game['id'] for g in collection['games'])

    if game_exists:
        # Remove game
        collections_db.update_one(
            {"user_email": email, "name": col_name},
            {"$pull": {"games": {"id": game['id']}}}
        )
        return jsonify({"message": "Game removed"}), 200
    else:
        # Add game
        collections_db.update_one(
            {"user_email": email, "name": col_name},
            {"$push": {"games": game}}
        )
        return jsonify({"message": "Game added"}), 200

@app.route('/api/steam/search/<query>', methods=['GET'])
def search_steam(query):
    # Use Steam's official storefront search API
    url = f"https://store.steampowered.com/api/storesearch/?term={query}&l=english&cc=US"
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get('total', 0) > 0:
            results = []
            # Grab the top 5 closest matches
            for item in data.get('items', [])[:5]: 
                results.append({
                    "id": str(item.get('id')),
                    "title": item.get('name'),
                    "image": item.get('tiny_image')
                })
            return jsonify(results), 200
            
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile/update', methods=['POST'])
def update_profile():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Locate the user by email and update their specific fields, including the new genres array
    db.users.update_one(
        {"email": email},
        {"$set": {
            "name": data.get('name'),
            "username": data.get('username'),
            "phone": data.get('phone'),
            "genres": data.get('genres', []) # NEW: Saves the genre array (defaults to empty list if none exist)
        }}
    )
    
    return jsonify({"message": "Profile and genres updated successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)