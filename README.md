# MERN Social

A Facebook-like social media application built with the MERN (MongoDB, Express, React, Node) stack.

## Project Demo


## Tech Stacks
<ul>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>Express.js</li>
      <li>MongoDB and Mongoose</li>
    </ul>
  </li>
  <li>Frontend
    <ul>
      <li>HTML5, CSS3, JavaScript</li>
      <li>React</li>
      <li>Material UI</li>
    </ul>
  </li>
</ul>

## App features
<ol>
  <li>Users can signup, login and logout of the app.</li>
  <li>User authentication is done via JSON Web Token (JWT).</li>
  <li>Users can search, follow and unfollow other users.</li>
  <li>Users can create and delete their posts in the NewsFeed.</li>
  <li>Users can like, unlike, comment and uncomment on posts.</li>
  <li>Users can add a profile image and bio.</li>
</ol>

## Remarks

The posts displayed in the NewsFeed and Profile are lazy loaded for optimization and scalability. 
Posts are retrieved 5 at a time, and new posts will be retrieved when user scrolls to the bottom of page.
To make the lazy loading effect more obvious (for the purpose of this project), I have added a timeout of 1 second before new posts are retrieved.