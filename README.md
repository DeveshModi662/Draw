# Collaborative Draw Web App

For dev : 
1. Dockerised microservices
2. Build the image on pushing changes to dev branch using Github actions self hosted runner
3. Auto patch the changes to test using Kubernetes' Kind cluster

Java, Sprinboot, ReactJS, Docker, Github actions, Websockets, Kubernetes

For users : 
1. Sign up and OTP authentication
2. Login/logout
3. Single Sign On(SSO) 
4. Create a canvas
5. Share a canvas among users to collaborate
6. Draw on canvas
7. Realtime collaboration using WebSockets
8. Track collaborators cursor using WebSockets
9. Export the drawing to PNG

App : https://mellifluous-pastelito-8bd691.netlify.app/
* __Possible points of failure: Please let me know if...__
  * Signup/OTP not working - Google App Password/sendgrid expired
  * Taking too long to launch - server on sleep due to inactivity
  * Login failing - MongoDB password may have expired
  * OTP taking too long - try again later
