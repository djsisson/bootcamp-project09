Build a social network
Overview
With authenticated users, we now have the ability to create user profiles and content that is associated with those users.

That means we can build complete user generated websites with users and associated content. We can build a social network.

User Stories
🐿️ As a user, I am able to sign up for an account and create a user profile
🐿️ As a user, I am able to log in and out of my account
🐿️ As a user, I am able to create posts on my profile timeline
🐿️ As a user, I am able to see all posts by all users on a global timeline

all complete

Stretch Stories
🐿️ As a user, I am able to see a list of other user's posts and/or profiles on the site
🐿️ As a user, I am able able to visit other user profiles
🐿️ As a user, I am able to follow other users
🐿️ As a user, I am able to like posts I think are good, and see how many likes a post has

all complete

ps hover over username for the hovercard

 Use Clerk.com to set up user signup and login.

🎯 Use the Clerk userId to associate posts with a user.

🎯 Enable each user to create a profile associated with their userId, and a form to input their biography and location data, etc. with a URL similar to /user/[userId].

🎯 Enable users to create posts associated with the userId, and display those posts on the user's profile page

🎯 Show a 404 error if a user profile doesn't exist - i just redirected to home

🎯 Use at least 1 Radix UI Primitive or similar - i used shadcn

tretch Goals
🏹 Enable users to visit other user profiles after seeing their posts on a global timeline

🏹 Enable users to follow other users by creating a follower and follwee relationship between two user profiles

🏹 Enable users to like other users' posts by creating a user_id and liked_post relationship in a junction table

🏹 A user's biography cannot be blank. If a user logs in but doesn't have a biography set, they should be asked to fill one in

ps hover over username for the hovercard
you can see all likes and follows in each persons profile

all requirements met

this week i wanted to try typescript, for the most part it was ok
although there was one sql function i had to leave in js as it would not work in typescript
in js you can pass a string array to sql np but in typescript you have to pass a string.. but converting the array to a string wouldnt work in sql, so not sure how to fix that

also had a weird bug in react:

if youre on your liked post page, and remove a like from a post, when using state to show change immediately, everything would be fine until the like was removed, and the page was revalidated as then the post disappeared and react would then remove the like from the post below (this was only displaying wrong a refresh would fix)
in the end i gave each like button a key instead of letting react do it, this then fixed the issue

so im guessing its a state management and dom issue with react and revalidating path, the old state gets used by the posts below instead of getting removed

external sources:

stackoverflow, nextjs docs, google, youtube
