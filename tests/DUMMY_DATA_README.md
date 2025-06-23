# Dummy Data for Yellr Project

This directory contains dummy data files for testing and development purposes.

## Files

- `users.json` - Contains only users data in JSON array format
- `posts.json` - Contains only posts data in JSON array format
- `DUMMY_DATA_README.md` - This file

## Data Structure

### Users
The dummy data includes 5 users:
- **johndoe** - Software developer
- **janesmith** - Digital artist
- **mikewilson** - Fitness coach
- **sarahjones** - Travel blogger
- **admin** - Platform administrator

All users have:
- Unique email addresses
- Usernames
- Bios
- Profile picture URLs (using Unsplash images + 1 incorrect URL)
- PasswordHash fields (the **password** is the **username**)
- Creation dates
- User roles (user/admin)

### Posts
The dummy data includes 8 posts with:
- Content (under 280 characters as per model)
- Author references (linking to user IDs)
- Tags (extracted from hashtags in content)
- Like arrays (containing user IDs who liked the post)
- Image URLs (some posts have images, some don't)
- Video URLs (one post has a video)
- Creation and update timestamps

## How to Import

### Option 1: Using Makefile (Recommended)

The easiest way to import the dummy data is using the Makefile target:

```bash
make import-dummy-data
```

This will:
1. Clear existing users and posts from the MongoDB database
2. Import users from `tests/users.json`
3. Import posts from `tests/posts.json`

### Option 2: Using MongoDB Compass or mongoimport

You can also import the data manually using MongoDB Compass or the `mongoimport` command:

```bash
# Import users
mongoimport --db yellr --collection users --file tests/users.json --jsonArray

# Import posts
mongoimport --db yellr --collection posts --file tests/posts.json --jsonArray
```

### Option 4: Using MongoDB shell

```javascript
// Connect to your database
use yellr

// Load the data
const users = JSON.parse(cat('tests/users.json'))
const posts = JSON.parse(cat('tests/posts.json'))

// Insert users
db.users.insertMany(users)

// Insert posts
db.posts.insertMany(posts)
```

## Notes

- User IDs and post IDs are pre-generated MongoDB ObjectIds
- The data includes realistic content with hashtags that are extracted into the tags array
- Some posts have images, some have videos, and some have neither
- The data follows the schema defined in your model files
- All timestamps are in ISO format

## Customization

You can modify the JSON files to add more users, posts, or change the existing data. The Makefile target will clear existing data before importing, so be careful if you have production data.

To preserve existing data, modify the Makefile target to remove the `deleteMany()` calls.

## Prerequisites

To use the Makefile target, you need:
- Docker and Docker Compose installed
- MongoDB container running (start with `make run-dev` or `make run-prod`)
- The MongoDB container must be named `mongo` (which is the default in docker-compose.yml)

The Makefile target uses Docker commands to execute MongoDB tools inside the container, so you don't need to install MongoDB tools on your host system 