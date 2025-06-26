# Dummy Data for Yellr Project

This directory contains dummy data files for testing and development purposes.

## Files

- `users.json` - Contains only users data in JSON array format
- `posts.json` - Contains only posts data in JSON array format
- `follows.json` - Contains only follow relationships in JSON array format
- `comments.json` - Contains only comments data in JSON array format

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
- Profile picture URLs (+ 1 incorrect URL for test purposes)
- PasswordHash fields (the **password** is the **username**)
- Creation dates
- User roles (user/admin)

### Posts
The dummy data includes 18 posts with:
- Content (under 280 characters as per model)
- Author references (linking to user IDs)
- Tags (extracted from hashtags in content)
- Like arrays (containing user IDs who liked the post)
- Image URLs (some posts have images, some don't)
- Video URLs (one post has a video)
- Creation and update timestamps
- A large variety of tags

### Comments
The dummy data includes 12 comments with:
- Content (short, conversational)
- Author references (linking to user IDs)
- Post references (linking to post IDs)
- Parent comment references (for replies)
- Like arrays (containing user IDs who liked the comment)
- Creation and update timestamps

### Follows
The dummy data includes 8 follow relationships:
- Each entry has a follower, a following, and a creation date
- All users are involved in at least one follow relationship

## How to Import

### Option 1: Using Makefile (Recommended)

The easiest way to import the dummy data is using the Makefile target:

```bash
make import-dummy-data
```

This will:
1. Clear existing users, posts, follows, and comments from the MongoDB database
2. Import users from `tests/users.json`
3. Import posts from `tests/posts.json`
4. Import follows from `tests/follows.json`
5. Import comments from `tests/comments.json`

### Option 2: Using MongoDB Compass or mongoimport

You can also import the data manually using MongoDB Compass or the `mongoimport` command:

```bash
# Import users
mongoimport --db yellr --collection users --file tests/users.json --jsonArray

# Import posts
mongoimport --db yellr --collection posts --file tests/posts.json --jsonArray

# Import follows
mongoimport --db yellr --collection follows --file tests/follows.json --jsonArray

# Import comments
mongoimport --db yellr --collection comments --file tests/comments.json --jsonArray
```

## Notes

- User IDs and post IDs are pre-generated MongoDB ObjectIds
- The data includes realistic content with hashtags that are extracted into the tags array
- Some posts have images, some have videos, and some have neither
- The data follows the schema defined in your model files
- All timestamps are in ISO format
- Comments are threaded (some are replies to other comments)

## Customization

You can modify the JSON files to add more users, posts, comments, or change the existing data. The Makefile target will clear existing data before importing, so be careful if you have production data.

To preserve existing data, modify the Makefile target to remove the `deleteMany()` calls.

## Prerequisites

To use the Makefile target, you need:
- Docker and Docker Compose installed
- MongoDB container running (start with `make run-dev` or `make run-prod`)
- The MongoDB container must be named `mongo` (which is the default in docker-compose.yml)

The Makefile target uses Docker commands to execute MongoDB tools inside the container, so you don't need to install MongoDB tools on your host system 