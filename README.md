# setel-app

## to start

- kubectl create -f ./kubernetes/namespace-setel.json
- kubectl create -f ./persistence
- kubectl create -f ./services/order-app/chart
- kubectl create -f ./services/payment-app/chart

port forward order-app to port 3000
port forward order-app to port 4000

http://localhost:3000/api/swagger
http://localhost:4000/api/swagger

1. create order first in order app
2. to update payment, using the id return put in put API payment app
3. you can check order status in order app for updated status

## to close app

- kubectl delete -f ./services/order-app/chart
- kubectl delete -f ./services/payment-app/chart
- kubectl delete -f ./persistence
- kubectl delete -f ./kubernetes/namespace-setel.json
