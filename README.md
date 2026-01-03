# Collaborative Draw Web App

### For dev : 
1. Dockerised microservices
2. Builds immutable Docker images out of dev branch and deploys using Github actions self hosted runner on push
3. Auto patch the changes to test on Kubernetes' Kind cluster
4. No downtime on dev env while patching because of deployment and replica set
5. K8S job to delete the branch namespace after 5 min
6. [Babygrok](https://github.com/DeveshModi662/babygrok/blob/main/README.md)-CLI tool to create an index on the code and search on it

__Java, Sprinboot, ReactJS, MongoDB, Docker, Github actions, Websockets, Kubernetes(Cluster, node, namespaces, POD, Deployment, Replica set, ClusterIP service, NodePort service, configmap, Kustomization, Ingress)__

<img width="830" height="449" alt="DrawWithJobWithDeleteArrowWithServiceAcct" src="https://github.com/user-attachments/assets/9b23753d-3871-46fc-9e2f-2a0b4274fe0e" />

### For users : 
1. Sign up and OTP authentication
2. Login/logout
3. Single Sign On(SSO) 
4. Create a canvas
5. Share a canvas among users to collaborate
6. Draw on canvas
7. Event triggered real time collaboration
8. Track collaborators cursor using WebSockets
9. Export the drawing to PNG

App : https://mellifluous-pastelito-8bd691.netlify.app/
### Possible points of failure: Please let me know if...
 * Signup/OTP not working - Google App Password/sendgrid expired
 * Taking too long to launch - server on sleep due to inactivity-wait
 * Login failing - MongoDB password may have expired
 * OTP taking too long - wait


### Concurrency analysis
* Edits needs to be handled by atmoic upsert.
* or check [issue-advanced-enh-add delete/resize shape feature](https://github.com/DeveshModi662/Draw/issues/19).
