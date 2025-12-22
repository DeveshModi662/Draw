# Collaborative Draw Web App

For dev : 
1. Dockerised microservices
2. Builds immutable Docker images out of dev branch and deploys using Github actions self hosted runner on push
3. Auto patch the changes to test on Kubernetes' Kind cluster
4. No downtime on dev env while patching because of deployment and replica set
5. K8S job to delete the branch namespace after 5 min

__Java, Sprinboot, ReactJS, MongoDB, Docker, Github actions, Websockets, Kubernetes(Cluster, node, namespaces, POD, Deployment, Replica set, ClusterIP service, NodePort service, configmap, Kustomization, Ingress)__

<img width="830" height="449" alt="DrawWithJobWithDeleteArrowWithServiceAcct" src="https://github.com/user-attachments/assets/9b23753d-3871-46fc-9e2f-2a0b4274fe0e" />

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
