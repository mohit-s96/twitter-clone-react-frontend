Check out the live version here [Whiner](https://github.com/facebook/create-react-app).

## About

This is a full stack social media app based on twitter's features and design. It uses react on the frontend and redux for state management.

## Backend

I used firebase's admin SDK to get up and running with a backend service.

## Styling

All component based custom CSS without any framework :)

### Current Features

* Authentication

* Create and post

* Delete posts

* Likes and repost other user's posts

* Follow other users

* Custom feed of latest posts from your following list

* Follow suggestions for newly registered users

* Reply to posts

* Notifications on like, comment, reposts

* Mention other users in post using '@'

* Add about me details including location / personal social media etc

* Fully working search bar with autocomplete search results

* View any users profile and all their posts

* View a post and all its comments

* Authentication based access to all features

## Firebase

This app is powered by Firebase utilizing service for Authentication, Database, Storage and Functions.

## Why not put the Firebase functions with this ?

It isn't fully optimized security wise and needs a few more changes design wise.

## Components

Most components are fully functional independently. Mock data using JSON server would get them running.

## Build and run

### `npm install`

Installs all the dependencies

### `npm start`

To launch the webpack dev server if you have a data endpoint setup

## What platform does it work on?

As of now, only desktops/laptops or slightly bigger screens. I plan on adding the styling for mobile in the future.

## What features/functionalities I would like to add ?

* Making comments count as actual posts and show relevant comments  on feed.

* Un-repost function (I forgot to implement this).

* More streamlined user feed.

* Load as you scroll.

* Improving some aspects of design including support for mobile and smaller screens.

* Adding like and repost list for a post. [Only needed to be added on frontend].

* Adding delete option for comments.

* Removing a notification if the change which created it was undone(eg after unlike)
