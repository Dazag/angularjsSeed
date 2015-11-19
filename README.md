#angularjsSeed
This is a default project which enable you to start a project in a fast, easy and versatile way with a specific set-up for 
TypeScript and AngularJS developers. 

**It uses, LESS, TypeScript, and Gulp.**

This project hasn't got a TypeScript compiler included with Gulp, neither it brings a LESS compiler or JS minifier, 
you have to choose one of your own so it does generate app.js (TypeScript), CSS files (LESS) and .min.js (JavaScript) 
for gulp to inject it in the html. Or you just modify gulp  to generate your project files as you wish. 

#Basic Information
There are three important gulp commands, "gulp watch" which will whatch for new assets added to your project and "gulp devIndex",
"gulp devProd", both of them inject into your index.html all your dependencies from bower. The difference between this
both commands is that the second one concat all JS and CSS files into minified versions of it (all.min.js and all.min.css)

#First Steps
Clone this project or download it. 
Then run "bower install", "npm install" and "gulp devIndex" to start programming.