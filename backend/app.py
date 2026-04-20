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

if __name__ == '__main__':
    app.run(debug=True, port=5000)