This is the firebase backend API to handle user CRUD actions

## GoussanMedia

To set this up you need to create a config.js in the functions/util folder. This config.js need to contain your Firebase sdk information. Such as your apiKey, authDomain etc. Afterwards you just need to deploy it to Firebase and it will create your API and Database Triggers. You will also need to create some indexes for the triggers to work.

## Features
User Registration
User Login
Upload Image
Add User Details
View User Details
Mark Notifications Read
Create Posts
Fetch Post
Fetch All Posts
Delete Posts
Comment on Posts
Like/Unlike Posts
Notifications

Notification Triggers:
Notification On Like
Delete Notification On Unlike
Create Notification On Comment
On User Image Change
On Post Delete
